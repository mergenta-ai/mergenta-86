-- Priority 1 Part 3: Think Hard, Deep Research & Task Assistant
INSERT INTO public.feature_limits (feature_name, content_type, intent_type, plan_type, primary_model, fallback_models, daily_quota, max_words, allow_web_search, allow_model_overwrite) VALUES
-- Think Hard & Deep Research
('Think Hard', 'think_hard', 'knowledge', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 1, 250, true, false),
('Think Hard', 'think_hard', 'knowledge', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, true, false),
('Think Hard', 'think_hard', 'knowledge', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 5, 1200, true, false),
('Think Hard', 'think_hard', 'knowledge', 'ace', 'o3-mini', ARRAY['o3-pro', 'gpt-5'], 20, 2400, true, false),
('Think Hard', 'think_hard', 'knowledge', 'max', 'o3-pro', ARRAY['claude-4-sonnet', 'gpt-5'], 35, 2400, true, false),

('Deep Research', 'deep_research', 'research', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 1, 250, true, false),
('Deep Research', 'deep_research', 'research', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 3, 500, true, false),
('Deep Research', 'deep_research', 'research', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 5, 1200, true, false),
('Deep Research', 'deep_research', 'research', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'o3-mini'], 15, 2400, true, false),
('Deep Research', 'deep_research', 'research', 'max', 'claude-4-sonnet', ARRAY['o3-pro', 'gpt-5'], 25, 2400, true, false),

-- Task Assistant
('Brainstorm', 'brainstorm', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Brainstorm', 'brainstorm', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Brainstorm', 'brainstorm', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Brainstorm', 'brainstorm', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Brainstorm', 'brainstorm', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Scenario Planning', 'scenario', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Scenario Planning', 'scenario', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Scenario Planning', 'scenario', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Scenario Planning', 'scenario', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Scenario Planning', 'scenario', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Mentor', 'mentor', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Mentor', 'mentor', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Mentor', 'mentor', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Mentor', 'mentor', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Mentor', 'mentor', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Devils Advocate', 'devils_advocate', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Devils Advocate', 'devils_advocate', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Devils Advocate', 'devils_advocate', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Devils Advocate', 'devils_advocate', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Devils Advocate', 'devils_advocate', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Astro Lens', 'astro_lens', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Astro Lens', 'astro_lens', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Astro Lens', 'astro_lens', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Astro Lens', 'astro_lens', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Astro Lens', 'astro_lens', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false);