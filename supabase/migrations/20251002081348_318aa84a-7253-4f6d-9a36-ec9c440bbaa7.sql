-- Fix security warning: Add search_path to cleanup_expired_cache function
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.search_cache 
  WHERE created_at < (now() - INTERVAL '48 hours');
END;
$$;