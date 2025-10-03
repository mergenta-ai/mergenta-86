-- Priority 1 Part 6: Default Search Bar Feature
INSERT INTO public.feature_limits (feature_name, content_type, intent_type, plan_type, primary_model, fallback_models, daily_quota, max_words, allow_web_search, allow_model_overwrite) VALUES
('Default Search', 'default_search', 'user_search', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, true, false),
('Default Search', 'default_search', 'user_search', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 20, 1000, true, false),
('Default Search', 'default_search', 'user_search', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 30, 1500, true, false),
('Default Search', 'default_search', 'user_search', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 90, 3000, true, false),
('Default Search', 'default_search', 'user_search', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 120, 3000, true, false);