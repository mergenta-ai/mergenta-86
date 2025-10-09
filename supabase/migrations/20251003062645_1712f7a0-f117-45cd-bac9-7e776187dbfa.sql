-- Priority 1 Part 1: Beautiful Writing Features
INSERT INTO public.feature_limits (feature_name, content_type, intent_type, plan_type, primary_model, fallback_models, daily_quota, max_words, allow_web_search, allow_model_overwrite) VALUES
-- Essay
('Essay', 'essay', 'creative', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Essay', 'essay', 'creative', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Essay', 'essay', 'creative', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Essay', 'essay', 'creative', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Essay', 'essay', 'creative', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

-- Story
('Story', 'story', 'creative', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Story', 'story', 'creative', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Story', 'story', 'creative', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Story', 'story', 'creative', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Story', 'story', 'creative', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

-- Flash Fiction
('Flash Fiction', 'flash_fiction', 'creative', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Flash Fiction', 'flash_fiction', 'creative', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Flash Fiction', 'flash_fiction', 'creative', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Flash Fiction', 'flash_fiction', 'creative', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Flash Fiction', 'flash_fiction', 'creative', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

-- Script
('Script', 'script', 'creative', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Script', 'script', 'creative', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Script', 'script', 'creative', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Script', 'script', 'creative', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Script', 'script', 'creative', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

-- Blog
('Blog', 'blog', 'creative', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Blog', 'blog', 'creative', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Blog', 'blog', 'creative', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Blog', 'blog', 'creative', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Blog', 'blog', 'creative', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

-- Poetry
('Poetry', 'poetry', 'creative', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Poetry', 'poetry', 'creative', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Poetry', 'poetry', 'creative', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Poetry', 'poetry', 'creative', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Poetry', 'poetry', 'creative', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

-- Speech
('Speech', 'speech', 'creative', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Speech', 'speech', 'creative', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Speech', 'speech', 'creative', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Speech', 'speech', 'creative', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Speech', 'speech', 'creative', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false);