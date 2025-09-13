import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";

interface MentorHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const MentorHoverCard: React.FC<MentorHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const [mentorshipDomain, setMentorshipDomain] = useState('');
  const [currentStage, setCurrentStage] = useState('');
  const [challenges, setChallenges] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved values from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('mentorFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setMentorshipDomain(parsed.mentorshipDomain || '');
        setCurrentStage(parsed.currentStage || '');
        setChallenges(parsed.challenges || '');
        setDesiredOutcome(parsed.desiredOutcome || '');
        setPreferredStyle(parsed.preferredStyle || '');
      } catch (error) {
        console.error('Error loading saved mentor data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const dataToSave = {
      mentorshipDomain,
      currentStage,
      challenges,
      desiredOutcome,
      preferredStyle,
    };
    localStorage.setItem('mentorFormData', JSON.stringify(dataToSave));
  }, [mentorshipDomain, currentStage, challenges, desiredOutcome, preferredStyle]);

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
    '[data-mentor-card]',
    '[data-mentor-trigger]'
  );

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div 
        data-mentor-trigger
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
            data-mentor-card
            className="absolute left-[1050px] top-[275px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 border rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-200" style={{ backgroundColor: '#F0E6FA', borderColor: '#E4D1F0' }}>
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#E4D1F0' }}>
                  <span className="text-lg">🎯</span>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: '#5B34A0' }}>Think like a Mentor</h3>
                    <p className="text-xs italic" style={{ color: '#6E6E6E' }}>
                      Get wise guidance tailored to your goals and challenges.
                    </p>
                  </div>
                </div>

                {/* Mentorship Domain Input */}
                <div className="space-y-2">
                  <Label htmlFor="mentorship-domain" className="text-sm font-medium" style={{ color: '#6E6E6E' }}>
                    Mentorship Domain
                  </Label>
                  <Input
                    id="mentorship-domain"
                    value={mentorshipDomain || undefined}
                    onChange={(e) => setMentorshipDomain(e.target.value)}
                    placeholder="Career, entrepreneurship, leadership, personal growth…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Current Stage Input */}
                <div className="space-y-2">
                  <Label htmlFor="current-stage" className="text-sm font-medium" style={{ color: '#6E6E6E' }}>
                    Your Current Stage
                  </Label>
                  <Input
                    id="current-stage"
                    value={currentStage || undefined}
                    onChange={(e) => setCurrentStage(e.target.value)}
                    placeholder="Beginner, intermediate, advanced…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Challenges Input */}
                <div className="space-y-2">
                  <Label htmlFor="challenges" className="text-sm font-medium" style={{ color: '#6E6E6E' }}>
                    Challenges / Obstacles
                  </Label>
                  <Input
                    id="challenges"
                    value={challenges || undefined}
                    onChange={(e) => setChallenges(e.target.value)}
                    placeholder="Confidence, skills, direction…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Desired Outcome Input */}
                <div className="space-y-2">
                  <Label htmlFor="desired-outcome" className="text-sm font-medium" style={{ color: '#6E6E6E' }}>
                    Desired Outcome
                  </Label>
                  <Input
                    id="desired-outcome"
                    value={desiredOutcome || undefined}
                    onChange={(e) => setDesiredOutcome(e.target.value)}
                    placeholder="Decision-making, clarity, confidence…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Preferred Style Input */}
                <div className="space-y-2">
                  <Label htmlFor="preferred-style" className="text-sm font-medium" style={{ color: '#6E6E6E' }}>
                    Preferred Style
                  </Label>
                  <Input
                    id="preferred-style"
                    value={preferredStyle || undefined}
                    onChange={(e) => setPreferredStyle(e.target.value)}
                    placeholder="Encouraging, tough-love, structured…"
                    className="text-sm bg-white"
                  />
                </div>

                {/* Start Mentoring Button */}
                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: '#6C3EB6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5B34A0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6C3EB6')}
                  onClick={async () => {
                    try {
                      const { data, error } = await supabase.functions.invoke('prompt-engine-strategic', {
                        body: { 
                          contentType: 'mentor', 
                          formData: { mentorshipDomain, currentStage, challenges, desiredOutcome, preferredStyle } 
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
                  Start Mentoring
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorHoverCard;