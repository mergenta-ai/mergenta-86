-- Assign 'zip' plan to test Gmail users
INSERT INTO public.user_plans (user_id, plan_type, is_active, subscription_start)
VALUES 
  ('5b65ca2d-7672-45c2-957a-06259e540a50', 'zip', true, NOW()),
  ('88a93685-9072-4d34-8d4b-f7d076623dc6', 'zip', true, NOW())
ON CONFLICT (user_id) 
DO UPDATE SET 
  plan_type = EXCLUDED.plan_type,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();