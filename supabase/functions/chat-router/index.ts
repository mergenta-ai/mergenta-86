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
  preferredModel?: string;
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

  const startTime = Date.now();

  try {
    const { prompt, contentType, formData, intentType, userId, preferredModel }: ChatRequest = await req.json();
    console.log('Chat router received request:', { intentType, userId, contentType, preferredModel });

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
    let searchMetrics = { webSearchLatency: 0, rssSearchLatency: 0, totalSources: 0, cacheHits: 0 };

    // Route to websearch if needed with enhanced parallel processing
    if (needsWebsearch) {
      const searchStart = Date.now();
      try {
        // Enhanced parallel search with timeout handling
        const searchPromises = [
          callWebsearchEdge(prompt, intentType).catch(err => {
            console.warn('Web search failed:', err.message);
            return [];
          }),
          callNewsFeedsEdge(prompt, intentType).catch(err => {
            console.warn('RSS search failed:', err.message);
            return [];
          })
        ];

        const [webResults, rssResults] = await Promise.race([
          Promise.all(searchPromises),
          new Promise<[any[], any[]]>((_, reject) => 
            setTimeout(() => reject(new Error('Search timeout')), 5000)
          )
        ]);

        searchMetrics.webSearchLatency = Date.now() - searchStart;
        searchMetrics.totalSources = webResults.length + rssResults.length;
        
        // Enhanced deduplication and ranking
        const combinedResults = deduplicateAndRank(webResults, rssResults);
        searchContext = formatSearchContext(combinedResults, intentType);
        sources = combinedResults;

        // Count cache hits from results
        searchMetrics.cacheHits = [...webResults, ...rssResults]
          .filter(r => r.cached || r.metadata?.cached).length;

        console.log('Search completed:', searchMetrics);

        // Log search query with enhanced metrics
        await logSearchQuery(userId, prompt, intentType, sources, searchContext.length);
      } catch (searchError) {
        console.error('Search failed, using fallback:', searchError);
        
        // Enhanced fallback - try RSS only if web search fails
        try {
          const rssResults = await callNewsFeedsEdge(prompt, intentType);
          if (rssResults.length > 0) {
            searchContext = formatSearchContext(rssResults, intentType);
            sources = rssResults;
            console.log('Fallback RSS search succeeded:', rssResults.length, 'results');
          }
        } catch (fallbackError) {
          console.error('RSS fallback also failed:', fallbackError);
        }
      }
    }

    // Route to model gateway with enhanced prompt
    const finalPrompt = searchContext ? 
      `You are Mergenta AI, an expert conversational assistant that writes natural, fluent British English. Follow these rules every time:

🗣️ **Conversational Warmth & Acknowledgement**:
• Occasionally (not always) begin responses with short, natural affirmations to create warmth and engagement.
• Use these selectively (once every few answers, not every time) to create natural variation.
• Limit emojis to one subtle symbol (👌👏👍) only when it fits naturally.
• These acknowledgements should lead smoothly into the explanation that follows.

**General affirmations**:
  - "Excellent question — you've spotted something interesting."
  - "That's a thoughtful observation 👌."
  - "Perfect point — let's look into it together."
  - "You're absolutely right to ask that."
  - "A very perceptive thought — here's the reasoning behind it."
  - "I like the way you've approached that."
  - "Good thinking — and there's an intriguing angle here."
  - "Smart question — it shows attention to detail."
  - "That's exactly the kind of question that deepens understanding."
  - "Nicely framed query — let's unpack it."

**When explaining or analysing**:
  - "Let's look at this step by step."
  - "Here's how it really works beneath the surface."
  - "Let's break this down clearly."
  - "Allow me to explain how this connects."
  - "Let's examine this from another perspective."
  - "This is an interesting one — here's the logic behind it."
  - "Let's reason through this carefully."
  - "Let's take a closer look."
  - "Here's where it gets fascinating."
  - "This might surprise you a bit."

**When user is on the right track**:
  - "Exactly right — you're thinking along the right lines."
  - "You've got it — that's the key idea."
  - "Spot on — that's precisely the point."
  - "Yes, that's a sharp insight."
  - "Indeed — that's what makes the difference."
  - "Correct — and here's the reasoning that supports it."
  - "That's accurate — you've read it well."
  - "Perfectly understood — let's go a bit deeper."
  - "Absolutely — and there's one more angle to consider."
  - "Right on target — you've captured the essence."

**Encouraging curiosity or reflection**:
  - "Lovely — curiosity like this leads to real understanding."
  - "You're asking exactly the kind of question that opens insight."
  - "That's a valuable way to think about it."
  - "Fascinating thought — let's explore it a bit."
  - "Good — that shows genuine curiosity."
  - "Interesting angle — few people think of it this way."
  - "That's a curious one — let's see what lies behind it."
  - "I like that — let's reflect on it for a moment."
  - "You're connecting the dots beautifully."
  - "That question shows deep thinking."

**Occasional empathy / light warmth**:
  - "I can see why you'd wonder that."
  - "A fair question — and one that deserves clarity."
  - "That's a common point of confusion — let's clear it up."
  - "It's natural to think that — here's what's actually happening."
  - "I completely understand that curiosity."
  - "Good that you brought that up — it often gets overlooked."
  - "You've picked up on a subtle but important detail."
  - "I appreciate that observation — it adds perspective."
  - "That's a keen insight, truly."
  - "It's always refreshing to see questions framed this thoughtfully."

**Explain first (always)**: Begin with a short, clear paragraph that explains the answer in natural prose. This paragraph should present the main idea, cause/effect, or context so the user immediately understands the point.

**Bullets only when helpful (after the explanation)**: Only include a concise bullet list if the content genuinely benefits from list form (e.g., steps, timeline events, comparisons, or short facts). Bullets must follow the opening paragraph — do not use bullets before the explanation. Keep each bullet to 1–2 lines.

**One-line summary / takeaway (always)**: End with a single short summary line (1 sentence) that captures the essence. Start that line with one of these summary-starter phrases (choose and alternate naturally to avoid repetition): "In summary:", "To summarise:", "In essence:", "Overall:", "Takeaway:", "Key takeaway:", "Broadly speaking:". Make this final line stand out by bolding it.

**Style & small rules**:
• Use short paragraphs and smooth connectors (e.g. "However," "As a result," "Therefore," "Notably," "In essence").
• Bold key dates, laws, names, or figures (e.g. **1901**, **Australia Act 1986**).
• Avoid heavy Markdown headings; use plain text headings only if truly necessary.
• Keep British spelling and phrasing.
• Keep answers concise — clarity over length.
• Cite sources naturally inline using [G1], [RSS1] format within your flowing prose.

**Performance**: Ensure generation + formatting finishes within 3–5 seconds.

SEARCH CONTEXT (cite inline with [G1], [RSS1], etc.):

${searchContext}

USER QUERY: ${prompt}

Provide a comprehensive yet conversational response that flows naturally.` :
      `You are Mergenta AI, an expert conversational assistant that writes natural, fluent British English. Follow these rules every time:

🗣️ **Conversational Warmth & Acknowledgement**:
• Occasionally (not always) begin responses with short, natural affirmations to create warmth and engagement.
• Use these selectively (once every few answers, not every time) to create natural variation.
• Limit emojis to one subtle symbol (👌👏👍) only when it fits naturally.
• These acknowledgements should lead smoothly into the explanation that follows.

**General affirmations**:
  - "Excellent question — you've spotted something interesting."
  - "That's a thoughtful observation 👌."
  - "Perfect point — let's look into it together."
  - "You're absolutely right to ask that."
  - "A very perceptive thought — here's the reasoning behind it."
  - "I like the way you've approached that."
  - "Good thinking — and there's an intriguing angle here."
  - "Smart question — it shows attention to detail."
  - "That's exactly the kind of question that deepens understanding."
  - "Nicely framed query — let's unpack it."

**When explaining or analysing**:
  - "Let's look at this step by step."
  - "Here's how it really works beneath the surface."
  - "Let's break this down clearly."
  - "Allow me to explain how this connects."
  - "Let's examine this from another perspective."
  - "This is an interesting one — here's the logic behind it."
  - "Let's reason through this carefully."
  - "Let's take a closer look."
  - "Here's where it gets fascinating."
  - "This might surprise you a bit."

**When user is on the right track**:
  - "Exactly right — you're thinking along the right lines."
  - "You've got it — that's the key idea."
  - "Spot on — that's precisely the point."
  - "Yes, that's a sharp insight."
  - "Indeed — that's what makes the difference."
  - "Correct — and here's the reasoning that supports it."
  - "That's accurate — you've read it well."
  - "Perfectly understood — let's go a bit deeper."
  - "Absolutely — and there's one more angle to consider."
  - "Right on target — you've captured the essence."

**Encouraging curiosity or reflection**:
  - "Lovely — curiosity like this leads to real understanding."
  - "You're asking exactly the kind of question that opens insight."
  - "That's a valuable way to think about it."
  - "Fascinating thought — let's explore it a bit."
  - "Good — that shows genuine curiosity."
  - "Interesting angle — few people think of it this way."
  - "That's a curious one — let's see what lies behind it."
  - "I like that — let's reflect on it for a moment."
  - "You're connecting the dots beautifully."
  - "That question shows deep thinking."

**Occasional empathy / light warmth**:
  - "I can see why you'd wonder that."
  - "A fair question — and one that deserves clarity."
  - "That's a common point of confusion — let's clear it up."
  - "It's natural to think that — here's what's actually happening."
  - "I completely understand that curiosity."
  - "Good that you brought that up — it often gets overlooked."
  - "You've picked up on a subtle but important detail."
  - "I appreciate that observation — it adds perspective."
  - "That's a keen insight, truly."
  - "It's always refreshing to see questions framed this thoughtfully."

**Explain first (always)**: Begin with a short, clear paragraph that explains the answer in natural prose. This paragraph should present the main idea, cause/effect, or context so the user immediately understands the point.

**Bullets only when helpful (after the explanation)**: Only include a concise bullet list if the content genuinely benefits from list form (e.g., steps, timeline events, comparisons, or short facts). Bullets must follow the opening paragraph — do not use bullets before the explanation. Keep each bullet to 1–2 lines.

**One-line summary / takeaway (always)**: End with a single short summary line (1 sentence) that captures the essence. Start that line with one of these summary-starter phrases (choose and alternate naturally to avoid repetition): "In summary:", "To summarise:", "In essence:", "Overall:", "Takeaway:", "Key takeaway:", "Broadly speaking:". Make this final line stand out by bolding it.

**Style & small rules**:
• Use short paragraphs and smooth connectors (e.g. "However," "As a result," "Therefore," "Notably," "In essence").
• Bold key dates, laws, names, or figures for clarity.
• Avoid heavy Markdown headings; use plain text headings only if truly necessary.
• Keep British spelling and phrasing.
• Keep answers concise — clarity over length.

**Performance**: Ensure generation + formatting finishes within 3–5 seconds.

USER QUERY: ${prompt}

Note: Responding with model knowledge only (search unavailable).

Provide a comprehensive yet conversational response that flows naturally.`;

    const modelResponse = await callModelGateway({
      prompt: finalPrompt,
      userId,
      intentType,
      searchSources: sources,
      hasSearchContext: searchContext.length > 0,
      preferredModel
    });

    // Update quota usage
    await updateQuotaUsage(userId, intentType || 'creative', contentType, modelResponse.tokensUsed || 0);

    const totalLatency = Date.now() - startTime;
    console.log('Chat router completed:', {
      totalLatency,
      searchContextLength: searchContext.length,
      sourcesCount: sources.length,
      modelTokens: modelResponse.tokensUsed || 0,
      ...searchMetrics
    });

    return new Response(JSON.stringify({
      response: modelResponse.content,
      sources: sources.length > 0 ? sources.map(s => ({
        id: s.id,
        title: s.title,
        url: s.url,
        domain: s.domain,
        type: s.type,
        publishedAt: s.publishedAt,
        metadata: s.metadata
      })) : undefined,
      quotaRemaining: quotaCheck.remaining - 1,
      fallbackUsed: modelResponse.fallbackUsed || !searchContext,
      metrics: {
        totalLatency,
        searchLatency: searchMetrics.webSearchLatency + searchMetrics.rssSearchLatency,
        modelLatency: modelResponse.latency || 0,
        sourcesUsed: sources.length,
        cacheHitRate: searchMetrics.totalSources > 0 ? 
          (searchMetrics.cacheHits / searchMetrics.totalSources) : 0,
        tokensInjected: searchContext.length,
        tokensReturned: modelResponse.tokensUsed || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const totalLatency = Date.now() - startTime;
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
  // Enhanced context limits based on user requirements
  const contextLimits = {
    user_search: { sources: 5, tokensPerSource: 300, maxTokens: 1500 }, // Think Hard
    knowledge: { sources: 7, tokensPerSource: 300, maxTokens: 2100 },   // Deep Research (partial)
    research: { sources: 10, tokensPerSource: 300, maxTokens: 3000 },   // Deep Research (full)
    creative: { sources: 3, tokensPerSource: 200, maxTokens: 600 },     // Minimal for creative
    experience_studio: { sources: 5, tokensPerSource: 300, maxTokens: 1500 }
  };

  const limits = contextLimits[intentType as keyof typeof contextLimits] || contextLimits.user_search;
  let context = '';
  let totalTokens = 0;
  let sourceCount = 0;

  // Prioritize fresh RSS content
  const sortedResults = results.sort((a, b) => {
    // Fresh RSS gets highest priority
    if (a.type === 'rss' && a.metadata?.freshness === 'fresh') return -1;
    if (b.type === 'rss' && b.metadata?.freshness === 'fresh') return 1;
    
    // Then by score
    return (b.score || 0) - (a.score || 0);
  });

  for (const result of sortedResults) {
    if (sourceCount >= limits.sources || totalTokens >= limits.maxTokens) break;

    const id = result.type === 'rss' ? `[RSS${sourceCount + 1}]` : `[G${sourceCount + 1}]`;
    const snippet = result.snippet || result.summary || '';
    
    // Create enhanced snippet with metadata
    const publishedInfo = result.publishedAt ? 
      ` (${new Date(result.publishedAt).toLocaleDateString()})` : '';
    const domainInfo = result.domain ? ` - ${result.domain}` : '';
    
    // Clean and limit snippet to token budget
    const cleanSnippet = snippet
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, limits.tokensPerSource - 50); // Reserve 50 chars for metadata
    
    const formattedEntry = `${id} ${result.title}${publishedInfo}${domainInfo}: ${cleanSnippet}\n\n`;
    
    if (totalTokens + formattedEntry.length <= limits.maxTokens) {
      context += formattedEntry;
      totalTokens += formattedEntry.length;
      sourceCount++;
      result.id = id; // Add ID for citation
    }
  }

  console.log(`Context formatted: ${sourceCount} sources, ${totalTokens} tokens (limit: ${limits.maxTokens})`);
  
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
    const webSources = sources?.filter(s => s.type === 'google') || [];
    const rssSources = sources?.filter(s => s.type === 'rss') || [];
    const cacheHits = sources?.filter(s => s.cached || s.metadata?.cached).length || 0;
    
    await supabase
      .from('search_queries')
      .insert({
        user_id: userId,
        query_text: query,
        intent_type: intentType,
        sources_used: sources || [],
        tokens_consumed: tokensConsumed || 0,
        search_results_count: sources?.length || 0,
        web_sources_count: webSources.length,
        rss_sources_count: rssSources.length,
        cache_hits: cacheHits,
        fallback_used: sources?.length === 0
      });
      
    console.log('Search query logged:', {
      query: query.substring(0, 50),
      sourcesCount: sources?.length || 0,
      webSources: webSources.length,
      rssSources: rssSources.length,
      cacheHits
    });
  } catch (error) {
    console.error('Log search query error:', error);
  }
}