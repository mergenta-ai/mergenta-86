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

interface ModelRequest {
  prompt: string;
  userId: string;
  intentType?: string;
  searchSources?: any[];
  preferredVendor?: string;
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
      primary: 'gpt-4o',
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
      primary: 'claude-3-5-sonnet-20241022',
      fallback: 'claude-3-haiku-20240307'
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
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, userId, intentType, searchSources, preferredVendor }: ModelRequest = await req.json();
    console.log('Model gateway request:', { userId, intentType, vendor: preferredVendor });

    // Get vendor priority from admin settings
    const { data: vendorSettings } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'vendor_priority')
      .single();

    const vendorPriority = vendorSettings?.setting_value || {
      primary: ['openai', 'anthropic'],
      fallback: ['google']
    };

    // Determine vendor order
    const primaryVendors = preferredVendor ? [preferredVendor] : vendorPriority.primary || ['openai'];
    const fallbackVendors = vendorPriority.fallback || ['anthropic', 'google'];
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

        const response = await callVendor(vendor, prompt, intentType);
        
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
        await logVendorFallback(userId, vendor, null, error.message, false);
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

async function callVendor(vendor: string, prompt: string, intentType?: string): Promise<ModelResponse | null> {
  const config = VENDOR_CONFIGS[vendor as keyof typeof VENDOR_CONFIGS];
  if (!config) {
    throw new Error(`Unknown vendor: ${vendor}`);
  }

  switch (vendor) {
    case 'openai':
      return await callOpenAI(prompt, intentType);
    case 'anthropic':
      return await callAnthropic(prompt, intentType);
    case 'google':
      return await callGoogle(prompt, intentType);
    default:
      throw new Error(`Vendor ${vendor} not implemented`);
  }
}

async function callOpenAI(prompt: string, intentType?: string): Promise<ModelResponse | null> {
  if (!openAIKey) throw new Error('OpenAI API key not configured');

  const model = intentType === 'research' ? 'gpt-4o' : 'gpt-4o-mini';
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
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

async function callAnthropic(prompt: string, intentType?: string): Promise<ModelResponse | null> {
  if (!anthropicKey) throw new Error('Anthropic API key not configured');

  const model = intentType === 'research' ? 'claude-3-5-sonnet-20241022' : 'claude-3-haiku-20240307';
  
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

async function callGoogle(prompt: string, intentType?: string): Promise<ModelResponse | null> {
  if (!geminiKey) throw new Error('Google Gemini API key not configured');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
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
    model: 'gemini-pro',
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