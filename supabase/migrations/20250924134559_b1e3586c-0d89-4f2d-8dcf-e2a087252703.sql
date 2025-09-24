-- Create user plans and quota management tables
CREATE TYPE public.plan_type AS ENUM ('free', 'starter', 'professional', 'enterprise');
CREATE TYPE public.quota_type AS ENUM ('daily', 'monthly', 'per_card', 'per_vendor');
CREATE TYPE public.vendor_type AS ENUM ('openai', 'anthropic', 'google', 'gemini', 'mistral', 'xai', 'elevenlabs');

-- User plans table
CREATE TABLE public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type plan_type NOT NULL DEFAULT 'free',
  subscription_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_end TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Plan limits configuration
CREATE TABLE public.plan_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type plan_type NOT NULL,
  feature_name TEXT NOT NULL,
  quota_type quota_type NOT NULL,
  limit_value INTEGER NOT NULL,
  reset_period TEXT, -- 'daily', 'monthly', 'never'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_type, feature_name, quota_type)
);

-- User quota tracking
CREATE TABLE public.user_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_name TEXT NOT NULL,
  quota_type quota_type NOT NULL,
  used_count INTEGER DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, feature_name, quota_type)
);

-- Vendor quota tracking
CREATE TABLE public.vendor_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_type vendor_type NOT NULL,
  quota_type quota_type NOT NULL,
  used_count INTEGER DEFAULT 0,
  limit_value INTEGER NOT NULL,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vendor_type, quota_type)
);

-- Search queries log
CREATE TABLE public.search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query_text TEXT NOT NULL,
  intent_type TEXT, -- 'knowledge', 'research', 'user_search'
  sources_used JSONB DEFAULT '[]', -- [{type: 'google', id: 'G1'}, {type: 'rss', id: 'RSS1'}]
  tokens_consumed INTEGER DEFAULT 0,
  search_results_count INTEGER DEFAULT 0,
  fallback_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSS feeds cache
CREATE TABLE public.rss_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  category TEXT,
  title TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  url TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(url)
);

-- Vendor fallback logs
CREATE TABLE public.vendor_fallbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_vendor vendor_type NOT NULL,
  fallback_vendor vendor_type,
  error_message TEXT,
  request_data JSONB,
  success BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings for RSS sources and configurations
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_fallbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own plan" ON public.user_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plan" ON public.user_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plan" ON public.user_plans FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Plan limits are publicly readable" ON public.plan_limits FOR SELECT USING (true);

CREATE POLICY "Users can view own quotas" ON public.user_quotas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotas" ON public.user_quotas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotas" ON public.user_quotas FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Vendor quotas are readable by authenticated users" ON public.vendor_quotas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view own search queries" ON public.search_queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own search queries" ON public.search_queries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "RSS feeds are publicly readable" ON public.rss_feeds FOR SELECT USING (true);

CREATE POLICY "Users can view own fallback logs" ON public.vendor_fallbacks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own fallback logs" ON public.vendor_fallbacks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin settings are readable by authenticated users" ON public.admin_settings FOR SELECT TO authenticated USING (true);

-- Insert default plan limits
INSERT INTO public.plan_limits (plan_type, feature_name, quota_type, limit_value, reset_period) VALUES
-- Free plan limits
('free', 'chat_requests', 'daily', 10, 'daily'),
('free', 'search_queries', 'daily', 3, 'daily'),
('free', 'ai_tokens', 'monthly', 10000, 'monthly'),
('free', 'email_generation', 'monthly', 5, 'monthly'),
('free', 'talk_mode_minutes', 'daily', 5, 'daily'),
('free', 'file_uploads', 'daily', 2, 'daily'),

-- Starter plan limits
('starter', 'chat_requests', 'daily', 50, 'daily'),
('starter', 'search_queries', 'daily', 15, 'daily'),
('starter', 'ai_tokens', 'monthly', 100000, 'monthly'),
('starter', 'email_generation', 'monthly', 25, 'monthly'),
('starter', 'talk_mode_minutes', 'daily', 30, 'daily'),
('starter', 'file_uploads', 'daily', 10, 'daily'),

-- Professional plan limits
('professional', 'chat_requests', 'daily', 200, 'daily'),
('professional', 'search_queries', 'daily', 50, 'daily'),
('professional', 'ai_tokens', 'monthly', 500000, 'monthly'),
('professional', 'email_generation', 'monthly', 100, 'monthly'),
('professional', 'talk_mode_minutes', 'daily', 120, 'daily'),
('professional', 'file_uploads', 'daily', 50, 'daily'),

-- Enterprise plan limits
('enterprise', 'chat_requests', 'daily', 1000, 'daily'),
('enterprise', 'search_queries', 'daily', 200, 'daily'),
('enterprise', 'ai_tokens', 'monthly', 2000000, 'monthly'),
('enterprise', 'email_generation', 'monthly', 500, 'monthly'),
('enterprise', 'talk_mode_minutes', 'daily', 300, 'daily'),
('enterprise', 'file_uploads', 'daily', 200, 'daily');

-- Insert default vendor quotas
INSERT INTO public.vendor_quotas (vendor_type, quota_type, used_count, limit_value) VALUES
('openai', 'daily', 0, 10000),
('anthropic', 'daily', 0, 8000),
('google', 'daily', 0, 5000),
('gemini', 'daily', 0, 6000),
('mistral', 'daily', 0, 4000),
('xai', 'daily', 0, 3000),
('elevenlabs', 'daily', 0, 1000);

-- Insert default RSS sources
INSERT INTO public.admin_settings (setting_key, setting_value, description) VALUES
('rss_sources', '[
  {"name": "BBC News", "url": "http://feeds.bbci.co.uk/news/rss.xml", "category": "news"},
  {"name": "Reuters", "url": "https://feeds.reuters.com/reuters/topNews", "category": "news"},
  {"name": "TechCrunch", "url": "https://techcrunch.com/feed/", "category": "technology"},
  {"name": "MIT Technology Review", "url": "https://www.technologyreview.com/feed/", "category": "technology"},
  {"name": "Harvard Business Review", "url": "https://feeds.hbr.org/harvardbusiness", "category": "business"}
]', 'Default RSS feed sources for news aggregation'),
('search_token_limits', '{"user_search": 500, "knowledge": 750, "research": 1000}', 'Token limits for different search types'),
('vendor_priority', '{"primary": ["openai", "anthropic"], "fallback": ["google", "gemini", "mistral", "xai"]}', 'Vendor priority and fallback chains');

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_quota_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_quotas_updated_at
  BEFORE UPDATE ON public.user_quotas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quota_updated_at();

CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON public.user_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quota_updated_at();