import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";

interface RecommendationLetterHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const RecommendationLetterHoverCard = ({ children, onPromptGenerated }: RecommendationLetterHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [finalTouch, setFinalTouch] = useState("");
  const [signOff, setSignOff] = useState("");
  const [from, setFrom] = useState("");
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

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

  // Close card when clicking outside
  useClickOutside(
    showCard,
    () => setShowCard(false),
    '[data-recommendation-card]',
    '[data-recommendation-trigger]'
  );

  return (
    <>
      {/* Trigger Element */}
      <div 
        data-recommendation-trigger
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
            data-recommendation-card
            className="absolute left-[918px] top-[212px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <Star className="w-5 h-5 text-[#5B34A0]" />
                     <h3 className="text-lg font-semibold text-[#5B34A0]">Recommendation Letter</h3>
                   </div>
                   <p className="text-sm text-[#6E6E6E] mb-4">Endorse and recommend someone professionally</p>
                 </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                    <Textarea
                      value={to || undefined}
                      onChange={(e) => setTo(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Dear [Name], Employer, University, HR, Departments, Organisation etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label>
                    <Textarea
                      value={subject || undefined}
                      onChange={(e) => setSubject(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Mention if this is an endorsement, support statement, referral or recommendation, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label>
                     <Textarea
                       value={coreMessage || undefined}
                       onChange={(e) => setCoreMessage(e.target.value)}
                       onClick={(e) => e.stopPropagation()}
                       placeholder="Highlight strong skills, merits, abilities, endorsements, good behaviour and team spirit, etc..."
                       className="w-full min-h-[80px] resize-none"
                       autoComplete="off"
                     />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label>
                     <Textarea
                       value={finalTouch || undefined}
                       onChange={(e) => setFinalTouch(e.target.value)}
                       onClick={(e) => e.stopPropagation()}
                       placeholder="Mention achievements, strengths, qualities, reliability and dedication, etc..."
                       className="w-full min-h-[60px] resize-none"
                       autoComplete="off"
                     />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label>
                     <Textarea
                       value={signOff || undefined}
                       onChange={(e) => setSignOff(e.target.value)}
                       onClick={(e) => e.stopPropagation()}
                       placeholder="Strongly recommend, Best wishes, Regards, etc..."
                       className="w-full min-h-[60px] resize-none"
                       autoComplete="off"
                     />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label>
                     <Input
                       value={from || undefined}
                       onChange={(e) => setFrom(e.target.value)}
                       onClick={(e) => e.stopPropagation()}
                       placeholder="Your Name"
                       className="w-full"
                       autoComplete="off"
                     />
                  </div>
                  
                  <button
                    className="w-full py-3 bg-[#6C3EB6] text-white font-medium rounded-lg hover:bg-[#5B34A0] transition-colors"
                    onClick={async () => {
                      try {
                        const { data, error } = await supabase.functions.invoke('prompt-engine-consolidated', {
                          body: { 
                            contentType: 'recommendation_letter', 
                            formData: { to, subject, coreMessage, finalTouch, signOff, from } 
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
                    Write Recommendation
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

export default RecommendationLetterHoverCard;