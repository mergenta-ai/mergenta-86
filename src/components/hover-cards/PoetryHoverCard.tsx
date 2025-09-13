import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { supabase } from '@/integrations/supabase/client';

interface PoetryHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const PoetryHoverCard: React.FC<PoetryHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [form, setForm] = useState('');
  const [mood, setMood] = useState('');
  const [numberOfLines, setNumberOfLines] = useState('');
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
    e.stopPropagation();
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('prompt-engine-creative', {
        body: { 
          contentType: 'poetry', 
          formData: { 
            title,
            theme, 
            form, 
            mood, 
            numberOfLines, 
            audience 
          } 
        }
      });

      if (error) throw error;

      if (data?.prompt && onPromptGenerated) {
        onPromptGenerated(data.prompt);
        setShowCard(false);
      }
    } catch (error) {
      console.error('Error generating poetry prompt:', error);
    }
  };

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCard) {
        const target = event.target as HTMLElement;
        const card = document.querySelector('[data-poetry-card]');
        if (card && !card.contains(target) && !target.closest('[data-poetry-trigger]')) {
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
        data-poetry-trigger
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
            data-poetry-card
            className="absolute left-[620px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b border-pastel-lavender-hover">
                  <span className="text-lg">🎭</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Poetry</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Expressive verse that captures emotions, imagery and meaning through rhythm and language.
                    </p>
                  </div>
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-sidebar-text-dark">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your poem title..."
                    className="text-sm placeholder:text-gray-500"
                  />
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
                    placeholder="Love, Nature, Time, Identity, Mystery"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Form Input */}
                <div className="space-y-2">
                  <Label htmlFor="form" className="text-sm font-medium text-sidebar-text-dark">
                    Form
                  </Label>
                  <Input
                    id="form"
                    value={form}
                    onChange={(e) => setForm(e.target.value)}
                    placeholder="Sonnet, Chhand, Haiku, Ghazal, Ode etc."
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Mood Input */}
                <div className="space-y-2">
                  <Label htmlFor="mood" className="text-sm font-medium text-sidebar-text-dark">
                    Mood
                  </Label>
                  <Input
                    id="mood"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="Serious, Playful, Ironic, Philosophical etc."
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Number of Lines Input */}
                <div className="space-y-2">
                  <Label htmlFor="number-of-lines" className="text-sm font-medium text-sidebar-text-dark">
                    Number of Lines
                  </Label>
                  <Input
                    id="number-of-lines"
                    type="number"
                    value={numberOfLines}
                    onChange={(e) => setNumberOfLines(e.target.value)}
                    placeholder="Enter number of lines..."
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
                    placeholder="Children, Youth, Adults, Mature"
                    className="text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Start Poetry Button */}
                <Button
                  className="w-full bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white transition-colors duration-200"
                  onClick={handleGeneratePrompt}
                >
                  Start Poetry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoetryHoverCard;