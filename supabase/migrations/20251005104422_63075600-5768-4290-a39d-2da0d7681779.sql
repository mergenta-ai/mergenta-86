-- Phase 1: Create Role-Based Access Control System

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at timestamp with time zone DEFAULT now(),
    notes text,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has specific role (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function to check if user has admin OR moderator role
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'moderator')
  )
$$;

-- Create function to check if user is super admin (mergentaai@gmail.com)
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = _user_id
      AND email = 'mergentaai@gmail.com'
  )
$$;

-- RLS Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Admin and moderators can view all roles
CREATE POLICY "Admins and moderators can view all roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin_or_moderator(auth.uid()));

-- RLS Policy: Only super admin can manage roles
CREATE POLICY "Only super admin can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Only super admin can update roles"
ON public.user_roles
FOR UPDATE
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Only super admin can delete roles"
ON public.user_roles
FOR DELETE
USING (public.is_super_admin(auth.uid()));

-- Seed super admin role for mergentaai@gmail.com (if user exists)
INSERT INTO public.user_roles (user_id, role, assigned_by, notes)
SELECT 
  id, 
  'admin'::app_role, 
  id, 
  'Super admin - System assigned'
FROM auth.users
WHERE email = 'mergentaai@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;