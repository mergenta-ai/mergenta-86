import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { supabase } from "@/integrations/supabase/client";

interface FlashFictionHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const FlashFictionHoverCard: React.FC<FlashFictionHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [keyDetails, setKeyDetails] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      const { data, error } = await supabase.functions.invoke('prompt-engine', {
        body: { 
          contentType: 'flash_fiction', 
          formData: { 
            storyTitle, 
            genre, 
            keyDetails, 
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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCard) {
        const target = event.target as HTMLElement;
        const card = document.querySelector('[data-flash-fiction-card]');
        if (card && !card.contains(target) && !target.closest('[data-flash-fiction-trigger]')) {
          setShowCard(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCard]);

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div 
        data-flash-fiction-trigger
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
            data-flash-fiction-card
            className="absolute left-[620px] top-[140px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b border-pastel-lavender-hover">
                  <span className="text-lg">⚡</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Flash Fiction</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Concise storytelling — impact in a few words.
                    </p>
                  </div>
                </div>

                {/* Story Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="flash-fiction-title" className="text-sm font-medium text-sidebar-text-dark">
                    Story Title
                  </Label>
                  <Input
                    id="flash-fiction-title"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="Enter your story title..."
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Genre Input */}
                <div className="space-y-2">
                  <Label htmlFor="flash-fiction-genre" className="text-sm font-medium text-sidebar-text-dark">
                    Genre
                  </Label>
                  <Input
                    id="flash-fiction-genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Realist, Gothic, Satire, Romance, Surreal"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Key Details / Plot Points Input */}
                <div className="space-y-2">
                  <Label htmlFor="flash-fiction-key-details" className="text-sm font-medium text-sidebar-text-dark">
                    Key Details / Plot Points
                  </Label>
                  <Textarea
                    id="flash-fiction-key-details"
                    value={keyDetails}
                    onChange={(e) => setKeyDetails(e.target.value)}
                    placeholder="Main characters, twist, key moments..."
                    className="text-sm min-h-[70px] resize-none placeholder:text-gray-500"
                  />
                </div>

                {/* Word Count Input */}
                <div className="space-y-2">
                  <Label htmlFor="flash-fiction-word-count" className="text-sm font-medium text-sidebar-text-dark">
                    Word Count
                  </Label>
                  <Input
                    id="flash-fiction-word-count"
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    placeholder="100–500"
                    min="100"
                    max="500"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Tone Input */}
                <div className="space-y-2">
                  <Label htmlFor="flash-fiction-tone" className="text-sm font-medium text-sidebar-text-dark">
                    Tone
                  </Label>
                  <Input
                    id="flash-fiction-tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    placeholder="Sharp, Witty, Emotional, Reflective"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Audience Input */}
                <div className="space-y-2">
                  <Label htmlFor="flash-fiction-audience" className="text-sm font-medium text-sidebar-text-dark">
                    Audience
                  </Label>
                  <Input
                    id="flash-fiction-audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Commuter, Youth, Scroller, Creator, Fan"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Start Flash Fiction Button */}
                <Button
                  className="w-full bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white transition-colors duration-200"
                  onClick={handleGeneratePrompt}
                >
                  Start Flash Fiction
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashFictionHoverCard;