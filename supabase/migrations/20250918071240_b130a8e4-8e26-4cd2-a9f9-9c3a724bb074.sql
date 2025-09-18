-- Add new fields to profiles table for enhanced bio functionality
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS middle_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'private';

-- Add new fields to user_preferences table for enhanced preferences
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS memory_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS ai_personality TEXT DEFAULT 'professional';
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS theme_variant TEXT DEFAULT 'default';
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT 'medium';
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS high_contrast BOOLEAN DEFAULT false;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS marketing_notifications BOOLEAN DEFAULT false;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS auto_save_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS message_persistence BOOLEAN DEFAULT true;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS data_sharing_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS analytics_enabled BOOLEAN DEFAULT true;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON public.profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_profiles_last_name ON public.profiles(last_name);
CREATE INDEX IF NOT EXISTS idx_user_preferences_memory_enabled ON public.user_preferences(memory_enabled);
CREATE INDEX IF NOT EXISTS idx_user_preferences_theme_variant ON public.user_preferences(theme_variant);