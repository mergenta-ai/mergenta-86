import { supabase } from "@/integrations/supabase/client";

export interface RSSFeedItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  url: string;
  source_name: string;
  category: string;
  published_at: string;
  scraped_at: string;
}

export interface RSSFeedRequest {
  query?: string;
  category?: string;
  maxResults?: number;
  refreshFeeds?: boolean;
}

export interface RSSFeedResponse {
  results: RSSFeedItem[];
  totalCount: number;
  categories: string[];
}

export class RSSService {
  static async fetchRSSFeeds(params: RSSFeedRequest = {}): Promise<RSSFeedResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('news-feeds-edge', {
        body: {
          query: params.query || '',
          category: params.category,
          maxResults: params.maxResults || 50,
          refreshFeeds: params.refreshFeeds || false
        }
      });

      if (error) {
        console.error('Error fetching RSS feeds:', error);
        throw error;
      }

      return {
        results: data.results || [],
        totalCount: data.totalCount || 0,
        categories: data.categories || []
      };
    } catch (error) {
      console.error('RSS Service error:', error);
      throw error;
    }
  }

  static async getRecentFeeds(category?: string, maxResults: number = 20): Promise<RSSFeedItem[]> {
    try {
      const response = await this.fetchRSSFeeds({ 
        category, 
        maxResults,
        refreshFeeds: false 
      });
      return response.results;
    } catch (error) {
      console.error('Error getting recent feeds:', error);
      return [];
    }
  }

  static async getAllCategories(): Promise<string[]> {
    try {
      const response = await this.fetchRSSFeeds({ maxResults: 1 });
      return response.categories;
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  static async searchFeeds(query: string, category?: string, maxResults: number = 20): Promise<RSSFeedItem[]> {
    try {
      const response = await this.fetchRSSFeeds({ 
        query, 
        category, 
        maxResults,
        refreshFeeds: false 
      });
      return response.results;
    } catch (error) {
      console.error('Error searching feeds:', error);
      return [];
    }
  }

  static async refreshFeeds(): Promise<boolean> {
    try {
      await supabase.functions.invoke('news-feeds-edge', {
        body: {
          refreshFeeds: true,
          maxResults: 1
        }
      });
      return true;
    } catch (error) {
      console.error('Error refreshing feeds:', error);
      return false;
    }
  }

  static formatTimeAgo(dateString: string): string {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  }

  static getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'sports': '⚽',
      'finance': '💰',
      'travel': '✈️',
      'academics': '🎓',
      'entertainment': '🎬',
      'politics': '🏛️',
      'wellness': '🧘',
      'technology': '💻',
      'local': '📍',
      'news': '📰'
    };
    return iconMap[category.toLowerCase()] || '📰';
  }
}