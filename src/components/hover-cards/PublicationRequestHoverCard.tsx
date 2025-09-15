import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";

interface PublicationRequestHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const PublicationRequestHoverCard = ({ children, onPromptGenerated }: PublicationRequestHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [finalTouch, setFinalTouch] = useState("");
  const [signOff, setSignOff] = useState("");
  const [from, setFrom] = useState("");
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

  // Close card when clicking outside
  useClickOutside(
    showCard,
    () => setShowCard(false),
    '[data-publication-card]',
    '[data-publication-trigger]'
  );

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div 
        data-publication-trigger
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
            data-publication-card
            className="absolute left-[918px] top-[220px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <BookOpen className="w-5 h-5 text-[#5B34A0]" />
                     <h3 className="text-lg font-semibold text-[#5B34A0]">Publication Request</h3>
                   </div>
                   <p className="text-sm text-[#6E6E6E] mb-4">Request to publish content or article</p>
                 </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                    <Textarea
                      value={to || undefined}
                      onChange={(e) => setTo(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Dear Sir/Madam, Editor, Journal name, Magazine name, Publication name, etc..."
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
                      placeholder="Publication submission, Article proposal, Content request, Book publication, Story publication, etc..."
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
                      placeholder="Article summary, genre, book excerpt, story/novel/book/publication details, research paper summary, story idea, etc..."
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
                      placeholder="Tone, length, audience specification, special requests, etc..."
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
                      placeholder="Other details, closing lines, wrap-up..."
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
                      placeholder="Your name, Your instirution/organisation..."
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
                            contentType: 'publication_request', 
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
                    Request Publication
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationRequestHoverCard;