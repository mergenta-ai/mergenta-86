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
  score?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, intentType, maxResults = 5 }: SearchRequest = await req.json();
    console.log('Websearch request:', { query, intentType, maxResults });

    if (!googleApiKey || !searchEngineId) {
      console.error('Google API credentials not configured');
      return new Response(JSON.stringify({
        error: 'Search service not configured',
        results: []
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Perform Google Programmable Search
    const searchResults = await performGoogleSearch(query, maxResults);
    
    // Process and clean results
    const processedResults = await Promise.all(
      searchResults.map(async (result, index) => {
        const cleanedContent = await scrapeAndCleanContent(result.url);
        return {
          id: `G${index + 1}`,
          type: 'google' as const,
          title: result.title,
          snippet: cleanedContent || result.snippet,
          url: result.url,
          displayUrl: result.displayUrl,
          score: calculateRelevanceScore(result, query)
        };
      })
    );

    // Sort by relevance score
    processedResults.sort((a, b) => (b.score || 0) - (a.score || 0));

    console.log(`Websearch completed: ${processedResults.length} results`);

    return new Response(JSON.stringify({
      results: processedResults,
      query,
      intentType,
      source: 'google_programmable_search'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Websearch error:', error);
    return new Response(JSON.stringify({
      error: 'Search failed',
      results: [],
      message: 'Google search is temporarily unavailable'
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

async function scrapeAndCleanContent(url: string): Promise<string | null> {
  try {
    // Basic content scraping (in production, you'd want a more robust solution)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebsearchBot/1.0)'
      }
    });

    if (!response.ok) {
      console.log(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    
    // Basic HTML cleaning - extract text content
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<[^>]+>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Extract meaningful content (first few paragraphs)
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const meaningfulContent = sentences.slice(0, 5).join('. ').substring(0, 300);

    return meaningfulContent || null;

  } catch (error) {
    console.log(`Content scraping failed for ${url}:`, error.message);
    return null;
  }
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