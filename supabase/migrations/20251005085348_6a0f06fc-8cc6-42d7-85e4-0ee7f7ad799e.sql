-- Create gmail_connections table
CREATE TABLE public.gmail_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gmail_email TEXT NOT NULL,
  encrypted_access_token TEXT NOT NULL,
  encrypted_refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  history_id TEXT,
  auto_reply_enabled BOOLEAN DEFAULT false,
  default_reply_mode TEXT DEFAULT 'draft' CHECK (default_reply_mode IN ('send', 'draft')),
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.gmail_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gmail_connections
CREATE POLICY "Users can view own gmail connection"
  ON public.gmail_connections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gmail connection"
  ON public.gmail_connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gmail connection"
  ON public.gmail_connections
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gmail connection"
  ON public.gmail_connections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create gmail_quota_usage table
CREATE TABLE public.gmail_quota_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_count INTEGER DEFAULT 0,
  monthly_count INTEGER DEFAULT 0,
  last_daily_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_monthly_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, usage_date)
);

-- Enable RLS
ALTER TABLE public.gmail_quota_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gmail_quota_usage
CREATE POLICY "Users can view own gmail quota"
  ON public.gmail_quota_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gmail quota"
  ON public.gmail_quota_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gmail quota"
  ON public.gmail_quota_usage
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Update email_limits table with Gmail quotas
INSERT INTO public.email_limits (plan_type, daily_gmail_quota, monthly_gmail_quota)
VALUES 
  ('zip', 150, 1500),
  ('max', 300, 3000)
ON CONFLICT (plan_type) 
DO UPDATE SET 
  daily_gmail_quota = EXCLUDED.daily_gmail_quota,
  monthly_gmail_quota = EXCLUDED.monthly_gmail_quota;

-- Ensure Free, Pro, and Ace have 0 quotas
UPDATE public.email_limits 
SET daily_gmail_quota = 0, monthly_gmail_quota = 0 
WHERE plan_type IN ('free', 'pro', 'ace');

-- Trigger for updated_at on gmail_connections
CREATE TRIGGER update_gmail_connections_updated_at
  BEFORE UPDATE ON public.gmail_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();