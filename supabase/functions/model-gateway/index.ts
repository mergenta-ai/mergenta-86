import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// API Keys
const openAIKey = Deno.env.get('OPENAI_API_KEY');
const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
const geminiKey = Deno.env.get('GEMINI_API_KEY');
const mistralKey = Deno.env.get('MISTRAL_API_KEY');
const xaiKey = Deno.env.get('XAI_API_KEY');

interface ModelRequest {
  prompt: string;
  userId: string;
  intentType?: string;
  searchSources?: any[];
  preferredVendor?: string;
  preferredModel?: string;
}

interface ModelResponse {
  content: string;
  tokensUsed: number;
  vendor: string;
  fallbackUsed: boolean;
  model: string;
}

const VENDOR_CONFIGS = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    models: {
      primary: 'gpt-5-2025-08-07',
      fallback: 'gpt-4o-mini'
    },
    headers: (key: string) => ({
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    })
  },
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    models: {
      primary: 'claude-opus-4-1-20250805',
      fallback: 'claude-3-5-haiku-20241022'
    },
    headers: (key: string) => ({
      'x-api-key': key,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    })
  },
  google: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    models: {
      primary: 'gemini-pro',
      fallback: 'gemini-pro'
    },
    headers: () => ({
      'Content-Type': 'application/json'
    })
  },
  mistral: {
    url: 'https://api.mistral.ai/v1/chat/completions',
    models: {
      primary: 'mistral-large-latest',
      fallback: 'mistral-small-latest'
    },
    headers: (key: string) => ({
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    })
  },
  xai: {
    url: 'https://api.x.ai/v1/chat/completions',
    models: {
      primary: 'grok-beta',
      fallback: 'grok-beta'
    },
    headers: (key: string) => ({
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    })
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, userId, intentType, searchSources, preferredVendor, preferredModel }: ModelRequest = await req.json();
    console.log('Model gateway request:', { userId, intentType, vendor: preferredVendor, model: preferredModel });

    // Validate and resolve the model to use
    const modelToUse = await validateAndResolveModel(userId, intentType, preferredModel);

    // Get vendor priority from admin settings
    const { data: vendorSettings } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'vendor_priority')
      .single();

    const vendorPriority = vendorSettings?.setting_value || {
      primary: ['openai', 'anthropic'],
      fallback: ['google', 'mistral', 'xai']
    };

    // Determine vendor order
    const primaryVendors = preferredVendor ? [preferredVendor] : vendorPriority.primary || ['openai'];
    const fallbackVendors = vendorPriority.fallback || ['anthropic', 'google', 'mistral', 'xai'];
    const allVendors = [...primaryVendors, ...fallbackVendors];

    let lastError: any = null;
    let fallbackUsed = false;

    // Try vendors in order
    for (let i = 0; i < allVendors.length; i++) {
      const vendor = allVendors[i];
      
      if (i > 0) fallbackUsed = true;

      try {
        console.log(`Attempting vendor: ${vendor}`);
        
        // Check vendor quota
        const hasQuota = await checkVendorQuota(vendor);
        if (!hasQuota) {
          console.log(`Vendor ${vendor} quota exhausted`);
          continue;
        }

        const response = await callVendor(vendor, prompt, intentType, modelToUse);
        
        if (response) {
          // Update vendor quota
          await updateVendorQuota(vendor, response.tokensUsed);
          
          // Log successful call
          if (fallbackUsed) {
            await logVendorFallback(userId, primaryVendors[0], vendor, null, true);
          }
          
          return new Response(JSON.stringify({
            ...response,
            fallbackUsed,
            vendor
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      } catch (error) {
        console.error(`Vendor ${vendor} failed:`, error);
        lastError = error;
        
        // Log failed attempt
        await logVendorFallback(userId, vendor, null, (error as Error).message, false);
        continue;
      }
    }

    // All vendors failed
    console.error('All vendors failed, last error:', lastError);
    
    return new Response(JSON.stringify({
      error: 'All AI vendors are currently unavailable',
      message: 'Please try again later. Our team has been notified.',
      fallbackUsed: true
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Model gateway error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: 'Please try again later'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function checkVendorQuota(vendor: string): Promise<boolean> {
  try {
    const { data: quota } = await supabase
      .from('vendor_quotas')
      .select('*')
      .eq('vendor_type', vendor)
      .eq('quota_type', 'daily')
      .single();

    if (!quota) return true; // No quota limits set

    const now = new Date();
    const lastReset = new Date(quota.last_reset);
    const shouldReset = now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000;

    if (shouldReset) {
      // Reset quota
      await supabase
        .from('vendor_quotas')
        .update({
          used_count: 0,
          last_reset: now.toISOString()
        })
        .eq('vendor_type', vendor)
        .eq('quota_type', 'daily');
      
      return true;
    }

    return quota.used_count < quota.limit_value;
  } catch (error) {
    console.error('Check vendor quota error:', error);
    return true; // Allow on error
  }
}

async function validateAndResolveModel(userId: string, intentType?: string, preferredModel?: string): Promise<string | null> {
  try {
    // Get user's plan
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    const planType = userPlan?.plan_type || 'free';

    // Get feature limits
    const { data: featureLimits } = await supabase
      .from('feature_limits')
      .select('allow_model_overwrite, primary_model')
      .eq('plan_type', planType)
      .eq('intent_type', intentType || 'creative')
      .single();

    // If no preferred model or model override not allowed, return null to use default
    if (!preferredModel || !featureLimits?.allow_model_overwrite) {
      console.log('Using default model from feature limits');
      return null;
    }

    // Validate model format (vendor/model)
    if (!preferredModel.includes('/')) {
      console.log('Invalid model format, must be vendor/model');
      return null;
    }

    console.log('Using preferred model:', preferredModel);
    return preferredModel;
  } catch (error) {
    console.error('Error validating model:', error);
    return null;
  }
}

async function callVendor(vendor: string, prompt: string, intentType?: string, modelOverride?: string | null): Promise<ModelResponse | null> {
  const config = VENDOR_CONFIGS[vendor as keyof typeof VENDOR_CONFIGS];
  if (!config) {
    throw new Error(`Unknown vendor: ${vendor}`);
  }

  switch (vendor) {
    case 'openai':
      return await callOpenAI(prompt, intentType, modelOverride);
    case 'anthropic':
      return await callAnthropic(prompt, intentType, modelOverride);
    case 'google':
      return await callGoogle(prompt, intentType, modelOverride);
    case 'mistral':
      return await callMistral(prompt, intentType, modelOverride);
    case 'xai':
      return await callXAI(prompt, intentType, modelOverride);
    default:
      throw new Error(`Vendor ${vendor} not implemented`);
  }
}

async function callOpenAI(prompt: string, intentType?: string, modelOverride?: string | null): Promise<ModelResponse | null> {
  if (!openAIKey) throw new Error('OpenAI API key not configured');

  let model = intentType === 'research' ? 'gpt-5-2025-08-07' : 'gpt-4o-mini';
  
  // Use model override if provided and it's an OpenAI model
  if (modelOverride && modelOverride.startsWith('openai/')) {
    model = modelOverride.split('/')[1];
  }
  
  const requestBody: any = {
    model,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful AI assistant. When provided with sources, always include inline citations like [G1], [RSS1] and provide a complete source list at the end.'
      },
      { role: 'user', content: prompt }
    ]
  };

  // Use max_completion_tokens for newer models, max_tokens for legacy
  if (model.startsWith('gpt-5') || model.startsWith('o3') || model.startsWith('o4')) {
    requestBody.max_completion_tokens = 2000;
  } else {
    requestBody.max_tokens = 2000;
    requestBody.temperature = 0.7;
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens || 0,
    vendor: 'openai',
    model,
    fallbackUsed: false
  };
}

async function callAnthropic(prompt: string, intentType?: string, modelOverride?: string | null): Promise<ModelResponse | null> {
  if (!anthropicKey) throw new Error('Anthropic API key not configured');

  let model = intentType === 'research' ? 'claude-opus-4-1-20250805' : 'claude-3-5-haiku-20241022';
  
  // Use model override if provided and it's an Anthropic model
  if (modelOverride && modelOverride.startsWith('anthropic/')) {
    model = modelOverride.split('/')[1];
  }
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are a helpful AI assistant. When provided with sources, always include inline citations like [G1], [RSS1] and provide a complete source list at the end.\n\n${prompt}`
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.content[0].text,
    tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens || 0,
    vendor: 'anthropic',
    model,
    fallbackUsed: false
  };
}

async function callMistral(prompt: string, intentType?: string, modelOverride?: string | null): Promise<ModelResponse | null> {
  if (!mistralKey) throw new Error('Mistral API key not configured');

  let model = intentType === 'research' ? 'mistral-large-latest' : 'mistral-small-latest';
  
  // Use model override if provided and it's a Mistral model
  if (modelOverride && modelOverride.startsWith('mistral/')) {
    model = modelOverride.split('/')[1];
  }
  
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${mistralKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. When provided with sources, always include inline citations like [G1], [RSS1] and provide a complete source list at the end.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mistral API error: ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens || 0,
    vendor: 'mistral',
    model,
    fallbackUsed: false
  };
}

async function callXAI(prompt: string, intentType?: string, modelOverride?: string | null): Promise<ModelResponse | null> {
  if (!xaiKey) throw new Error('xAI API key not configured');

  let model = 'grok-beta';
  
  // Use model override if provided and it's an xAI model
  if (modelOverride && modelOverride.startsWith('xai/')) {
    model = modelOverride.split('/')[1];
  }
  
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${xaiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. When provided with sources, always include inline citations like [G1], [RSS1] and provide a complete source list at the end.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`xAI API error: ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens || 0,
    vendor: 'xai',
    model,
    fallbackUsed: false
  };
}

async function callGoogle(prompt: string, intentType?: string, modelOverride?: string | null): Promise<ModelResponse | null> {
  if (!geminiKey) throw new Error('Google Gemini API key not configured');

  let model = 'gemini-pro';
  
  // Use model override if provided and it's a Google model
  if (modelOverride && modelOverride.startsWith('google/')) {
    model = modelOverride.split('/')[1];
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helpful AI assistant. When provided with sources, always include inline citations like [G1], [RSS1] and provide a complete source list at the end.\n\n${prompt}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Gemini API error: ${error}`);
  }

  const data = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Google Gemini');
  }
  
  return {
    content: data.candidates[0].content.parts[0].text,
    tokensUsed: data.usageMetadata?.totalTokenCount || 0,
    vendor: 'google',
    model,
    fallbackUsed: false
  };
}

async function updateVendorQuota(vendor: string, tokensUsed: number) {
  try {
    const { data: quota } = await supabase
      .from('vendor_quotas')
      .select('used_count')
      .eq('vendor_type', vendor)
      .eq('quota_type', 'daily')
      .single();

    const newCount = (quota?.used_count || 0) + tokensUsed;

    await supabase
      .from('vendor_quotas')
      .upsert({
        vendor_type: vendor,
        quota_type: 'daily',
        used_count: newCount,
        limit_value: 10000, // Default limit
        last_reset: new Date().toISOString()
      }, {
        onConflict: 'vendor_type,quota_type'
      });

  } catch (error) {
    console.error('Update vendor quota error:', error);
  }
}

async function logVendorFallback(userId: string, primaryVendor: string, fallbackVendor: string | null, errorMessage: string | null, success: boolean) {
  try {
    await supabase
      .from('vendor_fallbacks')
      .insert({
        user_id: userId,
        primary_vendor: primaryVendor,
        fallback_vendor: fallbackVendor,
        error_message: errorMessage,
        success
      });
  } catch (error) {
    console.error('Log vendor fallback error:', error);
  }
}