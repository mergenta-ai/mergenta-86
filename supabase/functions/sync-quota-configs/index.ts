import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Vendor Quota data from Excel Sheet 5
const VENDOR_QUOTAS = [
  // Anthropic
  { vendor: 'anthropic', model: 'claude-4-opus', daily: 80000, monthly: 2400000 },
  { vendor: 'anthropic', model: 'claude-4-sonnet', daily: 120000, monthly: 3600000 },
  { vendor: 'anthropic', model: 'claude-3.5-haiku', daily: 200000, monthly: 6000000 },
  
  // Google
  { vendor: 'google', model: 'gemini-2.5-flash', daily: 300000, monthly: 9000000 },
  { vendor: 'google', model: 'gemini-2.5-pro', daily: 80000, monthly: 2400000 },
  { vendor: 'google', model: 'drive-api', daily: 10000, monthly: 300000 },
  { vendor: 'google', model: 'gmail-api', daily: 20000, monthly: 600000 },
  { vendor: 'google', model: 'google-search-api', daily: 10000, monthly: 300000 },
  { vendor: 'google', model: 'doc-parser', daily: 5000, monthly: 150000 },
  { vendor: 'google', model: 'docs-export', daily: 5000, monthly: 150000 },
  { vendor: 'google', model: 'sheets-export', daily: 5000, monthly: 150000 },
  { vendor: 'google', model: 'speech-to-text', daily: 5000, monthly: 150000 },
  { vendor: 'google', model: 'text-to-speech', daily: 5000, monthly: 150000 },
  
  // OpenAI
  { vendor: 'openai', model: 'gpt-5', daily: 150000, monthly: 4000000 },
  { vendor: 'openai', model: 'gpt-5-mini', daily: 300000, monthly: 9000000 },
  { vendor: 'openai', model: 'gpt-5-nano', daily: 400000, monthly: 12000000 },
  { vendor: 'openai', model: 'gpt-4.1', daily: 80000, monthly: 2400000 },
  { vendor: 'openai', model: 'gpt-4o-mini', daily: 80000, monthly: 2400000 },
  { vendor: 'openai', model: 'o3', daily: 80000, monthly: 2400000 },
  { vendor: 'openai', model: 'o4-mini', daily: 50000, monthly: 1500000 },
  { vendor: 'openai', model: 'o3-pro', daily: 120000, monthly: 3600000 },
  { vendor: 'openai', model: 'o4-mini-deep-research', daily: 200000, monthly: 6000000 },
  { vendor: 'openai', model: 'dall-e-3', daily: 5000, monthly: 150000 },
  { vendor: 'openai', model: 'gpt-4o-mini-transcribe', daily: 5000, monthly: 150000 },
  { vendor: 'openai', model: 'gpt-4o-mini-tts', daily: 2000, monthly: 60000 },
  
  // xAI
  { vendor: 'xai', model: 'grok-3', daily: 50000, monthly: 1500000 },
  { vendor: 'xai', model: 'grok-4-fast-non-reasoning', daily: 80000, monthly: 2400000 },
  { vendor: 'xai', model: 'grok-4-fast-reasoning', daily: 80000, monthly: 2400000 },
  
  // Mistral
  { vendor: 'mistral', model: 'mistral-medium-2508', daily: 36000, monthly: 480000 },
  { vendor: 'mistral', model: 'codestral-2508', daily: 48000, monthly: 1200000 },
  { vendor: 'mistral', model: 'mistral-ocr-2505', daily: 200, monthly: 2000 },
  
  // ElevenLabs
  { vendor: 'elevenlabs', model: 'eleven-tts', daily: 4000, monthly: 120000 },
  
  // CloudConvert
  { vendor: 'cloudconvert', model: 'sheets-export', daily: 5000, monthly: 150000 },
  { vendor: 'cloudconvert', model: 'pdf-export', daily: 10000, monthly: 300000 },
  { vendor: 'cloudconvert', model: 'docx-export', daily: 10000, monthly: 300000 },
  
  // Local
  { vendor: 'local', model: 'txt-export', daily: 1000000, monthly: 9000000 },
  
  // Meta
  { vendor: 'meta', model: 'seamlessm4t-v2', daily: 4000, monthly: 120000 },
  
  // Microsoft
  { vendor: 'microsoft', model: 'graph-api', daily: 10000, monthly: 300000 },
  { vendor: 'microsoft', model: 'outlook-mail', daily: 20000, monthly: 600000 },
  { vendor: 'microsoft', model: 'bing-autosuggest-api', daily: 10000, monthly: 300000 },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Clear existing data (optional - comment out if you want to keep existing)
    await supabaseClient.from('vendor_quotas').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert/update vendor_quotas with model-level data
    for (const quota of VENDOR_QUOTAS) {
      // Insert daily quota
      await supabaseClient.from('vendor_quotas').upsert({
        vendor_type: quota.vendor,
        model_name: quota.model,
        quota_type: 'daily',
        limit_value: quota.daily,
        used_count: 0,
        last_reset: new Date().toISOString(),
      }, {
        onConflict: 'vendor_type,model_name,quota_type',
        ignoreDuplicates: false
      });

      // Insert monthly quota
      await supabaseClient.from('vendor_quotas').upsert({
        vendor_type: quota.vendor,
        model_name: quota.model,
        quota_type: 'monthly',
        limit_value: quota.monthly,
        used_count: 0,
        last_reset: new Date().toISOString(),
      }, {
        onConflict: 'vendor_type,model_name,quota_type',
        ignoreDuplicates: false
      });

      // Also sync to admin_quota_config for management
      await supabaseClient.from('admin_quota_config').upsert({
        vendor_type: quota.vendor,
        model_name: quota.model,
        quota_type: 'daily',
        limit_value: quota.daily,
        is_active: true,
      }, {
        onConflict: 'vendor_type,model_name,quota_type',
        ignoreDuplicates: false
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synced ${VENDOR_QUOTAS.length} model quotas successfully`,
        count: VENDOR_QUOTAS.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error syncing quotas:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

