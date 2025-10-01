-- Create table for tracking talk mode usage
CREATE TABLE IF NOT EXISTS public.talk_mode_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_minutes DECIMAL(10, 2) NOT NULL DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.talk_mode_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own talk mode usage"
ON public.talk_mode_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own talk mode usage"
ON public.talk_mode_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own talk mode usage"
ON public.talk_mode_usage
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_talk_mode_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_talk_mode_usage_updated_at
BEFORE UPDATE ON public.talk_mode_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_talk_mode_usage_updated_at();