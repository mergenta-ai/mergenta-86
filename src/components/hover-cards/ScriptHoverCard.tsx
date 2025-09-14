import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";

interface ScriptHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const ScriptHoverCard: React.FC<ScriptHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const [scriptTitle, setScriptTitle] = useState('');
  const [keyDetails, setKeyDetails] = useState('');
  const [structure, setStructure] = useState('');
  const [theme, setTheme] = useState('');
  const [mood, setMood] = useState('');
  const [format, setFormat] = useState('');
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
    // Prevent the card from closing when clicking inside
    e.stopPropagation();
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('prompt-engine-creative', {
        body: { 
          contentType: 'script', 
          formData: { 
            scriptTitle, 
            keyDetails, 
            structure, 
            theme, 
            mood, 
            format, 
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
  useClickOutside(
    showCard,
    () => setShowCard(false),
    '[data-script-card]',
    '[data-script-trigger]'
  );

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div 
        data-script-trigger
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
            data-script-card
            className="absolute left-[620px] top-[140px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b border-pastel-lavender-hover">
                  <span className="text-lg">🎬</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Script</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Dialogue-driven format for plays, films or skits.
                    </p>
                  </div>
                </div>

                {/* Script Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="script-title" className="text-sm font-medium text-sidebar-text-dark">
                    Script Title
                  </Label>
                   <Input
                     id="script-title"
                     value={scriptTitle}
                     onChange={(e) => setScriptTitle(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="Enter your script title..."
                     className="text-sm placeholder-gray-400"
                     autoComplete="off"
                   />
                </div>

                {/* Key Details Input */}
                <div className="space-y-2">
                  <Label htmlFor="key-details" className="text-sm font-medium text-sidebar-text-dark">
                    Key Details / Plot Points
                  </Label>
                   <Textarea
                     id="key-details"
                     value={keyDetails}
                     onChange={(e) => setKeyDetails(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="Main characters, scenes, key movements..."
                     className="text-sm min-h-[70px] resize-none placeholder-gray-400"
                     autoComplete="off"
                   />
                </div>

                {/* Structure Input */}
                <div className="space-y-2">
                  <Label htmlFor="structure" className="text-sm font-medium text-sidebar-text-dark">
                    Structure
                  </Label>
                   <Input
                     id="structure"
                     value={structure}
                     onChange={(e) => setStructure(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                     placeholder="Long, Medium, Short, Micro"
                     className="text-sm placeholder-gray-400"
                     autoComplete="off"
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
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Identity, Revenge, Power, Love, etc."
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
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
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Romantic, Eerie, Dark, Light, Suspense"
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Format Input */}
                <div className="space-y-2">
                  <Label htmlFor="format" className="text-sm font-medium text-sidebar-text-dark">
                    Format
                  </Label>
                  <Input
                    id="format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Screenplay, Radio, TV, Web Series"
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
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
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Children, Teens, Young Adults, Mature"
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Start Button */}
                <Button 
                  onClick={handleGeneratePrompt}
                  className="w-full mt-4 bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white font-medium"
                >
                  Start Script
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptHoverCard;