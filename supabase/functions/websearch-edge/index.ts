import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const googleApiKey = Deno.env.get('GOOGLE_PROGRAMMABLE_SEARCH_API_KEY');
const searchEngineId = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID');

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const WEBSEARCH_TIMEOUT = 3000; // 3 seconds

interface SearchRequest {
  query: string;
  intentType?: string;
  maxResults?: number;
}

interface SearchResult {
  id: string;
  type: 'google';
  title: string;
  snippet: string;
  url: string;
  displayUrl: string;
  publishedAt?: string;
  domain: string;
  score?: number;
  metadata?: {
    cached: boolean;
    scrapedContent?: boolean;
    contentLength?: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let searchLatency = 0;
  let scrapingLatency = 0;
  let cacheHits = 0;

  try {
    const { query, intentType, maxResults = 5 }: SearchRequest = await req.json();
    console.log('Websearch request:', { query, intentType, maxResults, timestamp: startTime });

    if (!googleApiKey || !searchEngineId) {
      console.error('Google API credentials not configured');
      return new Response(JSON.stringify({
        error: 'Search service not configured',
        results: [],
        fallbackUsed: true
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check cache first
    const cacheKey = `websearch:${btoa(query)}:${maxResults}`;
    const cachedResults = await getCachedResults(cacheKey);
    
    if (cachedResults) {
      console.log('Cache hit for websearch query:', query);
      return new Response(JSON.stringify({
        results: cachedResults,
        query,
        intentType,
        source: 'google_programmable_search',
        cached: true,
        metrics: { cacheHit: true, responseTime: Date.now() - startTime }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Perform Google Programmable Search with timeout
    let searchResults: any[] = [];
    try {
      const searchStart = Date.now();
      searchResults = await Promise.race([
        performGoogleSearch(query, maxResults),
        new Promise<any[]>((_, reject) => 
          setTimeout(() => reject(new Error('Search timeout')), WEBSEARCH_TIMEOUT)
        )
      ]);
      searchLatency = Date.now() - searchStart;
    } catch (timeoutError) {
      console.warn('Google search timed out, returning empty results');
      return new Response(JSON.stringify({
        error: 'Search timeout',
        results: [],
        fallbackUsed: true,
        message: 'Search took too long, please try with RSS feeds or model knowledge'
      }), {
        status: 408,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Process and clean results with parallel scraping
    const scrapingStart = Date.now();
    const processedResults = await Promise.all(
      searchResults.map(async (result, index) => {
        const domain = extractDomain(result.displayUrl);
        const cleanedContent = await scrapeAndCleanContent(result.url);
        
        // Create enhanced snippet with metadata
        const enhancedSnippet = createEnhancedSnippet(
          result.title,
          cleanedContent || result.snippet,
          result.url
        );

        return {
          id: `G${index + 1}`,
          type: 'google' as const,
          title: cleanTitle(result.title),
          snippet: enhancedSnippet,
          url: result.url,
          displayUrl: result.displayUrl,
          domain,
          publishedAt: extractPublishDate(cleanedContent || '') || undefined,
          score: calculateRelevanceScore(result, query),
          metadata: {
            cached: false,
            scrapedContent: cleanedContent ? true : false,
            contentLength: cleanedContent?.length || result.snippet.length
          }
        };
      })
    );
    scrapingLatency = Date.now() - scrapingStart;

    // Sort by relevance score
    processedResults.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Cache results for 24 hours
    await cacheResults(cacheKey, processedResults);

    const totalLatency = Date.now() - startTime;
    console.log(`Websearch completed: ${processedResults.length} results`, {
      searchLatency,
      scrapingLatency,
      totalLatency,
      cacheHits
    });

    return new Response(JSON.stringify({
      results: processedResults,
      query,
      intentType,
      source: 'google_programmable_search',
      cached: false,
      metrics: {
        searchLatency,
        scrapingLatency,
        totalLatency,
        cacheHits,
        resultsCount: processedResults.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const totalLatency = Date.now() - startTime;
    console.error('Websearch error:', error, { totalLatency });
    
    return new Response(JSON.stringify({
      error: 'Search failed',
      results: [],
      fallbackUsed: true,
      message: 'Google search is temporarily unavailable',
      metrics: { totalLatency, error: error instanceof Error ? error.message : 'Unknown error' }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function performGoogleSearch(query: string, maxResults: number): Promise<any[]> {
  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=${Math.min(maxResults, 10)}`;

  const response = await fetch(searchUrl);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Google Search API error:', error);
    throw new Error(`Google Search failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    console.log('No search results found');
    return [];
  }

  return data.items.map((item: any) => ({
    title: item.title,
    snippet: item.snippet,
    url: item.link,
    displayUrl: item.displayLink
  }));
}

async function getCachedResults(cacheKey: string): Promise<SearchResult[] | null> {
  try {
    const { data } = await supabase
      .from('search_cache')
      .select('results, created_at')
      .eq('cache_key', cacheKey)
      .single();

    if (!data) return null;

    const cacheAge = Date.now() - new Date(data.created_at).getTime();
    if (cacheAge > CACHE_DURATION) {
      // Cache expired, clean up
      await supabase.from('search_cache').delete().eq('cache_key', cacheKey);
      return null;
    }

    return data.results as SearchResult[];
  } catch (error) {
    console.log('Cache lookup failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

async function cacheResults(cacheKey: string, results: SearchResult[]): Promise<void> {
  try {
    await supabase
      .from('search_cache')
      .upsert({
        cache_key: cacheKey,
        results,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'cache_key'
      });
  } catch (error) {
    console.log('Cache storage failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function scrapeAndCleanContent(url: string): Promise<string | null> {
  try {
    // Timeout for scraping individual pages
    const response = await Promise.race([
      fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WebsearchBot/1.0)'
        }
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Scrape timeout')), 2000)
      )
    ]);

    if (!response.ok) {
      console.log(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    
    // Enhanced HTML cleaning with better content extraction
    let textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '') // Remove navigation
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '') // Remove headers
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '') // Remove footers
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '') // Remove sidebars
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/<[^>]+>/g, ' ') // Remove remaining HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Filter out unwanted content
    if (isUnwantedContent(textContent)) {
      return null;
    }

    // Extract article-like content (title + first 200-400 words + one deeper paragraph)
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 15);
    
    // Get first paragraph (likely title/summary)
    const firstPart = sentences.slice(0, 3).join('. ');
    
    // Get middle content for depth
    const middleStart = Math.floor(sentences.length * 0.3);
    const middleEnd = Math.floor(sentences.length * 0.6);
    const deeperParagraph = sentences.slice(middleStart, middleEnd)
      .find(s => s.length > 50 && s.length < 200) || '';
    
    // Combine and limit
    const combinedContent = `${firstPart}. ${deeperParagraph}`.trim();
    const finalContent = combinedContent.substring(0, 400);

    return finalContent.length > 50 ? finalContent : null;

  } catch (error) {
    console.log(`Content scraping failed for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

function createEnhancedSnippet(title: string, content: string, url: string): string {
  // Clean and structure the snippet
  const cleanedContent = content
    .replace(/\s+/g, ' ')
    .trim();
  
  // Extract first substantial paragraph
  const firstParagraph = cleanedContent.split('.').slice(0, 2).join('.').trim();
  
  return firstParagraph.length > 20 ? firstParagraph : cleanedContent.substring(0, 300);
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-.,;:!?()]/g, '')
    .trim()
    .substring(0, 120);
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url.split('/')[0] || 'unknown';
  }
}

function extractPublishDate(content: string): string | undefined {
  if (!content) return undefined;
  
  // Look for common date patterns
  const datePatterns = [
    /(\w+ \d{1,2}, \d{4})/,
    /(\d{4}-\d{2}-\d{2})/,
    /(\d{1,2}\/\d{1,2}\/\d{4})/
  ];
  
  for (const pattern of datePatterns) {
    const match = content.match(pattern);
    if (match) {
      const date = new Date(match[1]);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
  }
  
  return undefined;
}

function calculateRelevanceScore(result: any, query: string): number {
  const queryTerms = query.toLowerCase().split(/\s+/);
  const titleText = result.title.toLowerCase();
  const snippetText = result.snippet.toLowerCase();
  
  let score = 0;
  
  // Score based on query terms in title (higher weight)
  queryTerms.forEach(term => {
    if (titleText.includes(term)) {
      score += 3;
    }
    if (snippetText.includes(term)) {
      score += 1;
    }
  });
  
  // Bonus for exact phrase matches
  if (titleText.includes(query.toLowerCase())) {
    score += 5;
  }
  if (snippetText.includes(query.toLowerCase())) {
    score += 2;
  }
  
  // Authority domain bonus (basic heuristic)
  const authorityDomains = [
    'wikipedia.org', 'edu', 'gov', 'bbc.com', 'reuters.com', 
    'nytimes.com', 'washingtonpost.com', 'nature.com', 'sciencemag.org'
  ];
  
  const domain = result.displayUrl.toLowerCase();
  if (authorityDomains.some(auth => domain.includes(auth))) {
    score += 2;
  }
  
  return score;
}

// Helper function to check if content contains ads or unwanted elements
function isUnwantedContent(text: string): boolean {
  const adKeywords = [
    'advertisement', 'sponsored', 'ad choices', 'privacy policy',
    'cookie policy', 'subscribe now', 'sign up for'
  ];
  
  const lowerText = text.toLowerCase();
  return adKeywords.some(keyword => lowerText.includes(keyword));
}