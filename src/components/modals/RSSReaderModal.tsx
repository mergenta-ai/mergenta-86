import React, { useState, useEffect } from 'react';
import { X, Search, Grid, List, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RSSService, RSSFeedItem } from '@/services/rssService';
import { ArticleList } from '@/components/rss/ArticleList';
import { ArticleReader } from '@/components/rss/ArticleReader';

interface RSSReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

const categories = [
  { name: 'All News', value: '', icon: '📰' },
  { name: 'Sports', value: 'sports', icon: '⚽' },
  { name: 'Finance', value: 'finance', icon: '💰' },
  { name: 'Travel', value: 'travel', icon: '✈️' },
  { name: 'Academics', value: 'academics', icon: '🎓' },
  { name: 'Entertainment', value: 'entertainment', icon: '🎬' },
  { name: 'Politics', value: 'politics', icon: '🏛️' },
  { name: 'Wellness', value: 'wellness', icon: '🧘' },
  { name: 'Technology', value: 'technology', icon: '💻' },
  { name: 'Local', value: 'local', icon: '📍' }
];

export function RSSReaderModal({ isOpen, onClose, initialCategory = '' }: RSSReaderModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [articles, setArticles] = useState<RSSFeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedArticle, setSelectedArticle] = useState<RSSFeedItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArticles = async (category: string = '', search: string = '') => {
    setLoading(true);
    try {
      let results: RSSFeedItem[] = [];
      if (search) {
        results = await RSSService.searchFeeds(search, category || undefined, 100);
      } else {
        results = await RSSService.getRecentFeeds(category || undefined, 100);
      }
      setArticles(results);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setSelectedArticle(null);
    fetchArticles(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      fetchArticles(selectedCategory, query);
    } else {
      fetchArticles(selectedCategory);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await RSSService.refreshFeeds();
      await fetchArticles(selectedCategory, searchQuery);
    } catch (error) {
      console.error('Error refreshing feeds:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleArticleClick = (article: RSSFeedItem) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory('');
    setSelectedArticle(null);
    setSearchQuery('');
    setArticles([]);
  };

  useEffect(() => {
    if (isOpen && selectedCategory) {
      fetchArticles(selectedCategory);
    }
  }, [isOpen, selectedCategory]);

  const currentCategoryName = categories.find(cat => cat.value === selectedCategory)?.name || 'All News';
  const currentCategoryIcon = categories.find(cat => cat.value === selectedCategory)?.icon || '📰';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-8xl w-full h-[98vh] p-0 border-0 bg-background" hideCloseButton>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col border-b bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectedArticle ? handleBackToList : handleBackToCategories}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {selectedArticle ? 'Back to Articles' : 'Back to Categories'}
                  </Button>
                )}
                <h1 className="text-2xl font-bold text-primary">
                  {selectedArticle ? 'Article Reader' : selectedCategory ? currentCategoryName : 'RSS News Reader'}
                </h1>
                {selectedCategory && !selectedArticle && (
                  <span className="text-2xl">{currentCategoryIcon}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!selectedArticle && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    
                    {selectedCategory && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                          className="flex items-center gap-2"
                        >
                          {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                          {viewMode === 'grid' ? 'List' : 'Grid'}
                        </Button>
                      </>
                    )}
                  </>
                )}
                
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Search bar for category view */}
            {selectedCategory && !selectedArticle && (
              <div className="px-6 pb-4">
                <div className="relative w-full md:w-80 ml-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content with scrollbars */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
            {selectedArticle ? (
              <div className="h-full overflow-y-auto scrollbar-thin">
                <ArticleReader article={selectedArticle} onBack={handleBackToList} />
              </div>
            ) : selectedCategory ? (
              <div className="flex flex-col h-full min-h-0">
                <div className="p-6 border-b">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">
                        {articles.length} articles
                      </Badge>
                      <span className="text-muted-foreground">Latest news and updates</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
                  <ArticleList 
                    articles={articles}
                    loading={loading}
                    viewMode={viewMode}
                    onArticleClick={handleArticleClick}
                  />
                </div>
              </div>
            ) : (
              // Category Selection with scrollbar
              <div className="h-full overflow-y-auto scrollbar-thin">
                <div className="p-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold mb-4">Choose a News Category</h2>
                      <p className="text-muted-foreground text-lg">
                        Select a category to browse the latest articles and news
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          onClick={() => handleCategorySelect(category.value)}
                          className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                        >
                          <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                            {category.icon}
                          </span>
                          <span className="font-semibold text-sm text-center group-hover:text-primary">
                            {category.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}