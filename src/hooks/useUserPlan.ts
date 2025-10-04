import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type PlanType = 'free' | 'pro' | 'zip' | 'ace' | 'max';

interface UserPlanData {
  planType: PlanType;
  allowModelOverwrite: boolean;
  loading: boolean;
  error: string | null;
}

export const useUserPlan = (): UserPlanData => {
  const [planType, setPlanType] = useState<PlanType>('free');
  const [allowModelOverwrite, setAllowModelOverwrite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPlanType('free');
          setAllowModelOverwrite(false);
          setLoading(false);
          return;
        }

        // Fetch user's plan
        const { data: userPlan, error: planError } = await supabase
          .from('user_plans')
          .select('plan_type')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (planError) throw planError;

        const currentPlan = (userPlan?.plan_type as PlanType) || 'free';
        setPlanType(currentPlan);

        // Fetch feature limits for the plan
        const { data: featureLimits, error: limitsError } = await supabase
          .from('feature_limits')
          .select('allow_model_overwrite')
          .eq('plan_type', currentPlan)
          .limit(1)
          .maybeSingle();

        if (limitsError) throw limitsError;

        setAllowModelOverwrite(featureLimits?.allow_model_overwrite || false);
      } catch (err) {
        console.error('Error fetching user plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch plan');
        // Fail open - allow access on error
        setPlanType('free');
        setAllowModelOverwrite(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  return { planType, allowModelOverwrite, loading, error };
};
