import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface BrainstormHoverCardProps {
  children: React.ReactNode;
}

const BrainstormHoverCard: React.FC<BrainstormHoverCardProps> = ({ children }) => {
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
            className="absolute left-[720px] top-[140px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
                    value={problemStatement}
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
                    value={constraints}
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
                    value={desiredOutcome}
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
                  onClick={() => console.log('Start Brainstorming clicked')}
                >
                  Start Brainstorming
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