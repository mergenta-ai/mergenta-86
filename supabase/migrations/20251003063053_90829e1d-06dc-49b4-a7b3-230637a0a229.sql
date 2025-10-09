-- Priority 1 Part 7: Model-Specific Search Options (Paid Plans Only)
INSERT INTO public.feature_limits (feature_name, content_type, intent_type, plan_type, primary_model, fallback_models, daily_quota, max_words, allow_web_search, allow_model_overwrite) VALUES
-- Gemini 2.5 Flash Search (Pro, Zip, Ace, Max)
('Gemini 2.5 Flash Search', 'model_search_gemini_flash', 'user_search', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite'], 20, 1000, true, true),
('Gemini 2.5 Flash Search', 'model_search_gemini_flash', 'user_search', 'zip', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite'], 30, 1500, true, true),
('Gemini 2.5 Flash Search', 'model_search_gemini_flash', 'user_search', 'ace', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite'], 90, 3000, true, true),
('Gemini 2.5 Flash Search', 'model_search_gemini_flash', 'user_search', 'max', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite'], 120, 3000, true, true),

-- Gemini 2.5 Pro Search (Zip, Ace, Max)
('Gemini 2.5 Pro Search', 'model_search_gemini_pro', 'user_search', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash'], 30, 1500, true, true),
('Gemini 2.5 Pro Search', 'model_search_gemini_pro', 'user_search', 'ace', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash'], 90, 3000, true, true),
('Gemini 2.5 Pro Search', 'model_search_gemini_pro', 'user_search', 'max', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash'], 120, 3000, true, true),

-- GPT-5 Search (Ace, Max)
('GPT-5 Search', 'model_search_gpt5', 'user_search', 'ace', 'gpt-5', ARRAY['gpt-5-mini'], 90, 3000, true, true),
('GPT-5 Search', 'model_search_gpt5', 'user_search', 'max', 'gpt-5', ARRAY['gpt-5-mini'], 120, 3000, true, true),

-- GPT-5 Mini Search (Pro, Zip, Ace, Max)
('GPT-5 Mini Search', 'model_search_gpt5_mini', 'user_search', 'pro', 'gpt-5-mini', ARRAY['gpt-5-nano'], 20, 1000, true, true),
('GPT-5 Mini Search', 'model_search_gpt5_mini', 'user_search', 'zip', 'gpt-5-mini', ARRAY['gpt-5-nano'], 30, 1500, true, true),
('GPT-5 Mini Search', 'model_search_gpt5_mini', 'user_search', 'ace', 'gpt-5-mini', ARRAY['gpt-5-nano'], 90, 3000, true, true),
('GPT-5 Mini Search', 'model_search_gpt5_mini', 'user_search', 'max', 'gpt-5-mini', ARRAY['gpt-5-nano'], 120, 3000, true, true),

-- O3-Mini Search (Ace, Max)
('O3-Mini Search', 'model_search_o3_mini', 'user_search', 'ace', 'o3-mini', ARRAY['gpt-5'], 90, 3000, true, true),
('O3-Mini Search', 'model_search_o3_mini', 'user_search', 'max', 'o3-mini', ARRAY['gpt-5'], 120, 3000, true, true),

-- O3-Pro Search (Ace, Max)
('O3-Pro Search', 'model_search_o3_pro', 'user_search', 'ace', 'o3-pro', ARRAY['o3-mini'], 90, 3000, true, true),
('O3-Pro Search', 'model_search_o3_pro', 'user_search', 'max', 'o3-pro', ARRAY['o3-mini'], 120, 3000, true, true),

-- Claude Sonnet Search (Max only)
('Claude Sonnet Search', 'model_search_claude_sonnet', 'user_search', 'max', 'claude-4-sonnet', ARRAY['gpt-5'], 120, 3000, true, true),

-- Claude Opus Search (Max only)
('Claude Opus Search', 'model_search_claude_opus', 'user_search', 'max', 'claude-4-opus', ARRAY['claude-4-sonnet'], 120, 3000, true, true),

-- Grok Fast Search (Pro, Zip, Ace, Max)
('Grok Fast Search', 'model_search_grok_fast', 'user_search', 'pro', 'grok-4-fast-non-reasoning', ARRAY['gemini-2.5-flash'], 20, 1000, true, true),
('Grok Fast Search', 'model_search_grok_fast', 'user_search', 'zip', 'grok-4-fast-non-reasoning', ARRAY['gemini-2.5-flash'], 30, 1500, true, true),
('Grok Fast Search', 'model_search_grok_fast', 'user_search', 'ace', 'grok-4-fast-non-reasoning', ARRAY['gemini-2.5-flash'], 90, 3000, true, true),
('Grok Fast Search', 'model_search_grok_fast', 'user_search', 'max', 'grok-4-fast-non-reasoning', ARRAY['gemini-2.5-flash'], 120, 3000, true, true);