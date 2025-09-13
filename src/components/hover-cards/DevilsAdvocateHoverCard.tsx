import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { supabase } from "@/integrations/supabase/client";

interface DevilsAdvocateHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const DevilsAdvocateHoverCard: React.FC<DevilsAdvocateHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const [idea, setIdea] = useState('');
  const [keyAssumptions, setKeyAssumptions] = useState('');
  const [risksWeaknesses, setRisksWeaknesses] = useState('');
  const [alternativePerspectives, setAlternativePerspectives] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved values from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('devilsAdvocateFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setIdea(parsed.idea || '');
        setKeyAssumptions(parsed.keyAssumptions || '');
        setRisksWeaknesses(parsed.risksWeaknesses || '');
        setAlternativePerspectives(parsed.alternativePerspectives || '');
      } catch (error) {
        console.error('Error loading saved devil\'s advocate data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const dataToSave = {
      idea,
      keyAssumptions,
      risksWeaknesses,
      alternativePerspectives,
    };
    localStorage.setItem('devilsAdvocateFormData', JSON.stringify(dataToSave));
  }, [idea, keyAssumptions, risksWeaknesses, alternativePerspectives]);

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

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCard) {
        const target = event.target as HTMLElement;
        const card = document.querySelector('[data-devils-advocate-card]');
        if (card && !card.contains(target) && !target.closest('[data-devils-advocate-trigger]')) {
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
        data-devils-advocate-trigger
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
            data-devils-advocate-card
            className="absolute left-[1050px] top-[320px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 border rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-200" style={{ backgroundColor: '#EDE9F7', borderColor: '#DDD1ED' }}>
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#DDD1ED' }}>
                  <span className="text-lg">⚖️</span>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: '#5B34A0' }}>Be a Devil's Advocate</h3>
                    <p className="text-xs italic" style={{ color: '#6E6E6E' }}>
                      Challenge assumptions — counterpoints and tough questions.
                    </p>
                  </div>
                </div>

                {/* Idea Input */}
                <div className="space-y-2">
                  <Label htmlFor="idea" className="text-sm font-medium" style={{ color: '#6E6E6E' }}>
                    Idea
                  </Label>
                  <Textarea
                    id="idea"
                    value={idea || undefined}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Enter idea, plan or decision to be tested…"
                    className="text-sm min-h-[70px] resize-none bg-white"
                  />
                </div>

                {/* Key Assumptions Input */}
                <div className="space-y-2">
                  <Label htmlFor="key-assumptions" className="text-sm font-medium" style={{ color: '#6E6E6E' }}>
                    Key Assumptions
                  </Label>
                  <Input
                    id="key-assumptions"
                    value={keyAssumptions || undefined}
                    onChange={(e) => setKeyAssumptions(e.target.value)}
                    placeholder="Beliefs to challenge…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Risks / Weaknesses Input */}
                <div className="space-y-2">
                  <Label htmlFor="risks-weaknesses" className="text-sm font-medium" style={{ color: '#6E6E6E' }}>
                    Risks / Weaknesses
                  </Label>
                  <Input
                    id="risks-weaknesses"
                    value={risksWeaknesses || undefined}
                    onChange={(e) => setRisksWeaknesses(e.target.value)}
                    placeholder="Potential flaws, oversights, vulnerabilities…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Alternative Perspectives Input */}
                <div className="space-y-2">
                  <Label htmlFor="alternative-perspectives" className="text-sm font-medium" style={{ color: '#6E6E6E' }}>
                    Alternative Perspectives
                  </Label>
                  <Input
                    id="alternative-perspectives"
                    value={alternativePerspectives || undefined}
                    onChange={(e) => setAlternativePerspectives(e.target.value)}
                    placeholder="Different viewpoints, counter arguments…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Play Devil's Advocate Button */}
                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: '#6C3EB6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5B34A0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6C3EB6')}
                  onClick={async () => {
                    try {
                      const { data, error } = await supabase.functions.invoke('prompt-engine-strategic', {
                        body: { 
                          contentType: 'devils_advocate', 
                          formData: { idea, keyAssumptions, risksWeaknesses, alternativePerspectives } 
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
                  }}
                >
                  Play Devil's Advocate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevilsAdvocateHoverCard;