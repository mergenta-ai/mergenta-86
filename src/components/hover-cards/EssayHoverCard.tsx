import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { supabase } from "@/integrations/supabase/client";

interface EssayHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const EssayHoverCard: React.FC<EssayHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const [essayTitle, setEssayTitle] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved values from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('essayFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setEssayTitle(parsed.essayTitle || '');
        setKeyPoints(parsed.keyPoints || '');
        setWordCount(parsed.wordCount || '');
        setTone(parsed.tone || '');
        setAudience(parsed.audience || '');
      } catch (error) {
        console.error('Error loading saved essay data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const dataToSave = {
      essayTitle,
      keyPoints,
      wordCount,
      tone,
      audience,
    };
    localStorage.setItem('essayFormData', JSON.stringify(dataToSave));
  }, [essayTitle, keyPoints, wordCount, tone, audience]);

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
      const { data, error } = await supabase.functions.invoke('prompt-engine', {
        body: { 
          contentType: 'essay', 
          formData: { 
            essayTitle, 
            keyPoints, 
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
        const card = document.querySelector('[data-essay-card]');
        const trigger = document.querySelector('[data-essay-trigger]');
        
        // Don't close if clicking on card or trigger
        if (card && !card.contains(target) && 
            trigger && !trigger.contains(target)) {
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
        data-essay-trigger
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
            data-essay-card
            className="absolute left-[620px] top-[140px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b border-pastel-lavender-hover">
                  <span className="text-lg">📄</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Essay</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Structured, formal writing — balanced arguments and clarity.
                    </p>
                  </div>
                </div>

                {/* Essay Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="essay-title" className="text-sm font-medium text-sidebar-text-dark">
                    Essay Title
                  </Label>
                  <Input
                    id="essay-title"
                    value={essayTitle}
                    onChange={(e) => setEssayTitle(e.target.value)}
                    placeholder="Enter your essay title..."
                    className="text-sm"
                  />
                </div>

                {/* Key Points Input */}
                <div className="space-y-2">
                  <Label htmlFor="key-points" className="text-sm font-medium text-sidebar-text-dark">
                    Key Points / Topics
                  </Label>
                  <Textarea
                    id="key-points"
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                    placeholder="List your main points or topics..."
                    className="text-sm min-h-[70px] resize-none"
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
                    placeholder="400–2000"
                    min="400"
                    max="2000"
                    className="text-sm"
                  />
                </div>

                {/* Tone Input */}
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-sm font-medium text-sidebar-text-dark">Tone</Label>
                  <Textarea
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    placeholder="formal, analytical, neutral, critical, narrative, persuasive, imaginative, humorous, motivating, empathitic, optimistic. etc..."
                    className="text-sm min-h-[60px] resize-none"
                  />
                </div>

                {/* Audience Input */}
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-sm font-medium text-sidebar-text-dark">Audience</Label>
                  <Textarea
                    id="audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="academic, business, professional, technical, media, government, community, American, European, Australian, Asian, African, Chinese, Indian, etc..."
                    className="text-sm min-h-[60px] resize-none"
                  />
                </div>

                {/* Start Essay Button */}
                <Button
                  className="w-full bg-[#6F42C1] hover:bg-[#5A359A] text-white transition-colors duration-200"
                  onClick={handleGeneratePrompt}
                >
                  Start Essay
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayHoverCard;
