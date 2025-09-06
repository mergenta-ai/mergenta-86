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
            className="absolute left-[1052px] top-[220px] w-80 pointer-events-auto"
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

                {/* Date Input */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-sidebar-text-dark">
                    Date of birth
                  </Label>
                  <Textarea
                    id="date"
                    value={date || undefined}
                    onChange={(e) => setdateofbirth(e.target.value)}
                    placeholder="Enter your date of birth"
                    className="text-sm min-h-[60px] resize-none bg-white"
                  />
                </div>

                {/* Year Input */}
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium text-sidebar-text-dark">
                    Year of birth
                  </Label>
                  <Input
                    id="year"
                    value={year || undefined}
                    onChange={(e) => setyearofbirth(e.target.value)}
                    placeholder="Enter your year of birth"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Place Input */}
                <div className="space-y-2">
                  <Label htmlFor="place" className="text-sm font-medium text-sidebar-text-dark">
                    Place of birth
                  </Label>
                  <Input
                    id="place"
                    value={place || undefined}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="Enter your place of birth"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Specific Input */}
                <div className="space-y-2">
                  <Label htmlFor="specific" className="text-sm font-medium text-sidebar-text-dark">
                    Specific information you seek
                  </Label>
                  <Textarea
                    id="specific"
                    value={specific || undefined}
                    onChange={(e) => setSpecific(e.target.value)}
                    placeholder="Describe what you want to know in particular"
                    className="text-sm min-h-[50px] resize-none bg-white"
                  />
                </div>

                {/* Give Your Prediction */}
                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: '#6C3EB6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5B34A0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6C3EB6')}
                  onClick={() => console.log('Be My Life Coach clicked')}
                >
                  Give Your Prediction
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