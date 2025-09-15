-- Create prompt templates table for centralized prompt management
CREATE TABLE public.prompt_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  template_function TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prompt categories table for organization
CREATE TABLE public.prompt_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (templates should be readable by all)
CREATE POLICY "Prompt templates are publicly readable"
ON public.prompt_templates
FOR SELECT
USING (true);

CREATE POLICY "Prompt categories are publicly readable"
ON public.prompt_categories
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_prompt_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prompt_templates_updated_at
BEFORE UPDATE ON public.prompt_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_prompt_templates_updated_at();

-- Insert prompt categories
INSERT INTO public.prompt_categories (name, description, sort_order) VALUES
('communication', 'Letters and formal communication templates', 1),
('creative', 'Creative writing and content templates', 2),
('strategic', 'Strategic thinking and analysis templates', 3);

-- Insert all 29 content types into prompt_templates
INSERT INTO public.prompt_templates (content_type, category, template_function) VALUES
-- Communication types (17)
('love_letter', 'communication', 'communicationPrompts.love_letter'),
('apology_letter', 'communication', 'communicationPrompts.apology_letter'),
('appreciation_letter', 'communication', 'communicationPrompts.appreciation_letter'),
('general_letter', 'communication', 'communicationPrompts.general_letter'),
('thank_you_letter', 'communication', 'communicationPrompts.thank_you_letter'),
('welcome_letter', 'communication', 'communicationPrompts.welcome_letter'),
('congratulatory_letter', 'communication', 'communicationPrompts.congratulatory_letter'),
('condolence_letter', 'communication', 'communicationPrompts.condolence_letter'),
('complaint_letter', 'communication', 'communicationPrompts.complaint_letter'),
('invitation_letter', 'communication', 'communicationPrompts.invitation_letter'),
('farewell_letter', 'communication', 'communicationPrompts.farewell_letter'),
('leave_application', 'communication', 'communicationPrompts.leave_application'),
('permission_letter', 'communication', 'communicationPrompts.permission_letter'),
('publication_request', 'communication', 'communicationPrompts.publication_request'),
('recommendation_letter', 'communication', 'communicationPrompts.recommendation_letter'),
('appointment_request', 'communication', 'communicationPrompts.appointment_request'),
('request_letter', 'communication', 'communicationPrompts.request_letter'),

-- Creative types (7)
('essay', 'creative', 'creativePrompts.essay'),
('story', 'creative', 'creativePrompts.story'),
('flash_fiction', 'creative', 'creativePrompts.flash_fiction'),
('poetry', 'creative', 'creativePrompts.poetry'),
('script', 'creative', 'creativePrompts.script'),
('speech', 'creative', 'creativePrompts.speech'),
('blog', 'creative', 'creativePrompts.blog'),

-- Strategic types (5 - Note: scenario_planning mapped to scenario for consistency)
('brainstorm', 'strategic', 'strategicPrompts.brainstorm'),
('devils_advocate', 'strategic', 'strategicPrompts.devils_advocate'),
('mentor', 'strategic', 'strategicPrompts.mentor'),
('scenario', 'strategic', 'strategicPrompts.scenario'),
('astro_lens', 'strategic', 'strategicPrompts.astro_lens');

-- Create indexes for better performance
CREATE INDEX idx_prompt_templates_content_type ON public.prompt_templates(content_type);
CREATE INDEX idx_prompt_templates_category ON public.prompt_templates(category);
CREATE INDEX idx_prompt_templates_active ON public.prompt_templates(is_active);