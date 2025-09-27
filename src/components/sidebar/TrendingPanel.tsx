import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { TrendingUp, ChevronRight, ExternalLink, RefreshCw, ArrowLeft } from 'lucide-react';
import { RSSService, RSSFeedItem } from '@/services/rssService';
import { toast } from 'sonner';

interface TrendingPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const trendingCategories = [
  { name: 'Sports', value: 'sports', icon: '⚽' },
  { name: 'Finance', value: 'finance', icon: '💰' },
  { name: 'Travel', value: 'travel', icon: '✈️' },
  { name: 'Academics', value: 'academics', icon: '🎓' },
  { name: 'Entertainment', value: 'entertainment', icon: '🎬' },
  { name: 'Politics', value: 'politics', icon: '🏛️' },
  { name: 'Wellness', value: 'wellness', icon: '🧘' },
  { name: 'Technology', value: 'technology', icon: '💻' },
  { name: 'Local', value: 'local', icon: '📍' },
];

const TrendingPanel: React.FC<TrendingPanelProps> = ({ isVisible, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [feeds, setFeeds] = useState<RSSFeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCategoryClick = async (categoryValue: string, categoryName: string) => {
    setSelectedCategory(categoryValue);
    setLoading(true);
    
    try {
      const feedItems = await RSSService.getRecentFeeds(categoryValue, 20);
      setFeeds(feedItems);
      
      if (feedItems.length === 0) {
        toast.info(`No recent articles found for ${categoryName}`);
      }
    } catch (error) {
      console.error('Error fetching feeds:', error);
      toast.error('Failed to load trending articles');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await RSSService.refreshFeeds();
      toast.success('RSS feeds refreshed successfully');
      
      if (selectedCategory) {
        const feedItems = await RSSService.getRecentFeeds(selectedCategory, 20);
        setFeeds(feedItems);
      }
    } catch (error) {
      console.error('Error refreshing feeds:', error);
      toast.error('Failed to refresh RSS feeds');
    } finally {
      setRefreshing(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setFeeds([]);
  };

  const handleArticleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isVisible) return null;

  return (
    <div className="ml-20 h-full bg-white border-r border-gray-200 shadow-lg animate-in slide-in-from-left duration-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedCategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToCategories}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedCategory ? 
                    `${trendingCategories.find(c => c.value === selectedCategory)?.name} News` : 
                    'Trending Topics'
                  }
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedCategory ? 'Latest articles' : 'Explore popular categories'}
                </p>
              </div>
            </div>
            
            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedCategory ? (
            /* Categories View */
            <div className="space-y-2">
              {trendingCategories.map((category) => (
                <Button
                  key={category.name}
                  variant="ghost"
                  className="w-full justify-between h-12 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  onClick={() => handleCategoryClick(category.value, category.name)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Button>
              ))}
            </div>
          ) : (
            /* Feeds View */
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : feeds.length > 0 ? (
                feeds.map((feed) => (
                  <div
                    key={feed.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors duration-200 group"
                    onClick={() => handleArticleClick(feed.url)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm leading-5 mb-2 group-hover:text-primary transition-colors">
                          {feed.title}
                        </h3>
                        {feed.summary && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {feed.summary}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="font-medium">{feed.source_name}</span>
                          <span>{RSSService.formatTimeAgo(feed.published_at || feed.scraped_at)}</span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 ml-2 shrink-0 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No articles found for this category</p>
                  <p className="text-gray-400 text-xs mt-1">Try refreshing or check back later</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            {selectedCategory ? 
              `Showing latest ${selectedCategory} articles` : 
              'Stay updated with the latest trends'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendingPanel;