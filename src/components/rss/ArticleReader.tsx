import React, { useState } from 'react';
import { Calendar, Clock, ExternalLink, Share2, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RSSFeedItem, RSSService } from '@/services/rssService';
import { toast } from 'sonner';

interface ArticleReaderProps {
  article: RSSFeedItem;
  onBack: () => void;
}

export function ArticleReader({ article }: ArticleReaderProps) {
  const categoryIcon = RSSService.getCategoryIcon(article.category);
  const timeAgo = RSSService.formatTimeAgo(article.published_at);
  const readingTime = Math.ceil(article.content.split(' ').length / 200);
  const [imageError, setImageError] = useState(false);

  const handleOpenOriginal = () => {
    window.open(article.url, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article.url);
    toast.success('Article URL copied to clipboard!');
  };

  // Format content with basic paragraph breaks
  const formattedContent = article.content
    .split('\n')
    .filter(paragraph => paragraph.trim().length > 0)
    .map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph.trim()}
      </p>
    ));

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Hero Image */}
        {article.image_url && !imageError && (
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8 bg-muted">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        {!article.image_url || imageError ? (
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8 bg-muted flex items-center justify-center">
            <Newspaper className="h-24 w-24 text-muted-foreground" />
          </div>
        ) : null}
        
        <Card className="mb-8">
          <CardHeader className="space-y-4">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-lg">{categoryIcon}</span>
                <Badge variant="secondary">{article.category}</Badge>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </div>
              
              <span className="font-medium text-primary">{article.source_name}</span>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">
              {article.title}
            </h1>

            {/* Article Summary */}
            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 bg-primary/5 p-4 rounded-r-lg">
              {article.summary}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleOpenOriginal} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Read Original
              </Button>
              
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none text-foreground">
              <div className="text-base leading-relaxed">
                {formattedContent}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Originally published by <strong>{article.source_name}</strong> on{' '}
            {new Date(article.published_at).toLocaleDateString()}
          </p>
          <Button variant="outline" onClick={handleOpenOriginal} className="flex items-center gap-2 mx-auto">
            <ExternalLink className="h-4 w-4" />
            View Original Article
          </Button>
        </div>
      </div>
    </div>
  );
}