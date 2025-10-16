import React from 'react';
import { X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrendingPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenRSSReader: (category?: string) => void;
}


export function TrendingPanel({ isVisible, onClose, onOpenRSSReader }: TrendingPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="ml-20 h-full w-full max-w-sm bg-background border-r border-border shadow-lg animate-in slide-in-from-left duration-200 z-30">
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
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="text-8xl mb-4">📰</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Stay Informed</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Access the latest news from trusted sources across multiple categories
            </p>
          </div>
          
          <Button 
            onClick={() => onOpenRSSReader()}
            className="w-full max-w-xs"
            variant="default"
            size="lg"
          >
            Open RSS Reader
          </Button>
          
          <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg bg-muted/20 max-w-sm">
            <p className="text-sm text-muted-foreground">
              Browse articles by category, search within topics, and read full content in a distraction-free environment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrendingPanel;