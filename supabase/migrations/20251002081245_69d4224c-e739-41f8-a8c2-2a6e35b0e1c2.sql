-- Phase 1: Update Enum and Existing Data
-- Step 1: Remove defaults
ALTER TABLE public.user_plans ALTER COLUMN plan_type DROP DEFAULT;
ALTER TABLE public.plan_limits ALTER COLUMN plan_type DROP DEFAULT;

-- Step 2: Rename old enum
ALTER TYPE public.plan_type RENAME TO plan_type_old;

-- Step 3: Create new enum with values: free, pro, zip, ace, max
CREATE TYPE public.plan_type AS ENUM ('free', 'pro', 'zip', 'ace', 'max');

-- Step 4 & 5: Update plan_limits table and column type
ALTER TABLE public.plan_limits 
  ALTER COLUMN plan_type TYPE public.plan_type 
  USING CASE 
    WHEN plan_type::text = 'free' THEN 'free'::public.plan_type
    WHEN plan_type::text = 'starter' THEN 'pro'::public.plan_type
    WHEN plan_type::text = 'professional' THEN 'ace'::public.plan_type
    WHEN plan_type::text = 'enterprise' THEN 'max'::public.plan_type
    ELSE 'free'::public.plan_type
  END;

-- Step 6: Update user_plans column type (empty table, safe conversion)
ALTER TABLE public.user_plans 
  ALTER COLUMN plan_type TYPE public.plan_type 
  USING CASE 
    WHEN plan_type::text = 'free' THEN 'free'::public.plan_type
    WHEN plan_type::text = 'starter' THEN 'pro'::public.plan_type
    WHEN plan_type::text = 'professional' THEN 'ace'::public.plan_type
    WHEN plan_type::text = 'enterprise' THEN 'max'::public.plan_type
    ELSE 'free'::public.plan_type
  END;

-- Step 7: Drop old enum (no dependencies left)
DROP TYPE public.plan_type_old;

-- Step 8: Restore defaults
ALTER TABLE public.user_plans ALTER COLUMN plan_type SET DEFAULT 'free'::public.plan_type;
ALTER TABLE public.plan_limits ALTER COLUMN plan_type SET DEFAULT 'free'::public.plan_type;

-- Phase 2: Create New Tables
-- Step 9: Create feature_limits table
CREATE TABLE IF NOT EXISTS public.feature_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type public.plan_type NOT NULL,
  feature_name TEXT NOT NULL,
  content_type TEXT,
  intent_type TEXT,
  primary_model TEXT NOT NULL,
  fallback_models TEXT[],
  daily_quota INTEGER NOT NULL DEFAULT 0,
  max_words INTEGER NOT NULL DEFAULT 0,
  allow_web_search BOOLEAN DEFAULT FALSE,
  allow_model_overwrite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_type, feature_name, content_type)
);

-- Step 10: Create router_config table
CREATE TABLE IF NOT EXISTS public.router_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type public.plan_type NOT NULL UNIQUE,
  sync_token_limit INTEGER NOT NULL,
  async_token_limit INTEGER NOT NULL,
  daily_gen_quota INTEGER NOT NULL,
  monthly_gen_quota INTEGER NOT NULL,
  daily_web_search_quota INTEGER NOT NULL,
  monthly_web_search_quota INTEGER NOT NULL,
  monthly_document_upload_quota INTEGER NOT NULL,
  monthly_image_quota INTEGER NOT NULL,
  monthly_video_quota INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 11: Create export_limits table
CREATE TABLE IF NOT EXISTS public.export_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type public.plan_type NOT NULL UNIQUE,
  daily_txt_download INTEGER DEFAULT 999999,
  daily_google_docs_export INTEGER DEFAULT 0,
  daily_google_sheets_export INTEGER DEFAULT 0,
  daily_cloudconvert_quota INTEGER DEFAULT 0,
  daily_document_upload INTEGER DEFAULT 0,
  max_document_pages INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 12: Create email_limits table
CREATE TABLE IF NOT EXISTS public.email_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type public.plan_type NOT NULL UNIQUE,
  daily_gmail_quota INTEGER DEFAULT 0,
  daily_outlook_quota INTEGER DEFAULT 0,
  monthly_gmail_quota INTEGER DEFAULT 0,
  monthly_outlook_quota INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 13: Add daily_minutes_limit to talk_mode_usage
ALTER TABLE public.talk_mode_usage ADD COLUMN IF NOT EXISTS daily_minutes_limit NUMERIC DEFAULT 5;

-- Phase 3: Enable Security
-- Step 14: Enable RLS on all new tables
ALTER TABLE public.feature_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.router_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_limits ENABLE ROW LEVEL SECURITY;

-- Step 15: Create public read policies
CREATE POLICY "Feature limits are publicly readable" ON public.feature_limits FOR SELECT USING (true);
CREATE POLICY "Router config is publicly readable" ON public.router_config FOR SELECT USING (true);
CREATE POLICY "Export limits are publicly readable" ON public.export_limits FOR SELECT USING (true);
CREATE POLICY "Email limits are publicly readable" ON public.email_limits FOR SELECT USING (true);

-- Step 16: Add update triggers
CREATE OR REPLACE FUNCTION public.update_feature_limits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feature_limits_updated_at
  BEFORE UPDATE ON public.feature_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_feature_limits_updated_at();

-- Phase 4: Populate Initial Data
-- Step 17: Insert router config data from Excel
INSERT INTO public.router_config (plan_type, sync_token_limit, async_token_limit, daily_gen_quota, monthly_gen_quota, daily_web_search_quota, monthly_web_search_quota, monthly_document_upload_quota, monthly_image_quota, monthly_video_quota) VALUES
  ('free', 1500, 2000, 25, 250, 5, 50, 10, 0, 0),
  ('pro', 2000, 3000, 100, 1000, 25, 250, 30, 3, 0),
  ('zip', 2000, 3000, 125, 1250, 30, 300, 30, 3, 0),
  ('ace', 2150, 4500, 250, 2500, 50, 500, 75, 10, 0),
  ('max', 2250, 7500, 1000, 7500, 100, 1000, 200, 25, 0);

-- Step 18: Insert export limits
INSERT INTO public.export_limits (plan_type, daily_txt_download, daily_google_docs_export, daily_google_sheets_export, daily_cloudconvert_quota, daily_document_upload, max_document_pages) VALUES
  ('free', 999999, 0, 0, 0, 1, 10),
  ('pro', 999999, 999999, 999999, 5, 5, 50),
  ('zip', 999999, 999999, 999999, 10, 10, 50),
  ('ace', 999999, 999999, 999999, 20, 20, 100),
  ('max', 999999, 999999, 999999, 30, 30, 150);

-- Step 19: Insert email limits
INSERT INTO public.email_limits (plan_type, daily_gmail_quota, daily_outlook_quota, monthly_gmail_quota, monthly_outlook_quota) VALUES
  ('free', 0, 0, 0, 0),
  ('pro', 0, 0, 0, 0),
  ('zip', 150, 150, 1500, 1500),
  ('ace', 0, 0, 0, 0),
  ('max', 300, 300, 3000, 3000);