import React, { useState } from 'react';
import { Calendar, Clock, ExternalLink, Newspaper } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { RSSFeedItem, RSSService } from '@/services/rssService';

interface ArticleCardProps {
  article: RSSFeedItem;
  viewMode: 'grid' | 'list';
  onClick: (article: RSSFeedItem) => void;
}

export function ArticleCard({ article, viewMode, onClick }: ArticleCardProps) {
  const categoryIcon = RSSService.getCategoryIcon(article.category);
  const timeAgo = RSSService.formatTimeAgo(article.published_at);
  const [imageError, setImageError] = useState(false);
  
  if (viewMode === 'list') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50 mb-4"
        onClick={() => onClick(article)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {article.image_url && !imageError ? (
              <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-muted">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <Newspaper className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{categoryIcon}</span>
                <Badge variant="secondary" className="text-xs">
                  {article.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {article.source_name}
                </span>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary">
                {article.title}
              </h3>
              
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {article.summary}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {timeAgo}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.ceil(article.content.split(' ').length / 200)} min read
                </div>
              </div>
            </div>
            
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 hover:-translate-y-1 h-full flex flex-col"
      onClick={() => onClick(article)}
    >
      <AspectRatio ratio={9/16} className="bg-muted rounded-t-lg overflow-hidden">
        {article.image_url && !imageError ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </AspectRatio>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryIcon}</span>
            <Badge variant="secondary" className="text-xs">
              {article.category}
            </Badge>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <CardTitle className="text-lg line-clamp-3 hover:text-primary">
          {article.title}
        </CardTitle>
        
        <CardDescription className="text-xs text-muted-foreground">
          {article.source_name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {timeAgo}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {Math.ceil(article.content.split(' ').length / 200)} min
          </div>
        </div>
      </CardContent>
    </Card>
  );
}