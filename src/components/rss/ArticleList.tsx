import React from 'react';
import { RSSFeedItem } from '@/services/rssService';
import { ArticleCard } from './ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleListProps {
  articles: RSSFeedItem[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  onArticleClick: (article: RSSFeedItem) => void;
}

export function ArticleList({ articles, loading, viewMode, onArticleClick }: ArticleListProps) {
  if (loading) {
    return (
      <div className="p-6">
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
          <p className="text-muted-foreground">
            No articles available for this category at the moment. Try refreshing or select a different category.
          </p>
        </div>
      </div>
    );
  }

  // Filter out articles without images as an extra safety measure
  const articlesWithImages = articles.filter(article => article.image_url);

  return (
    <div className="p-6">
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'max-w-4xl mx-auto space-y-4'
      }>
        {articlesWithImages.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            viewMode={viewMode}
            onClick={onArticleClick}
          />
        ))}
      </div>
    </div>
  );
}