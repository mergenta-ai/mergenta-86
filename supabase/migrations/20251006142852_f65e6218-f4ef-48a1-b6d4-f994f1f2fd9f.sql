-- Upgrade three users to Zip plan
-- First, ensure they have entries in user_plans, then update them

-- Insert or update for satyen.srivastava@gmail.com
INSERT INTO public.user_plans (user_id, plan_type, subscription_start, is_active)
VALUES (
  '22a56a2d-8fbf-4c2c-8a04-6d955a04a37e',
  'zip',
  now(),
  true
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  plan_type = 'zip',
  subscription_start = now(),
  is_active = true,
  updated_at = now();

-- Insert or update for anurag.vidyarthi@gmail.com
INSERT INTO public.user_plans (user_id, plan_type, subscription_start, is_active)
VALUES (
  '35fabb6b-ff31-4c8e-967b-1850d0f4fe42',
  'zip',
  now(),
  true
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  plan_type = 'zip',
  subscription_start = now(),
  is_active = true,
  updated_at = now();

-- Insert or update for amyassassin@gmail.com
INSERT INTO public.user_plans (user_id, plan_type, subscription_start, is_active)
VALUES (
  '2d74e01c-2f22-4a3e-8994-97b229409a5c',
  'zip',
  now(),
  true
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  plan_type = 'zip',
  subscription_start = now(),
  is_active = true,
  updated_at = now();