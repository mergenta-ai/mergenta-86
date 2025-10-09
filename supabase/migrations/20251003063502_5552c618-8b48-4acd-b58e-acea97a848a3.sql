-- Priority 2 Part 2: Populate vendor_quotas with UPSERT (update existing, insert new)
INSERT INTO public.vendor_quotas (vendor_type, quota_type, limit_value, used_count, last_reset) VALUES
-- Anthropic
('anthropic', 'daily', 80000, 0, now()),
('anthropic', 'monthly', 2400000, 0, now()),

-- ElevenLabs
('elevenlabs', 'daily', 20000, 0, now()),
('elevenlabs', 'monthly', 600000, 0, now()),

-- Google (Gemini)
('google', 'daily', 150000, 0, now()),
('google', 'monthly', 4500000, 0, now()),

-- CloudConvert
('cloudconvert', 'daily', 5000, 0, now()),
('cloudconvert', 'monthly', 150000, 0, now()),

-- Local (STT/TTS)
('local', 'daily', 999999, 0, now()),
('local', 'monthly', 999999, 0, now()),

-- Meta (Llama models)
('meta', 'daily', 100000, 0, now()),
('meta', 'monthly', 3000000, 0, now()),

-- Microsoft (Azure)
('microsoft', 'daily', 50000, 0, now()),
('microsoft', 'monthly', 1500000, 0, now()),

-- Mistral
('mistral', 'daily', 70000, 0, now()),
('mistral', 'monthly', 2100000, 0, now()),

-- OpenAI
('openai', 'daily', 120000, 0, now()),
('openai', 'monthly', 3600000, 0, now()),

-- xAI (Grok)
('xai', 'daily', 90000, 0, now()),
('xai', 'monthly', 2700000, 0, now())
ON CONFLICT (vendor_type, quota_type) 
DO UPDATE SET 
  limit_value = EXCLUDED.limit_value,
  updated_at = now();