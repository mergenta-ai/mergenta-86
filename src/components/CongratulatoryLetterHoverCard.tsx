import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useDynamicPosition } from "../hooks/useDynamicPosition";

interface CongratulatoryLetterHoverCardProps {
  children: React.ReactNode;
}

const CongratulatoryLetterHoverCard = ({ children }: CongratulatoryLetterHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [finalTouch, setFinalTouch] = useState("");
  const [signOff, setSignOff] = useState("");
  const [from, setFrom] = useState("");
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const { triggerRef, getPositionStyles } = useDynamicPosition(showCard, 320, 400);

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
    }, 100);
    setCloseTimeout(timeout);
  };

  return (
    <div 
      ref={triggerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {showCard && (
        <div 
          style={getPositionStyles()}
          className="w-80 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] p-6"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[#5B34A0] mb-1">Congratulatory Letter</h3>
              <p className="text-sm text-[#6E6E6E] mb-4">Celebrate achievements and milestones</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                <Input
                  value={to || undefined}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Recipient: Beloved, HR, Principal, Friend, Manager..."
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label>
                <Input
                  value={subject || undefined}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Leave request, Proposal, Apology, Congratulations, Condolence..."
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label>
                <Textarea
                  value={coreMessage || undefined}
                  onChange={(e) => setCoreMessage(e.target.value)}
                  placeholder="Main message, emotions, context..."
                  className="w-full min-h-[80px] resize-none"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label>
                <Textarea
                  value={finalTouch || undefined}
                  onChange={(e) => setFinalTouch(e.target.value)}
                  placeholder="Tone, length, special instructions..."
                  className="w-full min-h-[60px] resize-none"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label>
                <Textarea
                  value={signOff || undefined}
                  onChange={(e) => setSignOff(e.target.value)}
                  placeholder="Other details, closing lines, wrap-up..."
                  className="w-full min-h-[60px] resize-none"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label>
                <Input
                  value={from || undefined}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Sender: Your Name..."
                  className="w-full"
                />
              </div>
              
              <button
                className="w-full py-3 bg-[#6C3EB6] text-white font-medium rounded-lg hover:bg-[#5B34A0] transition-colors"
                onClick={() => console.log("Start Congratulatory Letter")}
              >
                Start Congratulatory Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CongratulatoryLetterHoverCard;