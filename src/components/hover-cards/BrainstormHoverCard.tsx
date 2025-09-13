import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { supabase } from "@/integrations/supabase/client";

interface BrainstormHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const BrainstormHoverCard: React.FC<BrainstormHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const [problemStatement, setProblemStatement] = useState('');
  const [constraints, setConstraints] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved values from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('brainstormFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setProblemStatement(parsed.problemStatement || '');
        setConstraints(parsed.constraints || '');
        setDesiredOutcome(parsed.desiredOutcome || '');
      } catch (error) {
        console.error('Error loading saved brainstorm data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const dataToSave = {
      problemStatement,
      constraints,
      desiredOutcome,
    };
    localStorage.setItem('brainstormFormData', JSON.stringify(dataToSave));
  }, [problemStatement, constraints, desiredOutcome]);

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('prompt-engine-strategic', {
        body: { 
          contentType: 'brainstorm', 
          formData: { 
            idea: problemStatement, 
            keyAssumptions: constraints, 
            risksWeaknesses: desiredOutcome, 
            alternativePerspectives: '' 
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
        const card = document.querySelector('[data-brainstorm-card]');
        if (card && !card.contains(target) && !target.closest('[data-brainstorm-trigger]')) {
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
        data-brainstorm-trigger
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
            data-brainstorm-card
            className="absolute left-[1052px] top-[490px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 border rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200" style={{ backgroundColor: '#F1E4FA', borderColor: '#E5D9F2' }}>
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#E5D9F2' }}>
                  <span className="text-lg">💡</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Brainstorm with me</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Generate fresh ideas fast — creative, bold and varied.
                    </p>
                  </div>
                </div>

                {/* Problem Statement Input */}
                <div className="space-y-2">
                  <Label htmlFor="problem-statement" className="text-sm font-medium text-sidebar-text-dark">
                    Problem Statement
                  </Label>
                  <Textarea
                    id="problem-statement"
                    value={problemStatement || undefined}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Enter topic, challenge or idea…"
                    className="text-sm min-h-[70px] resize-none bg-white"
                  />
                </div>

                {/* Constraints Input */}
                <div className="space-y-2">
                  <Label htmlFor="constraints" className="text-sm font-medium text-sidebar-text-dark">
                    Constraints
                  </Label>
                  <Input
                    id="constraints"
                    value={constraints || undefined}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="Budget, time limit, resources etc."
                    className="text-sm bg-white"
                  />
                </div>

                {/* Desired Outcome Input */}
                <div className="space-y-2">
                  <Label htmlFor="desired-outcome" className="text-sm font-medium text-sidebar-text-dark">
                    Desired Outcome
                  </Label>
                  <Input
                    id="desired-outcome"
                    value={desiredOutcome || undefined}
                    onChange={(e) => setDesiredOutcome(e.target.value)}
                    placeholder="Innovation, efficiency, alternatives etc."
                    className="text-sm bg-white"
                  />
                </div>

                {/* Start Brainstorming Button */}
                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: '#7D4EFF' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6A3DD4')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7D4EFF')}
                  onClick={handleGeneratePrompt}
                >
                  Generate Prompt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainstormHoverCard;