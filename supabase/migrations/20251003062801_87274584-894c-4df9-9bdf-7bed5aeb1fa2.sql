-- Priority 1 Part 2: Personal, Social, Institutional & Formal Letters
INSERT INTO public.feature_limits (feature_name, content_type, intent_type, plan_type, primary_model, fallback_models, daily_quota, max_words, allow_web_search, allow_model_overwrite) VALUES
-- Personal Letters
('Love Letter', 'love_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Love Letter', 'love_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Love Letter', 'love_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Love Letter', 'love_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Love Letter', 'love_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Apology Letter', 'apology_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Apology Letter', 'apology_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Apology Letter', 'apology_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Apology Letter', 'apology_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Apology Letter', 'apology_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Thank You Letter', 'thank_you_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Thank You Letter', 'thank_you_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Thank You Letter', 'thank_you_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Thank You Letter', 'thank_you_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Thank You Letter', 'thank_you_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Condolence Letter', 'condolence_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Condolence Letter', 'condolence_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Condolence Letter', 'condolence_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Condolence Letter', 'condolence_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Condolence Letter', 'condolence_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

-- Social Letters
('Invitation Letter', 'invitation_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Invitation Letter', 'invitation_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Invitation Letter', 'invitation_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Invitation Letter', 'invitation_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Invitation Letter', 'invitation_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Congratulatory Letter', 'congratulatory_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Congratulatory Letter', 'congratulatory_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Congratulatory Letter', 'congratulatory_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Congratulatory Letter', 'congratulatory_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Congratulatory Letter', 'congratulatory_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Welcome Letter', 'welcome_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Welcome Letter', 'welcome_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Welcome Letter', 'welcome_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Welcome Letter', 'welcome_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Welcome Letter', 'welcome_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Farewell Letter', 'farewell_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Farewell Letter', 'farewell_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Farewell Letter', 'farewell_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Farewell Letter', 'farewell_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Farewell Letter', 'farewell_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

-- Institutional Letters
('Leave Application', 'leave_application', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Leave Application', 'leave_application', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Leave Application', 'leave_application', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Leave Application', 'leave_application', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Leave Application', 'leave_application', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Permission Letter', 'permission_letter', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Permission Letter', 'permission_letter', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Permission Letter', 'permission_letter', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Permission Letter', 'permission_letter', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Permission Letter', 'permission_letter', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Appreciation Letter', 'appreciation_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Appreciation Letter', 'appreciation_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Appreciation Letter', 'appreciation_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Appreciation Letter', 'appreciation_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Appreciation Letter', 'appreciation_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Appointment Request', 'appointment_request', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Appointment Request', 'appointment_request', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Appointment Request', 'appointment_request', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Appointment Request', 'appointment_request', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Appointment Request', 'appointment_request', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Publication Request', 'publication_request', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Publication Request', 'publication_request', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Publication Request', 'publication_request', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Publication Request', 'publication_request', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Publication Request', 'publication_request', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

-- Formal Letters
('Complaint Letter', 'complaint_letter', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Complaint Letter', 'complaint_letter', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Complaint Letter', 'complaint_letter', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Complaint Letter', 'complaint_letter', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Complaint Letter', 'complaint_letter', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Recommendation Letter', 'recommendation_letter', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Recommendation Letter', 'recommendation_letter', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Recommendation Letter', 'recommendation_letter', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Recommendation Letter', 'recommendation_letter', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Recommendation Letter', 'recommendation_letter', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('Request Letter', 'request_letter', 'strategic', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('Request Letter', 'request_letter', 'strategic', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('Request Letter', 'request_letter', 'strategic', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('Request Letter', 'request_letter', 'strategic', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('Request Letter', 'request_letter', 'strategic', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false),

('General Letter', 'general_letter', 'communication', 'free', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 2, 250, false, false),
('General Letter', 'general_letter', 'communication', 'pro', 'gemini-2.5-flash', ARRAY['gemini-2.5-flash-lite', 'gpt-5-nano'], 5, 500, false, false),
('General Letter', 'general_letter', 'communication', 'zip', 'gemini-2.5-pro', ARRAY['gemini-2.5-flash', 'gpt-5-mini'], 10, 1200, false, false),
('General Letter', 'general_letter', 'communication', 'ace', 'gpt-5', ARRAY['gemini-2.5-pro', 'gpt-5-mini'], 60, 2400, false, false),
('General Letter', 'general_letter', 'communication', 'max', 'claude-4-sonnet', ARRAY['gpt-5', 'o3-pro'], 60, 2400, false, false);