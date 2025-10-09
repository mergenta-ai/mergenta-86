-- Add model_name column to vendor_quotas for model-level tracking
ALTER TABLE public.vendor_quotas ADD COLUMN IF NOT EXISTS model_name text;

-- Create unique constraint for vendor + model combination
ALTER TABLE public.vendor_quotas DROP CONSTRAINT IF EXISTS vendor_quotas_vendor_model_unique;
ALTER TABLE public.vendor_quotas ADD CONSTRAINT vendor_quotas_vendor_model_unique 
  UNIQUE (vendor_type, model_name, quota_type);

-- Create admin_quota_config table for managing model quotas from admin panel
CREATE TABLE IF NOT EXISTS public.admin_quota_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_type vendor_type NOT NULL,
  model_name text NOT NULL,
  quota_type quota_type NOT NULL,
  limit_value integer NOT NULL,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(vendor_type, model_name, quota_type)
);

-- Enable RLS on admin_quota_config
ALTER TABLE public.admin_quota_config ENABLE ROW LEVEL SECURITY;

-- Admins can manage quota configs
CREATE POLICY "Admins can view quota configs"
  ON public.admin_quota_config FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert quota configs"
  ON public.admin_quota_config FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quota configs"
  ON public.admin_quota_config FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quota configs"
  ON public.admin_quota_config FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for admin_quota_config
CREATE TRIGGER update_admin_quota_config_updated_at
  BEFORE UPDATE ON public.admin_quota_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();