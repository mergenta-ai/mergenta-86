import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";

interface BlogHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const BlogHoverCard: React.FC<BlogHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [voice, setVoice] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // No localStorage - fields always start empty to show watermark placeholders

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowCard(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowCard(false);
    }, 250);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent the card from closing when clicking inside
    e.stopPropagation();
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('prompt-engine-creative', {
        body: { 
          contentType: 'blog', 
          formData: { 
            blogTitle, 
            keywords, 
            wordCount, 
            tone, 
            audience 
          } 
        }
      });

      if (error) throw error;
      
      if (data?.success && data?.prompt) {
        onPromptGenerated?.(data.prompt);
        setShowCard(false);
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
    }
  };

  // Close card when clicking outside
  useClickOutside(
    showCard,
    () => setShowCard(false),
    '[data-blog-card]',
    '[data-blog-trigger]'
  );

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div 
        data-blog-trigger
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowCard(!showCard)}
      >
        {children}
      </div>

      {/* Full Screen Hover Area + Card */}
      {showCard && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          <div
            data-blog-card
            className="absolute left-[620px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b border-pastel-lavender-hover">
                  <span className="text-lg">📝</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Blog</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Conversational, engaging style for online readers — clear, SEO-friendly and reader-focused.
                    </p>
                  </div>
                </div>

                {/* Blog Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="blog-title" className="text-sm font-medium text-sidebar-text-dark">
                    Blog Title
                  </Label>
                   <Input
                     id="blog-title"
                     value={blogTitle}
                     onChange={(e) => setBlogTitle(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="Enter your blog title..."
                     className="text-sm placeholder:text-gray-500"
                     autoComplete="off"
                   />
                </div>

                {/* Keywords Input */}
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-sm font-medium text-sidebar-text-dark">
                    Keywords
                  </Label>
                   <Input
                     id="keywords"
                     value={keywords}
                     onChange={(e) => setKeywords(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="Add key phrases or focus keywords..."
                     className="text-sm placeholder:text-gray-500"
                     autoComplete="off"
                   />
                </div>

                {/* Word Count Input */}
                <div className="space-y-2">
                  <Label htmlFor="word-count" className="text-sm font-medium text-sidebar-text-dark">
                    Word Count
                  </Label>
                   <Input
                     id="word-count"
                     type="number"
                     value={wordCount}
                     onChange={(e) => setWordCount(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="600–2000 words"
                     min="600"
                     max="2000"
                     className="text-sm placeholder:text-gray-500"
                     autoComplete="off"
                   />
                </div>

                {/* Voice Input */}
                <div className="space-y-2">
                  <Label htmlFor="voice" className="text-sm font-medium text-sidebar-text-dark">
                    Voice
                  </Label>
                   <Input
                     id="voice"
                     value={voice}
                     onChange={(e) => setVoice(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="Informative, Conversational, Persuasive, Storytelling"
                     className="text-sm placeholder:text-gray-500"
                     autoComplete="off"
                   />
                </div>

                {/* Tone Input */}
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-sm font-medium text-sidebar-text-dark">
                    Tone
                  </Label>
                   <Input
                     id="tone"
                     value={tone}
                     onChange={(e) => setTone(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="Friendly, Formal, Expert, Humorous"
                     className="text-sm placeholder:text-gray-500"
                     autoComplete="off"
                   />
                </div>

                {/* Audience Input */}
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-sm font-medium text-sidebar-text-dark">
                    Audience
                  </Label>
                   <Input
                     id="audience"
                     value={audience}
                     onChange={(e) => setAudience(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="Professionals, Students, General Readers, Academia"
                     className="text-sm placeholder:text-gray-500"
                     autoComplete="off"
                   />
                </div>

                {/* Primary Keywords for SEO Input */}
                <div className="space-y-2">
                  <Label htmlFor="seo-keywords" className="text-sm font-medium text-sidebar-text-dark">
                    Primary Keywords for SEO
                  </Label>
                   <Input
                     id="seo-keywords"
                     value={seoKeywords}
                     onChange={(e) => setSeoKeywords(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="Add your SEO keywords..."
                     className="text-sm placeholder:text-gray-500"
                     autoComplete="off"
                   />
                </div>

                {/* Start Blog Button */}
                <Button
                  className="w-full bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white transition-colors duration-200"
                  onClick={handleGeneratePrompt}
                >
                  Publish Blog
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogHoverCard;