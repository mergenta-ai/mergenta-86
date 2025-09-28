import React from 'react';
import { X, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TrendingPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenRSSReader: (category?: string) => void;
}

const trendingCategories = [
  { name: 'All News', value: '', icon: '📰', description: 'Browse all latest news articles' },
  { name: 'Sports', value: 'sports', icon: '⚽', description: 'Sports news and updates' },
  { name: 'Finance', value: 'finance', icon: '💰', description: 'Financial markets and business news' },
  { name: 'Travel', value: 'travel', icon: '✈️', description: 'Travel guides and destination news' },
  { name: 'Academics', value: 'academics', icon: '🎓', description: 'Educational and research updates' },
  { name: 'Entertainment', value: 'entertainment', icon: '🎬', description: 'Movies, TV, and celebrity news' },
  { name: 'Politics', value: 'politics', icon: '🏛️', description: 'Political news and analysis' },
  { name: 'Wellness', value: 'wellness', icon: '🧘', description: 'Health and wellness tips' },
  { name: 'Technology', value: 'technology', icon: '💻', description: 'Tech news and innovations' },
  { name: 'Local', value: 'local', icon: '📍', description: 'Local news and events' }
];

export function TrendingPanel({ isVisible, onClose, onOpenRSSReader }: TrendingPanelProps) {
  const handleCategoryClick = (categoryValue: string) => {
    onOpenRSSReader(categoryValue);
  };

  if (!isVisible) return null;

  return (
    <div className="ml-20 h-full w-[400px] bg-background border-r border-border shadow-lg animate-in slide-in-from-left duration-200 z-30">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Trending News</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Open full RSS reader to browse articles by category
              </p>
              <Button 
                onClick={() => handleCategoryClick('')}
                className="w-full mb-4 justify-between"
              >
                <span>Open RSS Reader</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Categories</h4>
              {trendingCategories.slice(1).map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryClick(category.value)}
                  className="w-full p-3 text-left border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Click any category to open the full RSS reader
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrendingPanel;