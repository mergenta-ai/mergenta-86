-- Fix function search path security issue by dropping triggers first
DROP TRIGGER IF EXISTS update_user_quotas_updated_at ON public.user_quotas;
DROP TRIGGER IF EXISTS update_user_plans_updated_at ON public.user_plans;
DROP FUNCTION IF EXISTS public.update_quota_updated_at();

CREATE OR REPLACE FUNCTION public.update_quota_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate triggers
CREATE TRIGGER update_user_quotas_updated_at
  BEFORE UPDATE ON public.user_quotas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quota_updated_at();

CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON public.user_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quota_updated_at();