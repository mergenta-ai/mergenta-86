import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface FeedRequest {
  query?: string;
  intentType?: string;
  category?: string;
  maxResults?: number;
  refreshFeeds?: boolean;
}

interface FeedResult {
  id: string;
  type: 'rss';
  title: string;
  snippet: string;
  summary?: string;
  url: string;
  sourceName: string;
  category: string;
  publishedAt: string;
  score?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, intentType, category, maxResults = 5, refreshFeeds = false }: FeedRequest = await req.json();
    console.log('News feeds request:', { query, intentType, category, refreshFeeds });

    // Refresh feeds if requested or if they're stale
    if (refreshFeeds || await shouldRefreshFeeds()) {
      console.log('Refreshing RSS feeds...');
      await refreshRSSFeeds();
    }

    // Search cached RSS content
    let rssResults = [];
    
    if (query) {
      rssResults = await searchRSSContent(query, category, maxResults);
    } else {
      rssResults = await getRecentRSSContent(category, maxResults);
    }

    // Process results and add IDs for citation
    const processedResults = rssResults.map((result, index) => ({
      ...result,
      id: `RSS${index + 1}`,
      type: 'rss' as const,
      score: query ? calculateRSSRelevanceScore(result, query) : 0
    }));

    // Sort by relevance if we have a query, otherwise by date
    if (query) {
      processedResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    console.log(`RSS search completed: ${processedResults.length} results`);

    return new Response(JSON.stringify({
      results: processedResults,
      query,
      intentType,
      category,
      source: 'rss_feeds',
      cached: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('News feeds error:', error);
    return new Response(JSON.stringify({
      error: 'RSS feed processing failed',
      results: [],
      message: 'News feeds are temporarily unavailable'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function shouldRefreshFeeds(): Promise<boolean> {
  try {
    const { data: latestFeed } = await supabase
      .from('rss_feeds')
      .select('scraped_at')
      .order('scraped_at', { ascending: false })
      .limit(1)
      .single();

    if (!latestFeed) return true;

    const lastScraped = new Date(latestFeed.scraped_at);
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));

    return lastScraped < twoHoursAgo;
  } catch (error) {
    console.log('Error checking feed freshness:', error);
    return true;
  }
}

async function refreshRSSFeeds() {
  try {
    // Get RSS source URLs from admin settings
    const { data: rssSources } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'rss_sources')
      .single();

    if (!rssSources || !rssSources.setting_value) {
      console.log('No RSS sources configured');
      return;
    }

    const sources = rssSources.setting_value as any[];
    console.log(`Refreshing ${sources.length} RSS sources`);

    // Process feeds in parallel (but limit concurrency)
    const batchSize = 3;
    for (let i = 0; i < sources.length; i += batchSize) {
      const batch = sources.slice(i, i + batchSize);
      await Promise.all(batch.map(source => processFeed(source)));
    }

    console.log('RSS feeds refresh completed');
  } catch (error) {
    console.error('RSS refresh error:', error);
  }
}

async function processFeed(source: any) {
  try {
    console.log(`Processing feed: ${source.name}`);
    
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsFeedBot/1.0)'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${source.name}: ${response.status}`);
      return;
    }

    const xmlText = await response.text();
    const feedItems = await parseRSSFeed(xmlText, source);

    // Store items in database
    for (const item of feedItems) {
      try {
        await supabase
          .from('rss_feeds')
          .upsert({
            source_name: source.name,
            source_url: source.url,
            category: source.category,
            title: item.title,
            content: item.content,
            summary: item.summary,
            url: item.url,
            published_at: item.publishedAt,
            scraped_at: new Date().toISOString(),
            is_active: true
          }, {
            onConflict: 'url'
          });
      } catch (dbError) {
        console.error(`Database error for ${item.url}:`, dbError);
      }
    }

    console.log(`Processed ${feedItems.length} items from ${source.name}`);

  } catch (error) {
    console.error(`Error processing feed ${source.name}:`, error);
  }
}

async function parseRSSFeed(xmlText: string, source: any): Promise<any[]> {
  try {
    // Simple RSS/Atom parsing (in production, use a proper XML parser)
    const items = [];
    
    // Extract items using regex (basic approach)
    const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || 
                       xmlText.match(/<entry[^>]*>[\s\S]*?<\/entry>/gi) || [];

    for (const itemXml of itemMatches.slice(0, 10)) { // Limit to 10 most recent
      const title = extractXMLTag(itemXml, 'title') || 'No title';
      const description = extractXMLTag(itemXml, 'description') || 
                         extractXMLTag(itemXml, 'summary') || 
                         extractXMLTag(itemXml, 'content') || '';
      const link = extractXMLTag(itemXml, 'link') || 
                  extractXMLTag(itemXml, 'guid') || '';
      const pubDate = extractXMLTag(itemXml, 'pubDate') || 
                     extractXMLTag(itemXml, 'published') || 
                     extractXMLTag(itemXml, 'updated') || '';

      if (title && link) {
        // Clean content
        const cleanContent = description
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 500);

        const summary = cleanContent.substring(0, 200);

        items.push({
          title: title.replace(/\s+/g, ' ').trim(),
          content: cleanContent,
          summary,
          url: link.trim(),
          publishedAt: parseDate(pubDate) || new Date().toISOString()
        });
      }
    }

    return items;
  } catch (error) {
    console.error('RSS parsing error:', error);
    return [];
  }
}

function extractXMLTag(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function parseDate(dateString: string): string | null {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

async function searchRSSContent(query: string, category?: string, maxResults: number = 5): Promise<any[]> {
  try {
    let dbQuery = supabase
      .from('rss_feeds')
      .select('*')
      .eq('is_active', true)
      .order('published_at', { ascending: false });

    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    // Simple text search in title and content
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    const { data: feeds } = await dbQuery.limit(50); // Get more for filtering

    if (!feeds) return [];

    // Filter and score results
    const scoredResults = feeds
      .map(feed => ({
        ...feed,
        snippet: feed.summary || feed.content?.substring(0, 200) || '',
        sourceName: feed.source_name,
        publishedAt: feed.published_at
      }))
      .filter(feed => {
        const searchText = `${feed.title} ${feed.content}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term));
      })
      .slice(0, maxResults);

    return scoredResults;

  } catch (error) {
    console.error('RSS search error:', error);
    return [];
  }
}

async function getRecentRSSContent(category?: string, maxResults: number = 5): Promise<any[]> {
  try {
    let query = supabase
      .from('rss_feeds')
      .select('*')
      .eq('is_active', true)
      .order('published_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: feeds } = await query.limit(maxResults);

    if (!feeds) return [];

    return feeds.map(feed => ({
      ...feed,
      snippet: feed.summary || feed.content?.substring(0, 200) || '',
      sourceName: feed.source_name,
      publishedAt: feed.published_at
    }));

  } catch (error) {
    console.error('Recent RSS content error:', error);
    return [];
  }
}

function calculateRSSRelevanceScore(result: any, query: string): number {
  const queryTerms = query.toLowerCase().split(/\s+/);
  const titleText = result.title.toLowerCase();
  const contentText = (result.content || '').toLowerCase();
  
  let score = 0;
  
  // Score based on query terms in title (higher weight)
  queryTerms.forEach(term => {
    if (titleText.includes(term)) {
      score += 3;
    }
    if (contentText.includes(term)) {
      score += 1;
    }
  });
  
  // Bonus for exact phrase matches
  if (titleText.includes(query.toLowerCase())) {
    score += 5;
  }
  if (contentText.includes(query.toLowerCase())) {
    score += 2;
  }
  
  // Recency bonus (newer articles get higher scores)
  const publishedDate = new Date(result.publishedAt || '');
  const now = new Date();
  const ageInHours = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);
  
  if (ageInHours < 24) {
    score += 2; // Fresh content bonus
  } else if (ageInHours < 168) { // 1 week
    score += 1;
  }
  
  return score;
}