import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ChatRequest {
  prompt: string;
  contentType?: string;
  formData?: Record<string, any>;
  intentType?: 'creative' | 'knowledge' | 'research' | 'user_search' | 'experience_studio';
  userId: string;
}

interface QuotaCheck {
  hasQuota: boolean;
  quotaType: 'daily' | 'monthly' | 'per_card';
  remaining: number;
  resetTime?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, contentType, formData, intentType, userId }: ChatRequest = await req.json();
    console.log('Chat router received request:', { intentType, userId, contentType });

    // Validate user authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user plan and check quotas
    const quotaCheck = await checkUserQuotas(userId, intentType || 'creative', contentType);
    
    if (!quotaCheck.hasQuota) {
      const message = quotaCheck.quotaType === 'daily' 
        ? 'Daily limit reached. Your limits will be restored in 24 hours.'
        : quotaCheck.quotaType === 'monthly'
        ? 'Monthly quota exhausted. Please upgrade your plan or wait for next month.'
        : 'Feature limit reached. Please try again later.';
        
      return new Response(JSON.stringify({ 
        error: 'Quota exceeded', 
        message,
        quotaInfo: quotaCheck 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Determine if websearch is needed
    const needsWebsearch = shouldUseWebsearch(intentType, contentType);
    console.log('Websearch needed:', needsWebsearch);

    let searchContext = '';
    let sources: any[] = [];

    // Route to websearch if needed
    if (needsWebsearch) {
      try {
        const [webResults, rssResults] = await Promise.all([
          callWebsearchEdge(prompt, intentType),
          callNewsFeedsEdge(prompt, intentType)
        ]);

        const combinedResults = deduplicateAndRank(webResults, rssResults);
        searchContext = formatSearchContext(combinedResults, intentType);
        sources = combinedResults;

        // Log search query
        await logSearchQuery(userId, prompt, intentType, sources, searchContext.length);
      } catch (searchError) {
        console.error('Search failed, continuing with LLM-only:', searchError);
        // Continue without search context - graceful degradation
      }
    }

    // Route to model gateway
    const finalPrompt = searchContext ? 
      `Context from recent sources:\n${searchContext}\n\nUser Request: ${prompt}\n\nPlease provide a comprehensive answer using the context above with inline citations [G1], [RSS1], etc. End with a complete source list.` :
      prompt;

    const modelResponse = await callModelGateway({
      prompt: finalPrompt,
      userId,
      intentType,
      searchSources: sources
    });

    // Update quota usage
    await updateQuotaUsage(userId, intentType || 'creative', contentType, modelResponse.tokensUsed || 0);

    return new Response(JSON.stringify({
      response: modelResponse.content,
      sources: sources.length > 0 ? sources : undefined,
      quotaRemaining: quotaCheck.remaining - 1,
      fallbackUsed: modelResponse.fallbackUsed || false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat router error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Please try again later'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function checkUserQuotas(userId: string, intentType: string, contentType?: string): Promise<QuotaCheck> {
  try {
    // Get user plan
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', userId)
      .single();

    const planType = userPlan?.plan_type || 'free';

    // Determine feature name based on intent and content type
    let featureName = 'chat_requests';
    if (intentType === 'knowledge' || intentType === 'research' || intentType === 'user_search') {
      featureName = 'search_queries';
    }

    // Get plan limits
    const { data: planLimit } = await supabase
      .from('plan_limits')
      .select('*')
      .eq('plan_type', planType)
      .eq('feature_name', featureName)
      .eq('quota_type', 'daily')
      .single();

    if (!planLimit) {
      return { hasQuota: false, quotaType: 'daily', remaining: 0 };
    }

    // Get current usage
    const { data: userQuota } = await supabase
      .from('user_quotas')
      .select('*')
      .eq('user_id', userId)
      .eq('feature_name', featureName)
      .eq('quota_type', 'daily')
      .single();

    const now = new Date();
    const usedCount = userQuota?.used_count || 0;
    const lastReset = userQuota?.last_reset ? new Date(userQuota.last_reset) : new Date(0);

    // Check if quota needs reset (daily)
    const shouldReset = now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000;
    const currentUsed = shouldReset ? 0 : usedCount;

    return {
      hasQuota: currentUsed < planLimit.limit_value,
      quotaType: 'daily',
      remaining: Math.max(0, planLimit.limit_value - currentUsed),
      resetTime: shouldReset ? 'now' : new Date(lastReset.getTime() + 24 * 60 * 60 * 1000).toISOString()
    };

  } catch (error) {
    console.error('Quota check error:', error);
    return { hasQuota: false, quotaType: 'daily', remaining: 0 };
  }
}

function shouldUseWebsearch(intentType?: string, contentType?: string): boolean {
  // Knowledge, Research, and direct user search need websearch
  const searchIntents = ['knowledge', 'research', 'user_search'];
  
  // Creative content types don't need search
  const creativeTypes = [
    'love_letter', 'apology_letter', 'general_letter', 'thank_you_letter',
    'story', 'flash_fiction', 'poetry', 'essay', 'script', 'speech',
    'blog'
  ];

  if (contentType && creativeTypes.includes(contentType)) {
    return false;
  }

  return searchIntents.includes(intentType || '');
}

async function callWebsearchEdge(query: string, intentType?: string) {
  try {
    const response = await supabase.functions.invoke('websearch-edge', {
      body: { query, intentType }
    });
    
    return response.data?.results || [];
  } catch (error) {
    console.error('Websearch edge error:', error);
    return [];
  }
}

async function callNewsFeedsEdge(query: string, intentType?: string) {
  try {
    const response = await supabase.functions.invoke('news-feeds-edge', {
      body: { query, intentType }
    });
    
    return response.data?.results || [];
  } catch (error) {
    console.error('News feeds edge error:', error);
    return [];
  }
}

function deduplicateAndRank(webResults: any[], rssResults: any[]): any[] {
  const combined = [...webResults, ...rssResults];
  const deduplicated = [];
  const seenUrls = new Set();

  for (const result of combined) {
    const normalizedUrl = result.url?.replace(/\/$/, '') || '';
    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);
      deduplicated.push(result);
    }
  }

  // Sort by relevance score if available, otherwise by date
  return deduplicated.sort((a, b) => {
    if (a.score !== undefined && b.score !== undefined) {
      return b.score - a.score;
    }
    if (a.publishedAt && b.publishedAt) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
    return 0;
  }).slice(0, 5); // Limit to top 5 results
}

function formatSearchContext(results: any[], intentType?: string): string {
  const tokenLimits = {
    user_search: 500,
    knowledge: 750,
    research: 1000
  };

  const limit = tokenLimits[intentType as keyof typeof tokenLimits] || 500;
  let context = '';
  let tokenCount = 0;

  for (let i = 0; i < results.length && tokenCount < limit; i++) {
    const result = results[i];
    const id = result.type === 'rss' ? `[RSS${i + 1}]` : `[G${i + 1}]`;
    const snippet = result.snippet || result.summary || '';
    const addition = `${id} ${result.title}: ${snippet.substring(0, 200)}...\n\n`;
    
    if (tokenCount + addition.length < limit) {
      context += addition;
      tokenCount += addition.length;
      result.id = id; // Add ID for citation
    }
  }

  return context;
}

async function callModelGateway(payload: any) {
  try {
    const response = await supabase.functions.invoke('model-gateway', {
      body: payload
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  } catch (error) {
    console.error('Model gateway error:', error);
    throw error;
  }
}

async function updateQuotaUsage(userId: string, intentType: string, contentType?: string, tokensUsed?: number) {
  try {
    let featureName = 'chat_requests';
    if (intentType === 'knowledge' || intentType === 'research' || intentType === 'user_search') {
      featureName = 'search_queries';
    }

    // Upsert quota usage
    const { error } = await supabase
      .from('user_quotas')
      .upsert({
        user_id: userId,
        feature_name: featureName,
        quota_type: 'daily',
        used_count: 1, // This will be incremented by a database function
        last_reset: new Date().toISOString()
      }, {
        onConflict: 'user_id,feature_name,quota_type',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Quota update error:', error);
    }

    // Also track AI tokens if provided
    if (tokensUsed) {
      await supabase
        .from('user_quotas')
        .upsert({
          user_id: userId,
          feature_name: 'ai_tokens',
          quota_type: 'monthly',
          used_count: tokensUsed,
          last_reset: new Date().toISOString()
        }, {
          onConflict: 'user_id,feature_name,quota_type',
          ignoreDuplicates: false
        });
    }

  } catch (error) {
    console.error('Update quota usage error:', error);
  }
}

async function logSearchQuery(userId: string, query: string, intentType?: string, sources?: any[], tokensConsumed?: number) {
  try {
    await supabase
      .from('search_queries')
      .insert({
        user_id: userId,
        query_text: query,
        intent_type: intentType,
        sources_used: sources || [],
        tokens_consumed: tokensConsumed || 0,
        search_results_count: sources?.length || 0,
        fallback_used: false
      });
  } catch (error) {
    console.error('Log search query error:', error);
  }
}