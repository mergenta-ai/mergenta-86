-- Migration 1: Document Upload Tracking
CREATE TABLE IF NOT EXISTS public.document_upload_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_count INTEGER DEFAULT 0,
  file_name TEXT,
  file_size INTEGER,
  pages_extracted INTEGER,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_upload_user_date ON public.document_upload_usage(user_id, upload_date);

ALTER TABLE public.document_upload_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own upload usage"
  ON public.document_upload_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own upload usage"
  ON public.document_upload_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own upload usage"
  ON public.document_upload_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Migration 2: CloudConvert Usage Tracking
CREATE TABLE IF NOT EXISTS public.cloudconvert_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  export_date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_count INTEGER DEFAULT 0,
  export_type TEXT,
  conversation_id UUID,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cloudconvert_user_date ON public.cloudconvert_usage(user_id, export_date);

ALTER TABLE public.cloudconvert_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cloudconvert usage"
  ON public.cloudconvert_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cloudconvert usage"
  ON public.cloudconvert_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cloudconvert usage"
  ON public.cloudconvert_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Migration 3: Email Automation Usage Tracking
CREATE TABLE IF NOT EXISTS public.email_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_count INTEGER DEFAULT 0,
  monthly_count INTEGER DEFAULT 0,
  last_daily_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_monthly_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_usage_user_service_date ON public.email_usage(user_id, service_type, usage_date);

ALTER TABLE public.email_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email usage"
  ON public.email_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email usage"
  ON public.email_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email usage"
  ON public.email_usage FOR UPDATE
  USING (auth.uid() = user_id);