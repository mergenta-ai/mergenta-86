-- Priority 1 Part 4: Experience Studio Features
INSERT INTO public.feature_limits (feature_name, content_type, intent_type, plan_type, primary_model, fallback_models, daily_quota, max_words, allow_web_search, allow_model_overwrite) VALUES
('360 Snapshot', 'snapshot', 'experience_studio', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 1, 250, false, false),
('360 Snapshot', 'snapshot', 'experience_studio', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 3, 500, false, false),
('360 Snapshot', 'snapshot', 'experience_studio', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 5, 1200, false, false),
('360 Snapshot', 'snapshot', 'experience_studio', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 15, 2400, false, false),
('360 Snapshot', 'snapshot', 'experience_studio', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 25, 2400, false, false),

('POV Lab', 'pov_lab', 'experience_studio', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 1, 250, false, false),
('POV Lab', 'pov_lab', 'experience_studio', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 3, 500, false, false),
('POV Lab', 'pov_lab', 'experience_studio', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 5, 1200, false, false),
('POV Lab', 'pov_lab', 'experience_studio', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 15, 2400, false, false),
('POV Lab', 'pov_lab', 'experience_studio', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 25, 2400, false, false),

('Future Pathways', 'future_pathways', 'experience_studio', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 1, 250, false, false),
('Future Pathways', 'future_pathways', 'experience_studio', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 3, 500, false, false),
('Future Pathways', 'future_pathways', 'experience_studio', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 5, 1200, false, false),
('Future Pathways', 'future_pathways', 'experience_studio', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 15, 2400, false, false),
('Future Pathways', 'future_pathways', 'experience_studio', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 25, 2400, false, false),

('Roleplay Hub', 'roleplay_hub', 'experience_studio', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 1, 250, false, false),
('Roleplay Hub', 'roleplay_hub', 'experience_studio', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 3, 500, false, false),
('Roleplay Hub', 'roleplay_hub', 'experience_studio', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 5, 1200, false, false),
('Roleplay Hub', 'roleplay_hub', 'experience_studio', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 15, 2400, false, false),
('Roleplay Hub', 'roleplay_hub', 'experience_studio', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 25, 2400, false, false),

('Reality Check', 'reality_check', 'experience_studio', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 1, 250, false, false),
('Reality Check', 'reality_check', 'experience_studio', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 3, 500, false, false),
('Reality Check', 'reality_check', 'experience_studio', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 5, 1200, false, false),
('Reality Check', 'reality_check', 'experience_studio', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 15, 2400, false, false),
('Reality Check', 'reality_check', 'experience_studio', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 25, 2400, false, false),

('Proto Run', 'proto_run', 'experience_studio', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 1, 250, false, false),
('Proto Run', 'proto_run', 'experience_studio', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 3, 500, false, false),
('Proto Run', 'proto_run', 'experience_studio', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 5, 1200, false, false),
('Proto Run', 'proto_run', 'experience_studio', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 15, 2400, false, false),
('Proto Run', 'proto_run', 'experience_studio', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 25, 2400, false, false);