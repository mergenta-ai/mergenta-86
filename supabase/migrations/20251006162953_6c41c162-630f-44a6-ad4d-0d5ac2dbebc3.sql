-- Phase 4: Email Sender Rules + Processing Logs (Mode-Agnostic Architecture)

-- Create enum for sender pattern types
CREATE TYPE public.sender_pattern_type AS ENUM ('exact', 'domain', 'wildcard');

-- Create enum for email actions
CREATE TYPE public.email_action AS ENUM ('reply', 'ignore', 'forward', 'flag');

-- Create enum for processing modes
CREATE TYPE public.processing_mode AS ENUM ('pull', 'push', 'hybrid');

-- Create enum for apply to mode
CREATE TYPE public.apply_to_mode AS ENUM ('both', 'pull', 'push');

-- Create enum for action taken
CREATE TYPE public.action_taken AS ENUM ('replied_draft', 'replied_sent', 'ignored', 'failed');

-- Create enum for processing trigger mode
CREATE TYPE public.processing_trigger_mode AS ENUM ('pull_manual', 'pull_user', 'push_worker');

-- 1. Email Sender Rules Table (Mode-Agnostic)
CREATE TABLE public.email_sender_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  sender_pattern_type sender_pattern_type NOT NULL DEFAULT 'exact',
  sender_name TEXT,
  action email_action NOT NULL DEFAULT 'reply',
  reply_mode TEXT CHECK (reply_mode IN ('draft', 'send')),
  custom_prompt TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  apply_to_mode apply_to_mode NOT NULL DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Email Processing Log Table (Detailed Audit Trail)
CREATE TABLE public.email_processing_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gmail_message_id TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  subject TEXT,
  processing_mode processing_trigger_mode NOT NULL,
  action_taken action_taken NOT NULL,
  rule_applied_id UUID REFERENCES public.email_sender_rules(id) ON DELETE SET NULL,
  rule_applied_name TEXT,
  ai_tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER DEFAULT 0,
  error_message TEXT,
  gmail_draft_id TEXT,
  gmail_message_sent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Email Processing Stats Table (Aggregated Metrics)
CREATE TABLE public.email_processing_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_processed INTEGER NOT NULL DEFAULT 0,
  total_ignored INTEGER NOT NULL DEFAULT 0,
  total_failed INTEGER NOT NULL DEFAULT 0,
  drafts_created INTEGER NOT NULL DEFAULT 0,
  emails_sent INTEGER NOT NULL DEFAULT 0,
  avg_processing_time_ms INTEGER NOT NULL DEFAULT 0,
  total_tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- 4. Update gmail_connections table
ALTER TABLE public.gmail_connections 
ADD COLUMN IF NOT EXISTS processing_mode processing_mode NOT NULL DEFAULT 'pull';

-- Enable RLS
ALTER TABLE public.email_sender_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_processing_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_processing_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_sender_rules
CREATE POLICY "Users can view own sender rules"
  ON public.email_sender_rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sender rules"
  ON public.email_sender_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sender rules"
  ON public.email_sender_rules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sender rules"
  ON public.email_sender_rules FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sender rules"
  ON public.email_sender_rules FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for email_processing_log
CREATE POLICY "Users can view own processing logs"
  ON public.email_processing_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert processing logs"
  ON public.email_processing_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all processing logs"
  ON public.email_processing_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for email_processing_stats
CREATE POLICY "Users can view own processing stats"
  ON public.email_processing_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can manage processing stats"
  ON public.email_processing_stats FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view all processing stats"
  ON public.email_processing_stats FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_email_sender_rules_user_id ON public.email_sender_rules(user_id);
CREATE INDEX idx_email_sender_rules_priority ON public.email_sender_rules(user_id, priority) WHERE is_active = true;
CREATE INDEX idx_email_processing_log_user_id ON public.email_processing_log(user_id);
CREATE INDEX idx_email_processing_log_created_at ON public.email_processing_log(created_at DESC);
CREATE INDEX idx_email_processing_log_gmail_message_id ON public.email_processing_log(gmail_message_id);
CREATE INDEX idx_email_processing_stats_user_date ON public.email_processing_stats(user_id, date);

-- Trigger for updating updated_at
CREATE TRIGGER update_email_sender_rules_updated_at
  BEFORE UPDATE ON public.email_sender_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_processing_stats_updated_at
  BEFORE UPDATE ON public.email_processing_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();