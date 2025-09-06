import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail } from "lucide-react";

interface GeneralLetterHoverCardProps {
  children: React.ReactNode;
}

const GeneralLetterHoverCard = ({ children }: GeneralLetterHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [finalTouch, setFinalTouch] = useState("");
  const [signOff, setSignOff] = useState("");
  const [from, setFrom] = useState("");
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('generalLetter-form');
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
    localStorage.setItem('generalLetter-form', JSON.stringify(formData));
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
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
      {showCard && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          <div className="absolute left-[918px] top-[220px] w-80 pointer-events-auto" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <Mail className="w-5 h-5 text-[#5B34A0]" />
                     <h3 className="text-lg font-semibold text-[#5B34A0]">General Letter</h3>
                   </div>
                   <p className="text-sm text-[#6E6E6E] mb-4">Write any type of letter with flexibility</p>
                 </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                    <Textarea value={to || undefined} onChange={(e) => setTo(e.target.value)} placeholder="Friend, colleague, organisation, contact, relative, teacher, neighbour, authority, client, well-wisher, group, team, company, etc..." className="w-full min-h-[60px] resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label>
                    <Textarea value={subject || undefined} onChange={(e) => setSubject(e.target.value)} placeholder="Update, sharing, greetings, information, invitation, appreciation, announcement, congratulations, introduction, feedback, reminder, acknowledgment, good wishes, enquiry, expression of thanks, seasonal greetings, etc..." className="w-full min-h-[60px] resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label>
                    <Textarea value={coreMessage || undefined} onChange={(e) => setCoreMessage(e.target.value)} placeholder="Key points, general info, notes, communication, thoughts, reminders, updates, news, observations, suggestions, remarks, experiences, highlights, opinions, acknowledgments, etc..." className="w-full min-h-[80px] resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label>
                    <Textarea value={finalTouch || undefined} onChange={(e) => setFinalTouch(e.target.value)} placeholder="Additional notes, clarification, highlights, explanations, details, observations, key information, etc..." className="w-full min-h-[60px] resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label>
                    <Textarea value={signOff || undefined} onChange={(e) => setSignOff(e.target.value)} placeholder="Looking forward, best regards, warmly, with appreciation, yours truly, kind regards, sincerely, etc..." className="w-full min-h-[60px] resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label>
                    <Input value={from || undefined} onChange={(e) => setFrom(e.target.value)} placeholder="Your Name, Your Organisation..." className="w-full" />
                  </div>
                  <button className="w-full py-3 bg-[#6C3EB6] text-white font-medium rounded-lg hover:bg-[#5B34A0] transition-colors" onClick={() => console.log("Start General Letter")}>
                    Start General Letter
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

export default GeneralLetterHoverCard;