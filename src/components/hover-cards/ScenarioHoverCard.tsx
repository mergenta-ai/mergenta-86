import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";

interface ScenarioHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const ScenarioHoverCard: React.FC<ScenarioHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const [centralChallenge, setCentralChallenge] = useState('');
  const [keyVariables, setKeyVariables] = useState('');
  const [possibleOutcomes, setPossibleOutcomes] = useState('');
  const [focus, setFocus] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('');
  const [desiredResponse, setDesiredResponse] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved values from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('scenarioFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCentralChallenge(parsed.centralChallenge || '');
        setKeyVariables(parsed.keyVariables || '');
        setPossibleOutcomes(parsed.possibleOutcomes || '');
        setFocus(parsed.focus || '');
        setTimeHorizon(parsed.timeHorizon || '');
        setDesiredResponse(parsed.desiredResponse || '');
      } catch (error) {
        console.error('Error loading saved scenario data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const dataToSave = {
      centralChallenge,
      keyVariables,
      possibleOutcomes,
      focus,
      timeHorizon,
      desiredResponse,
    };
    localStorage.setItem('scenarioFormData', JSON.stringify(dataToSave));
  }, [centralChallenge, keyVariables, possibleOutcomes, focus, timeHorizon, desiredResponse]);

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
  useClickOutside(
    showCard,
    () => setShowCard(false),
    '[data-scenario-card]',
    '[data-scenario-trigger]'
  );

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div 
        data-scenario-trigger
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
            data-scenario-card
            className="absolute left-[1050px] top-[150px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 border rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-200" style={{ backgroundColor: '#E9D7F7', borderColor: '#DCC7EF' }}>
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#DCC7EF' }}>
                  <span className="text-lg">📋</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Scenario Planning</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Anticipate futures — map risks, opportunities and strategies.
                    </p>
                  </div>
                </div>

                {/* Central Challenge Input */}
                <div className="space-y-2">
                  <Label htmlFor="central-challenge" className="text-sm font-medium text-sidebar-text-dark">
                    Central Challenge
                  </Label>
                  <Textarea
                    id="central-challenge"
                    value={centralChallenge || undefined}
                    onChange={(e) => setCentralChallenge(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter the core issue or question…"
                    className="text-sm min-h-[60px] resize-none bg-white"
                  />
                </div>

                {/* Key Variables Input */}
                <div className="space-y-2">
                  <Label htmlFor="key-variables" className="text-sm font-medium text-sidebar-text-dark">
                    Key Variables / Factors
                  </Label>
                  <Input
                    id="key-variables"
                    value={keyVariables || undefined}
                    onChange={(e) => setKeyVariables(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Political, economic, social, technological etc."
                    className="text-sm bg-white"
                  />
                </div>

                {/* Possible Outcomes Input */}
                <div className="space-y-2">
                  <Label htmlFor="possible-outcomes" className="text-sm font-medium text-sidebar-text-dark">
                    Possible Outcomes
                  </Label>
                  <Input
                    id="possible-outcomes"
                    value={possibleOutcomes || undefined}
                    onChange={(e) => setPossibleOutcomes(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Best case, worst case, alternatives..."
                    className="text-sm bg-white"
                  />
                </div>

                {/* Focus Input */}
                <div className="space-y-2">
                  <Label htmlFor="focus" className="text-sm font-medium text-sidebar-text-dark">
                    Focus
                  </Label>
                  <Input
                    id="focus"
                    value={focus || undefined}
                    onChange={(e) => setFocus(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Risks, Benefits, Trade-offs, Outcomes.."
                    className="text-sm bg-white"
                  />
                </div>

                {/* Time Horizon Input */}
                <div className="space-y-2">
                  <Label htmlFor="time-horizon" className="text-sm font-medium text-sidebar-text-dark">
                    Time Horizon
                  </Label>
                  <Input
                    id="time-horizon"
                    value={timeHorizon || undefined}
                    onChange={(e) => setTimeHorizon(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Months, years, decades"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Desired Response Input */}
                <div className="space-y-2">
                  <Label htmlFor="desired-response" className="text-sm font-medium text-sidebar-text-dark">
                    Desired Response
                  </Label>
                  <Input
                    id="desired-response"
                    value={desiredResponse || undefined}
                    onChange={(e) => setDesiredResponse(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Strategies, policies, actions to test..."
                    className="text-sm bg-white"
                  />
                </div>

                {/* Start Planning Button */}
                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: '#6C3EB6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5A2F9A')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6C3EB6')}
                  onClick={async () => {
                    try {
                      const { data, error } = await supabase.functions.invoke('prompt-engine-strategic', {
                        body: { 
                          contentType: 'scenario_planning', 
                          formData: { 
                            centralChallenge, 
                            keyVariables, 
                            possibleOutcomes, 
                            focus, 
                            timeHorizon, 
                            desiredResponse 
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
                  }}
                >
                  Start Planning
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioHoverCard;