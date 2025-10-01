import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TalkModeRequest {
  action: 'stt' | 'tts';
  audioBase64?: string; // for STT
  text?: string; // for TTS
  voiceConfig?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, audioBase64, text, voiceConfig } = await req.json() as TalkModeRequest;

    // Get user's plan
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    const planType = userPlan?.plan_type || 'free';
    console.log(`User plan: ${planType}`);

    // Check talk mode usage
    const { data: usageData } = await supabase
      .from('talk_mode_usage')
      .select('used_minutes, last_reset')
      .eq('user_id', user.id)
      .single();

    // Define limits per plan (in minutes)
    const limits = {
      free: 5,
      pro: 20,
      zip: 45,
      ace: 90,
      max: 120,
    };

    const dailyLimit = limits[planType as keyof typeof limits] || limits.free;

    // Check if usage needs reset (24 hours)
    const now = new Date();
    const lastReset = usageData?.last_reset ? new Date(usageData.last_reset) : null;
    const shouldReset = !lastReset || (now.getTime() - lastReset.getTime()) > 24 * 60 * 60 * 1000;

    let usedMinutes = shouldReset ? 0 : (usageData?.used_minutes || 0);

    // Check if user has exceeded limit
    if (usedMinutes >= dailyLimit) {
      return new Response(
        JSON.stringify({ 
          error: 'Daily talk mode limit exceeded',
          used: usedMinutes,
          limit: dailyLimit 
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let result;

    if (action === 'stt') {
      // Route STT based on plan
      const sttFunction = ['zip', 'ace', 'max'].includes(planType) 
        ? 'openai-whisper-stt' 
        : 'google-stt';

      console.log(`Routing STT to: ${sttFunction}`);

      const { data, error } = await supabase.functions.invoke(sttFunction, {
        body: { audioBase64 },
      });

      if (error) throw error;
      result = data;
    } else if (action === 'tts') {
      // Route TTS based on plan
      const ttsFunction = planType === 'free' ? 'google-tts' : 'openai-tts';

      console.log(`Routing TTS to: ${ttsFunction}`);

      const { data, error } = await supabase.functions.invoke(ttsFunction, {
        body: { text, voice: voiceConfig?.voice, voiceConfig },
      });

      if (error) throw error;
      result = data;
    } else {
      throw new Error('Invalid action');
    }

    // Update usage (increment by 0.5 minutes for Free plan in 30s increments, 1 minute for others)
    const incrementMinutes = planType === 'free' ? 0.5 : 1;
    const newUsedMinutes = usedMinutes + incrementMinutes;

    await supabase
      .from('talk_mode_usage')
      .upsert({
        user_id: user.id,
        used_minutes: newUsedMinutes,
        last_reset: shouldReset ? now.toISOString() : usageData?.last_reset,
      });

    console.log(`Usage updated: ${newUsedMinutes}/${dailyLimit} minutes`);

    return new Response(
      JSON.stringify({ 
        ...result, 
        usage: { 
          used: newUsedMinutes, 
          limit: dailyLimit 
        } 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in talk-mode-router:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
