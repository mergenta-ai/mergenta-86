import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface GiveLifeAdviceHoverCardProps {
  children: React.ReactNode;
}

const GiveLifeAdviceHoverCard: React.FC<GiveLifeAdviceHoverCardProps> = ({ children }) => {
  const [showCard, setShowCard] = useState(false);
  const [situation, setSituation] = useState('');
  const [goals, setGoals] = useState('');
  const [constraints, setConstraints] = useState('');
  const [barriers, setBarriers] = useState('');
  const [support, setSupport] = useState('');
  const [additional, setAdditional] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved values from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('lifeAdviceFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSituation(parsed.situation || '');
        setGoals(parsed.goals || '');
        setConstraints(parsed.constraints || '');
        setBarriers(parsed.barriers || '');
        setSupport(parsed.support || '');
        setAdditional(parsed.additional || '');
      } catch (error) {
        console.error('Error loading saved life advice data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const dataToSave = {
      situation,
      goals,
      constraints,
      barriers,
      support,
      additional,
    };
    localStorage.setItem('lifeAdviceFormData', JSON.stringify(dataToSave));
  }, [situation, goals, constraints, barriers, support, additional]);

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

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      {/* Full Screen Hover Area + Card */}
      {showCard && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          <div
            className="absolute left-[1052px] top-[490px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="p-4 border rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-200" style={{ backgroundColor: '#F3E8FB', borderColor: '#E5D9F2' }}>
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#E5D9F2' }}>
                  <span className="text-lg">🧭</span>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: '#5B34A0' }}>Give Life Advice</h3>
                    <p className="text-xs italic" style={{ color: '#6E6E6E' }}>
                      Personal guidance — thoughtful, empathetic and realistic.
                    </p>
                  </div>
                </div>

                {/* Your Situation Input */}
                <div className="space-y-2">
                  <Label htmlFor="situation" className="text-sm font-medium text-sidebar-text-dark">
                    Your Situation
                  </Label>
                  <Textarea
                    id="situation"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Relationship, career, health, decisions…"
                    className="text-sm min-h-[60px] resize-none bg-white"
                  />
                </div>

                {/* Goals Input */}
                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-sm font-medium text-sidebar-text-dark">
                    What do you want to achieve or resolve...
                  </Label>
                  <Input
                    id="goals"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="Personal growth, better balance, success…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Constraints Input */}
                <div className="space-y-2">
                  <Label htmlFor="constraints" className="text-sm font-medium text-sidebar-text-dark">
                    Constraints
                  </Label>
                  <Input
                    id="constraints"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="Time, resources, responsibilities…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Barriers Input */}
                <div className="space-y-2">
                  <Label htmlFor="barriers" className="text-sm font-medium text-sidebar-text-dark">
                    Barriers
                  </Label>
                  <Input
                    id="barriers"
                    value={barriers}
                    onChange={(e) => setBarriers(e.target.value)}
                    placeholder="Fears, doubts, habits, distractions…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Support Needed Input */}
                <div className="space-y-2">
                  <Label htmlFor="support" className="text-sm font-medium text-sidebar-text-dark">
                    Support Needed
                  </Label>
                  <Input
                    id="support"
                    value={support}
                    onChange={(e) => setSupport(e.target.value)}
                    placeholder="Encouragement, Confidence, Accountability, Hope, Guidance"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Additional Input */}
                <div className="space-y-2">
                  <Label htmlFor="additional" className="text-sm font-medium text-sidebar-text-dark">
                    Anything else you'd like to share?
                  </Label>
                  <Textarea
                    id="additional"
                    value={additional}
                    onChange={(e) => setAdditional(e.target.value)}
                    placeholder="Other details, context or thoughts…"
                    className="text-sm min-h-[50px] resize-none bg-white"
                  />
                </div>

                {/* Be My Life Coach Button */}
                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: '#6C3EB6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5B34A0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6C3EB6')}
                  onClick={() => console.log('Be My Life Coach clicked')}
                >
                  Be My Life Coach
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiveLifeAdviceHoverCard;