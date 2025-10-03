import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, size = '1024x1024', quality = 'standard' } = await req.json();
    console.log('Image generation request:', { prompt, size, quality });

    // Get user from auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check user's plan and quota
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    const planType = userPlan?.plan_type || 'free';

    // Get feature limits for image generation
    const { data: featureLimits } = await supabase
      .from('feature_limits')
      .select('*')
      .eq('feature_name', 'Image Generation')
      .eq('plan_type', planType)
      .single();

    if (!featureLimits || featureLimits.daily_quota === 0) {
      return new Response(JSON.stringify({ 
        error: 'Image generation not available on your plan. Please upgrade to Pro or higher.' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check current usage
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const { data: quotaData } = await supabase
      .from('user_quotas')
      .select('*')
      .eq('user_id', user.id)
      .eq('feature_name', 'Image Generation')
      .eq('quota_type', 'monthly')
      .single();

    if (quotaData) {
      const lastReset = new Date(quotaData.last_reset);
      const shouldReset = lastReset < monthStart;

      if (shouldReset) {
        await supabase
          .from('user_quotas')
          .update({ used_count: 0, last_reset: now.toISOString() })
          .eq('id', quotaData.id);
      } else if (quotaData.used_count >= featureLimits.daily_quota) {
        return new Response(JSON.stringify({ 
          error: `Monthly quota exceeded. You have ${featureLimits.daily_quota} images per month.`,
          quota: { used: quotaData.used_count, limit: featureLimits.daily_quota }
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Call OpenAI DALL-E 3
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality: planType === 'max' ? (quality === 'hd' ? 'hd' : 'standard') : 'standard',
        response_format: 'b64_json'
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI error:', errorData);
      return new Response(JSON.stringify({ error: 'Image generation failed', details: errorData }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const imageData = await openaiResponse.json();
    const imageBase64 = imageData.data[0].b64_json;

    // Update quota
    if (quotaData) {
      await supabase
        .from('user_quotas')
        .update({ used_count: quotaData.used_count + 1 })
        .eq('id', quotaData.id);
    } else {
      await supabase
        .from('user_quotas')
        .insert({
          user_id: user.id,
          feature_name: 'Image Generation',
          quota_type: 'monthly',
          used_count: 1,
          last_reset: now.toISOString()
        });
    }

    console.log('Image generated successfully');
    return new Response(JSON.stringify({ 
      image: `data:image/png;base64,${imageBase64}`,
      quota: { 
        used: (quotaData?.used_count || 0) + 1, 
        limit: featureLimits.daily_quota 
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
