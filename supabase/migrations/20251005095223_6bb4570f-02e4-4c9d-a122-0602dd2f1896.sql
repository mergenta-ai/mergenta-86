-- Create processing status enum
CREATE TYPE processing_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create gmail processing queue table
CREATE TABLE public.gmail_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  history_id TEXT NOT NULL,
  email_address TEXT NOT NULL,
  status processing_status DEFAULT 'pending',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_gmail_queue_status_created ON public.gmail_processing_queue(status, created_at);
CREATE INDEX idx_gmail_queue_user_id ON public.gmail_processing_queue(user_id);
CREATE INDEX idx_gmail_queue_history_id ON public.gmail_processing_queue(history_id);

-- Enable RLS
ALTER TABLE public.gmail_processing_queue ENABLE ROW LEVEL SECURITY;

-- Users can view their own queue items
CREATE POLICY "Users can view own queue items"
ON public.gmail_processing_queue
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert (for webhook)
CREATE POLICY "Service role can insert queue items"
ON public.gmail_processing_queue
FOR INSERT
WITH CHECK (true);

-- Service role can update (for worker)
CREATE POLICY "Service role can update queue items"
ON public.gmail_processing_queue
FOR UPDATE
USING (true);

-- Create cleanup function for 3-day retention
CREATE OR REPLACE FUNCTION public.cleanup_old_gmail_queue_entries()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.gmail_processing_queue
  WHERE created_at < (now() - INTERVAL '3 days');
  
  RAISE LOG 'Cleaned up gmail queue entries older than 3 days';
END;
$$;