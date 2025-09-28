import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface CategoryHeaderProps {
  category: string;
  icon: string;
  articleCount: number;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function CategoryHeader({ category, icon, articleCount, onSearch, searchQuery }: CategoryHeaderProps) {
  return (
    <div className="border-b bg-gradient-to-r from-primary/5 to-accent/5 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-primary">{category}</h2>
              <p className="text-muted-foreground">
                <Badge variant="outline" className="mr-2">
                  {articleCount} articles
                </Badge>
                Latest news and updates
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}