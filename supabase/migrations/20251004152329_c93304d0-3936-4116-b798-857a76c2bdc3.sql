-- Add image_url column to rss_feeds table
ALTER TABLE public.rss_feeds 
ADD COLUMN IF NOT EXISTS image_url TEXT;