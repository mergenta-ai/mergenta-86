import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Clock, X } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface LeaveApplicationHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const LeaveApplicationHoverCard = ({ children, onPromptGenerated }: LeaveApplicationHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const { draftData, saveDraft, clearDraft } = useDraftPersistence({ 
    cardId: 'leave_application',
    initialData: { to: '', subject: '', coreMessage: '', finalTouch: '', signOff: '', from: '' }
  });
  
  const to = (draftData.to as string) || '';
  const subject = (draftData.subject as string) || '';
  const coreMessage = (draftData.coreMessage as string) || '';
  const finalTouch = (draftData.finalTouch as string) || '';
  const signOff = (draftData.signOff as string) || '';
  const from = (draftData.from as string) || '';
  
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
    e.stopPropagation();
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('prompt-engine-consolidated', {
        body: { 
          contentType: 'leave_application', 
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
        clearDraft();
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
    }
  };

  // Close card when clicking outside
  useClickOutside(
    showCard,
    () => setShowCard(false),
    '[data-leave-card]',
    '[data-leave-trigger]'
  );

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div 
        data-leave-trigger
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
            data-leave-card
            className="absolute left-[918px] top-[220px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                 <div className="flex items-start justify-between">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                       <Clock className="w-5 h-5 text-[#5B34A0]" />
                       <h3 className="text-lg font-semibold text-[#5B34A0]">Leave Application</h3>
                     </div>
                     <p className="text-sm text-[#6E6E6E] mb-4">Request time off professionally</p>
                   </div>
                   <Button
                     variant="ghost"
                     size="icon"
                     className="h-6 w-6 rounded-full hover:bg-[#E5D9F2]"
                     onClick={(e) => { e.stopPropagation(); clearDraft(); }}
                     title="Clear draft"
                   >
                     <X className="h-4 w-4 text-[#5B34A0]" />
                   </Button>
                 </div>
                 <div className="space-y-3">
                   <div><label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label><Textarea value={to || undefined} onChange={(e) => saveDraft('to', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Dear Sir/Madam, Manager, Principal, HR, Supervisor, etc..." className="w-full min-h-[60px] resize-none" autoComplete="off" /></div>
                   <div><label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label><Textarea value={subject || undefined} onChange={(e) => saveDraft('subject', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Leave, Absence, Sick, Vacation, Emergency, etc..." className="w-full min-h-[60px] resize-none" autoComplete="off" /></div>
                   <div><label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label><Textarea value={coreMessage || undefined} onChange={(e) => saveDraft('coreMessage', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Enter dates, reason, duration, explanation, absence, etc..." className="w-full min-h-[80px] resize-none" autoComplete="off" /></div>
                   <div><label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label><Textarea value={finalTouch || undefined} onChange={(e) => saveDraft('finalTouch', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Tell about medical note, family reason, urgency, context, etc..." className="w-full min-h-[60px] resize-none" autoComplete="off" /></div>
                   <div><label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label><Textarea value={signOff || undefined} onChange={(e) => saveDraft('signOff', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Kindly approve, With regards, Thank you, etc..." className="w-full min-h-[60px] resize-none" autoComplete="off" /></div>
                   <div><label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label><Input value={from || undefined} onChange={(e) => saveDraft('from', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Your Name" className="w-full" autoComplete="off" /></div>
                   <button className="w-full py-3 bg-[#6C3EB6] text-white font-medium rounded-lg hover:bg-[#5B34A0] transition-colors" onClick={handleGeneratePrompt}>Apply For Leave</button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplicationHoverCard;