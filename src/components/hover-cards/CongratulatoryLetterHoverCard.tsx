import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CongratulatoryLetterHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const CongratulatoryLetterHoverCard = ({ children, onPromptGenerated }: CongratulatoryLetterHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [finalTouch, setFinalTouch] = useState("");
  const [signOff, setSignOff] = useState("");
  const [from, setFrom] = useState("");
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('congratulatoryLetter-form');
    if (saved) {
      const data = JSON.parse(saved);
      setTo(data.to || "");
      setSubject(data.subject || "");
      setCoreMessage(data.coreMessage || "");
      setFinalTouch(data.finalTouch || "");
      setSignOff(data.signOff || "");
      setFrom(data.from || "");
    }
  }, []);

  useEffect(() => {
    const formData = { to, subject, coreMessage, finalTouch, signOff, from };
    localStorage.setItem('congratulatoryLetter-form', JSON.stringify(formData));
  }, [to, subject, coreMessage, finalTouch, signOff, from]);

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setShowCard(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowCard(false);
    }, 250);
    setCloseTimeout(timeout);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('prompt-engine-communication', {
        body: { 
          contentType: 'congratulatory_letter', 
          formData: { 
            to, 
            subject, 
            coreMessage, 
            finalTouch, 
            signOff, 
            from 
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
        const card = document.querySelector('[data-congratulatory-card]');
        if (card && !card.contains(target) && !target.closest('[data-congratulatory-trigger]')) {
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
    <>
      {/* Trigger Element */}
      <div 
        data-congratulatory-trigger
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
            data-congratulatory-card
            className="absolute left-[918px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <Trophy className="w-5 h-5 text-[#5B34A0]" />
                     <h3 className="text-lg font-semibold text-[#5B34A0]">Congratulatory Letter</h3>
                   </div>
                   <p className="text-sm text-[#6E6E6E] mb-4">Celebrate achievements and milestones</p>
                 </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                    <Textarea
                       value={to || undefined}
                       onChange={(e) => setTo(e.target.value)}
                       placeholder="Dear [Name], Friend, Colleague, Team, Family..."
                       className="w-full min-h-[60px] resize-none"
                     />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label>
                    <Textarea
                       value={subject || undefined}
                       onChange={(e) => setSubject(e.target.value)}
                       placeholder="Mention about Achievement, Success, Promotion, Milestone, Marriage etc..."
                       className="w-full min-h-[60px] resize-none"
                     />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label>
                    <Textarea
                      value={coreMessage || undefined}
                      onChange={(e) => setCoreMessage(e.target.value)}
                      placeholder="Use phrases like Congratulations, Proud of you, Good job, Well done, etc. to write your message."
                      className="w-full min-h-[80px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label>
                    <Textarea
                      value={finalTouch || undefined}
                      onChange={(e) => setFinalTouch(e.target.value)}
                      placeholder="Use phrases like Personal pride, Shared joy, Looking ahead, Keep going etc..."
                      className="w-full min-h-[60px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label>
                    <Textarea
                      value={signOff || undefined}
                      onChange={(e) => setSignOff(e.target.value)}
                      placeholder="Consider writing Best wishes, Heartfelt regards, Cheers, Warmly etc. to close the message"
                      className="w-full min-h-[60px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label>
                    <Input
                      value={from || undefined}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Proud Friend, Warm Regards, Your Name, "
                      className="w-full"
                    />
                  </div>
                  
                  <button
                    className="w-full py-3 bg-[#6C3EB6] text-white font-medium rounded-lg hover:bg-[#5B34A0] transition-colors"
                    onClick={handleGeneratePrompt}
                  >
                    Start Congratulatory Letter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CongratulatoryLetterHoverCard;