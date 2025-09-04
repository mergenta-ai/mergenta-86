import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface CondolenceLetterHoverCardProps {
  children: React.ReactNode;
}

const CondolenceLetterHoverCard = ({ children }: CondolenceLetterHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [finalTouch, setFinalTouch] = useState("");
  const [signOff, setSignOff] = useState("");
  const [from, setFrom] = useState("");
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('condolenceLetter-form');
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
    localStorage.setItem('condolenceLetter-form', JSON.stringify(formData));
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
    <>
      {/* Trigger Element */}
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      {/* Full Screen Hover Area + Card */}
      {showCard && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          <div
            className="absolute left-[918px] top-[120px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#5B34A0] mb-1">Condolence Letter</h3>
                  <p className="text-sm text-[#6E6E6E] mb-4">Offer comfort and sympathy in times of loss</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                    <Input
                      value={to || undefined}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Dear [NAME], Friend, Family, Relative, Colleague, etc..."
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label>
                    <Input
                      value={subject || undefined}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Sympathy, Loss, Comfort, Support, etc..."
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label>
                    <Textarea
                      value={coreMessage || undefined}
                      onChange={(e) => setCoreMessage(e.target.value)}
                      placeholder="Use phrases like Deepest sympathies, sharing grief, prayers, etc..."
                      className="w-full min-h-[80px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label>
                    <Textarea
                      value={finalTouch || undefined}
                      onChange={(e) => setFinalTouch(e.target.value)}
                      placeholder="Mention about Fond memories, peace, strength, standing with you, comfort, etc..."
                      className="w-full min-h-[60px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label>
                    <Textarea
                      value={signOff || undefined}
                      onChange={(e) => setSignOff(e.target.value)}
                      placeholder="With sympathy, In remembrance, Respectfully yours, In sorrow, Sincerely, etc..."
                      className="w-full min-h-[60px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label>
                    <Input
                      value={from || undefined}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Your Name"
                      className="w-full"
                    />
                  </div>
                  
                  <button
                    className="w-full py-3 bg-[#6C3EB6] text-white font-medium rounded-lg hover:bg-[#5B34A0] transition-colors"
                    onClick={() => console.log("Start Condolence Letter")}
                  >
                    Start Condolence Letter
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

export default CondolenceLetterHoverCard;