import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ThumbsUp, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";
import { useToast } from "@/hooks/use-toast";

interface AppreciationLetterHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const AppreciationLetterHoverCard = ({ children, onPromptGenerated }: AppreciationLetterHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "appreciation-letter",
    initialData: {
      to: "",
      subject: "",
      coreMessage: "",
      finalTouch: "",
      signOff: "",
      from: "",
    },
  });

  const handleClearDraft = () => {
    clearDraft();
    setTimeout(() => {
      toast({ title: "Draft cleared", duration: 1000 });
    }, 100);
  };

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
    "[data-appreciation-letter-card]",
    "[data-appreciation-letter-trigger]",
  );

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-appreciation-letter-trigger
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
            data-appreciation-letter-card
            className="absolute left-[910px] top-[220px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5 text-[#5B34A0]" />
                      <h3 className="text-lg font-semibold text-[#5B34A0]">Appreciation Letter</h3>
                    </div>
                    <button
                      onClick={handleClearDraft}
                      className="p-1 hover:bg-[#E5D9F2] rounded transition-colors"
                      title="Clear draft"
                    >
                      <X className="w-4 h-4 text-[#5B34A0]" />
                    </button>
                  </div>
                  <p className="text-sm text-[#6E6E6E] mb-4">Express appreciation professionally</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                    <Textarea
                      value={draftData.to || ""}
                      onChange={(e) => saveDraft("to", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Dear [Name], Employee, Colleague, Student, Team, Relative, Teacher, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label>
                    <Textarea
                      value={draftData.subject || ""}
                      onChange={(e) => saveDraft("subject", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Recognition, Gratitude, Thanks, Appreciation, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label>
                    <Textarea
                      value={draftData.coreMessage || ""}
                      onChange={(e) => saveDraft("coreMessage", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Efforts, Contributions, Achievements, Great work, Gratitude..."
                      className="w-full min-h-[80px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label>
                    <Textarea
                      value={draftData.finalTouch || ""}
                      onChange={(e) => saveDraft("finalTouch", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Sincerity, Specific examples, Inspiration, Positive traits, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label>
                    <Textarea
                      value={draftData.signOff || ""}
                      onChange={(e) => saveDraft("signOff", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Keep inspiring, Best wishes, Energy to you, With regards, With thanks, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label>
                    <Input
                      value={draftData.from || ""}
                      onChange={(e) => saveDraft("from", e.target.value)}
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
                        const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
                          body: {
                            contentType: "appreciation_letter",
                            formData: {
                              to: draftData.to,
                              subject: draftData.subject,
                              coreMessage: draftData.coreMessage,
                              finalTouch: draftData.finalTouch,
                              signOff: draftData.signOff,
                              from: draftData.from,
                            },
                          },
                        });
                        if (error) throw error;
                        if (data?.success && data?.prompt) {
                          onPromptGenerated?.(data.prompt);
                          setShowCard(false);
                        }
                      } catch (error) {
                        console.error("Error generating prompt:", error);
                      }
                    }}
                  >
                    Show Appreciation
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

export default AppreciationLetterHoverCard;
