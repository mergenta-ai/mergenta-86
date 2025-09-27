-- Create search cache table for improved performance (simplified)
CREATE TABLE IF NOT EXISTS public.search_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for cache lookups
CREATE INDEX IF NOT EXISTS idx_search_cache_key ON public.search_cache (cache_key);
CREATE INDEX IF NOT EXISTS idx_search_cache_created ON public.search_cache (created_at);

-- Add columns to search_queries for enhanced monitoring
ALTER TABLE public.search_queries 
ADD COLUMN IF NOT EXISTS web_sources_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rss_sources_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cache_hits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create function to clean up expired cache entries (older than 48 hours)
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.search_cache 
  WHERE created_at < (now() - INTERVAL '48 hours');
END;
$$;