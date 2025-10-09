import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseDraftPersistenceOptions {
  cardId: string;
  initialData?: Record<string, any>;
  localStorageDebounce?: number;
  supabaseDebounce?: number;
}

export const useDraftPersistence = ({
  cardId,
  initialData = {},
  localStorageDebounce = 2000,
  supabaseDebounce = 5000,
}: UseDraftPersistenceOptions) => {
  const [draftData, setDraftData] = useState<Record<string, any>>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const localStorageTimerRef = useRef<NodeJS.Timeout>();
  const supabaseTimerRef = useRef<NodeJS.Timeout>();

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {

      try {
        // Try localStorage first
        const localKey = `card_draft_${cardId}`;
        const localDraft = localStorage.getItem(localKey);
        
        if (localDraft) {
          const parsed = JSON.parse(localDraft);
          setDraftData(parsed);
        }

        // Then check Supabase for authenticated users
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('card_drafts')
            .select('draft_json')
            .eq('user_id', user.id)
            .eq('card_id', cardId)
            .maybeSingle();

          if (!error && data?.draft_json) {
            const draftJson = data.draft_json as Record<string, any>;
            setDraftData(draftJson);
            // Sync to localStorage
            localStorage.setItem(localKey, JSON.stringify(draftJson));
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [cardId]);

  // Save to localStorage (debounced)
  const saveToLocalStorage = useCallback((data: Record<string, any>) => {
    if (localStorageTimerRef.current) {
      clearTimeout(localStorageTimerRef.current);
    }

    localStorageTimerRef.current = setTimeout(() => {
      try {
        const localKey = `card_draft_${cardId}`;
        localStorage.setItem(localKey, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }, localStorageDebounce);
  }, [cardId, localStorageDebounce]);

  // Save to Supabase (debounced)
  const saveToSupabase = useCallback(async (data: Record<string, any>) => {
    if (supabaseTimerRef.current) {
      clearTimeout(supabaseTimerRef.current);
    }

    supabaseTimerRef.current = setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setIsSaving(true);

        const { error } = await supabase
          .from('card_drafts')
          .upsert({
            user_id: user.id,
            card_id: cardId,
            draft_json: data,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,card_id'
          });

        if (error) {
          console.error('Error saving to Supabase:', error);
        }
      } catch (error) {
        console.error('Error saving draft:', error);
      } finally {
        setIsSaving(false);
      }
    }, supabaseDebounce);
  }, [cardId, supabaseDebounce]);

  // Update draft data
  const saveDraft = useCallback((field: string, value: any) => {
    setDraftData(prev => {
      const newData = { ...prev, [field]: value };
      saveToLocalStorage(newData);
      saveToSupabase(newData);
      return newData;
    });
  }, [saveToLocalStorage, saveToSupabase]);

  // Clear draft
  const clearDraft = useCallback(() => {
    // Clear localStorage immediately
    const localKey = `card_draft_${cardId}`;
    localStorage.removeItem(localKey);

    // Reset state immediately
    setDraftData(initialData);
    
    // Clear Supabase in background (don't block UI)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('card_drafts')
          .delete()
          .eq('user_id', user.id)
          .eq('card_id', cardId)
          .then(({ error }) => {
            if (error) {
              console.error('Error clearing draft from Supabase:', error);
            }
          });
      }
    });
    
    // Show toast after state reset
    toast({
      title: "Draft cleared",
      description: "Your draft has been removed.",
    });
  }, [cardId, initialData, toast]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (localStorageTimerRef.current) {
        clearTimeout(localStorageTimerRef.current);
      }
      if (supabaseTimerRef.current) {
        clearTimeout(supabaseTimerRef.current);
      }
    };
  }, []);

  return {
    draftData,
    saveDraft,
    clearDraft,
    isLoading,
    isSaving,
  };
};
