import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface SpeechHoverCardProps {
  children: React.ReactNode;
}

const SpeechHoverCard: React.FC<SpeechHoverCardProps> = ({ children }) => {
  const [showCard, setShowCard] = useState(false);
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const [languageStyle, setLanguageStyle] = useState('');
  const [engagementTechniques, setEngagementTechniques] = useState('');
  const [duration, setDuration] = useState('');
  const [impact, setImpact] = useState('');
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
    e.stopPropagation();
  };

  const handleStartSpeech = () => {
    console.log('Start Speech clicked');
    // Future implementation for speech generation
  };

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCard) {
        const target = event.target as HTMLElement;
        const card = document.querySelector('[data-speech-card]');
        if (card && !card.contains(target) && !target.closest('[data-speech-trigger]')) {
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
        data-speech-trigger
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
            data-speech-card
            className="absolute left-[620px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b border-pastel-lavender-hover">
                  <span className="text-lg">🎤</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Speech</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Inspiring words crafted for audience and impact.
                    </p>
                  </div>
                </div>

                {/* Theme Input */}
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm font-medium text-sidebar-text-dark">
                    Theme
                  </Label>
                  <Input
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Write your central idea..."
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
                    placeholder="Formal, Motivational, Persuasive, Humorous, Solemn"
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
                    placeholder="Students, Professionals, Teachers, Public, Leaders"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Language Style Input */}
                <div className="space-y-2">
                  <Label htmlFor="language-style" className="text-sm font-medium text-sidebar-text-dark">
                    Language Style
                  </Label>
                  <Input
                    id="language-style"
                    value={languageStyle}
                    onChange={(e) => setLanguageStyle(e.target.value)}
                    placeholder="Simple, Poetic, Technical, Rhetorical"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Engagement Techniques Input */}
                <div className="space-y-2">
                  <Label htmlFor="engagement-techniques" className="text-sm font-medium text-sidebar-text-dark">
                    Engagement Techniques
                  </Label>
                  <Input
                    id="engagement-techniques"
                    value={engagementTechniques}
                    onChange={(e) => setEngagementTechniques(e.target.value)}
                    placeholder="Stories, Questions, Humour, Quotes, couplets"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Duration Input */}
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium text-sidebar-text-dark">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Mention minutes or hours..."
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Impact Input */}
                <div className="space-y-2">
                  <Label htmlFor="impact" className="text-sm font-medium text-sidebar-text-dark">
                    Impact
                  </Label>
                  <Input
                    id="impact"
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    placeholder="Memorable, Inspirational, Actionable, Thought-provoking"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Start Speech Button */}
                <Button
                  className="w-full bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white transition-colors duration-200"
                  onClick={handleStartSpeech}
                >
                  Start Speech
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechHoverCard;