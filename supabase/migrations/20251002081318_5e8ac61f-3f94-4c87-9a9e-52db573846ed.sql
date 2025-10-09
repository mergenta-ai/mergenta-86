-- Fix security warning: Add search_path to function
CREATE OR REPLACE FUNCTION public.update_feature_limits_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;