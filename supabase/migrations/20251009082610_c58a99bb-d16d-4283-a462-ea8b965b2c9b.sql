-- Create card_drafts table for persistent hover card data
CREATE TABLE public.card_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  draft_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_id)
);

-- Enable RLS
ALTER TABLE public.card_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own card drafts"
ON public.card_drafts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own card drafts"
ON public.card_drafts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own card drafts"
ON public.card_drafts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own card drafts"
ON public.card_drafts
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_card_drafts_updated_at
BEFORE UPDATE ON public.card_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();