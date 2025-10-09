-- Priority 1 Part 5: Media Features (Document, Image, Video, Voice)
INSERT INTO public.feature_limits (feature_name, content_type, intent_type, plan_type, primary_model, fallback_models, daily_quota, max_words, allow_web_search, allow_model_overwrite) VALUES
-- Document Upload
('Document Upload', 'document_upload', 'knowledge', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite'], 0, 0, false, false),
('Document Upload', 'document_upload', 'knowledge', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite'], 5, 0, false, false),
('Document Upload', 'document_upload', 'knowledge', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash'], 5, 0, false, false),
('Document Upload', 'document_upload', 'knowledge', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro'], 30, 0, false, false),
('Document Upload', 'document_upload', 'knowledge', 'max', 'claude-4-sonnet', ARRAY['gpt-5'], 50, 0, false, false),

-- Image Generation
('Image Generation', 'image_generation', 'creative', 'free', 'dall-e-3', ARRAY[]::text[], 0, 0, false, false),
('Image Generation', 'image_generation', 'creative', 'pro', 'dall-e-3', ARRAY[]::text[], 3, 0, false, false),
('Image Generation', 'image_generation', 'creative', 'zip', 'dall-e-3', ARRAY[]::text[], 3, 0, false, false),
('Image Generation', 'image_generation', 'creative', 'ace', 'dall-e-3', ARRAY[]::text[], 10, 0, false, false),
('Image Generation', 'image_generation', 'creative', 'max', 'dall-e-3', ARRAY[]::text[], 25, 0, false, false),

-- Video Generation
('Video Generation', 'video_generation', 'creative', 'free', 'none', ARRAY[]::text[], 0, 0, false, false),
('Video Generation', 'video_generation', 'creative', 'pro', 'none', ARRAY[]::text[], 0, 0, false, false),
('Video Generation', 'video_generation', 'creative', 'zip', 'none', ARRAY[]::text[], 0, 0, false, false),
('Video Generation', 'video_generation', 'creative', 'ace', 'none', ARRAY[]::text[], 0, 0, false, false),
('Video Generation', 'video_generation', 'creative', 'max', 'none', ARRAY[]::text[], 0, 0, false, false),

-- Voice Input
('Voice Input', 'voice_input', 'communication', 'free', 'whisper-1', ARRAY[]::text[], 5, 0, false, false),
('Voice Input', 'voice_input', 'communication', 'pro', 'whisper-1', ARRAY[]::text[], 10, 0, false, false),
('Voice Input', 'voice_input', 'communication', 'zip', 'whisper-1', ARRAY[]::text[], 15, 0, false, false),
('Voice Input', 'voice_input', 'communication', 'ace', 'whisper-1', ARRAY[]::text[], 45, 0, false, false),
('Voice Input', 'voice_input', 'communication', 'max', 'whisper-1', ARRAY[]::text[], 60, 0, false, false);