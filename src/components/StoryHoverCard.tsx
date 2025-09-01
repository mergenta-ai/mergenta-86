import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface StoryHoverCardProps {
  children: React.ReactNode;
}

const StoryHoverCard: React.FC<StoryHoverCardProps> = ({ children }) => {
  const [showCard, setShowCard] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [keyDetails, setKeyDetails] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
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

  const handleStartStory = () => {
    console.log('Start Story clicked');
    // Future implementation for story generation
  };

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCard) {
        const target = event.target as HTMLElement;
        const card = document.querySelector('[data-story-card]');
        if (card && !card.contains(target) && !target.closest('[data-story-trigger]')) {
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
        data-story-trigger
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
            data-story-card
            className="absolute left-[620px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b border-pastel-lavender-hover">
                  <span className="text-lg">📖</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Story</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Longer narrative with characters, plot and detail.
                    </p>
                  </div>
                </div>

                {/* Story Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="story-title" className="text-sm font-medium text-sidebar-text-dark">
                    Story Title
                  </Label>
                  <Input
                    id="story-title"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="Enter your story title..."
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Genre Input */}
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-sm font-medium text-sidebar-text-dark">
                    Genre
                  </Label>
                  <Input
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Fantasy, Mystery, Romance, Sci-Fi, Drama"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Key Details / Plot Points Input */}
                <div className="space-y-2">
                  <Label htmlFor="key-details" className="text-sm font-medium text-sidebar-text-dark">
                    Key Details / Plot Points
                  </Label>
                  <Textarea
                    id="key-details"
                    value={keyDetails}
                    onChange={(e) => setKeyDetails(e.target.value)}
                    placeholder="Main characters, plot points, key events..."
                    className="text-sm min-h-[70px] resize-none placeholder:text-gray-500"
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
                    placeholder="500–2000"
                    min="500"
                    max="5000"
                    className="text-sm placeholder:text-gray-500"
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
                    placeholder="Descriptive, Humorous, Passionate, Dramatic"
                    className="text-sm placeholder:text-gray-500"
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
                    placeholder="Children, Young Adults, General, Mature"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Start Story Button */}
                <Button
                  className="w-full bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white transition-colors duration-200"
                  onClick={handleStartStory}
                >
                  Start Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryHoverCard;