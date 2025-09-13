import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";

interface InvitationLetterHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const InvitationLetterHoverCard = ({ children, onPromptGenerated }: InvitationLetterHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [finalTouch, setFinalTouch] = useState("");
  const [signOff, setSignOff] = useState("");
  const [from, setFrom] = useState("");
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('invitationLetter-form');
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
    localStorage.setItem('invitationLetter-form', JSON.stringify(formData));
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
          contentType: 'invitation_letter', 
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
  useClickOutside(
    showCard,
    () => setShowCard(false),
    '[data-invitation-letter-card]',
    '[data-invitation-letter-trigger]'
  );

  return (
    <>
      {/* Trigger Element */}
      <div 
        data-invitation-letter-trigger
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
            data-invitation-letter-card
            className="absolute left-[918px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <Send className="w-5 h-5 text-[#5B34A0]" />
                     <h3 className="text-lg font-semibold text-[#5B34A0]">Invitation Letter</h3>
                   </div>
                   <p className="text-sm text-[#6E6E6E] mb-4">Invite others to events and occasions</p>
                 </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                    <Textarea
                       value={to || undefined}
                       onChange={(e) => setTo(e.target.value)}
                       placeholder="Dear [Name], Friend, Colleague, Guest, Relative, etc..."
                       className="w-full min-h-[60px] resize-none"
                     />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label>
                    <Textarea
                       value={subject || undefined}
                       onChange={(e) => setSubject(e.target.value)}
                       placeholder="Marriage Invitation, Birthday Invitation, Celebration, Gathering, Party, Event, etc..."
                       className="w-full min-h-[60px] resize-none"
                     />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label>
                    <Textarea
                      value={coreMessage || undefined}
                      onChange={(e) => setCoreMessage(e.target.value)}
                      placeholder="You are invited, Join us, Please attend, Be our guest, etc. to write message..."
                      className="w-full min-h-[80px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label>
                    <Textarea
                      value={finalTouch || undefined}
                      onChange={(e) => setFinalTouch(e.target.value)}
                      placeholder="Mention Date, time, venue, occasion, RSVP details..."
                      className="w-full min-h-[60px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label>
                    <Textarea
                      value={signOff || undefined}
                      onChange={(e) => setSignOff(e.target.value)}
                      placeholder="Use phrases like Looking forward, With regards, Warm wishes, Best wishes, You have to be there, etc..."
                      className="w-full min-h-[60px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label>
                    <Input
                      value={from || undefined}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Your Name, Host, Organiser, etc..."
                      className="w-full"
                    />
                  </div>
                  
                  <button
                    className="w-full py-3 bg-[#6C3EB6] text-white font-medium rounded-lg hover:bg-[#5B34A0] transition-colors"
                    onClick={handleGeneratePrompt}
                  >
                    Start Invitation Letter
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

export default InvitationLetterHoverCard;