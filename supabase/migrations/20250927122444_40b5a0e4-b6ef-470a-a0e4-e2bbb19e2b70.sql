-- Enable RLS on search_cache table and add appropriate policies
ALTER TABLE public.search_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for search cache - allow system-level access since this is internal caching
CREATE POLICY "Search cache is accessible for internal operations" 
ON public.search_cache 
FOR ALL
USING (true)
WITH CHECK (true);

-- Note: This policy allows all operations because search_cache is an internal
-- performance optimization table used by edge functions, not user-facing data