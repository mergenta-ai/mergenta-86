import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Smile, X } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface WelcomeLetterHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const WelcomeLetterHoverCard = ({ children, onPromptGenerated }: WelcomeLetterHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "welcome-letter",
    initialData: { to: "", subject: "", coreMessage: "", finalTouch: "", signOff: "", from: "" },
  });

  // always-strings to avoid controlled/uncontrolled issues
  const to = draftData?.to ?? "";
  const subject = draftData?.subject ?? "";
  const coreMessage = draftData?.coreMessage ?? "";
  const finalTouch = draftData?.finalTouch ?? "";
  const signOff = draftData?.signOff ?? "";
  const from = draftData?.from ?? "";

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

  const handleClearDraft = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    const hasContent = Boolean(
      (to && to.trim() !== "") ||
        (subject && subject.trim() !== "") ||
        (coreMessage && coreMessage.trim() !== "") ||
        (finalTouch && finalTouch.trim() !== "") ||
        (signOff && signOff.trim() !== "") ||
        (from && from.trim() !== ""),
    );

    if (hasContent) {
      // clear visible fields immediately
      saveDraft("to", "");
      saveDraft("subject", "");
      saveDraft("coreMessage", "");
      saveDraft("finalTouch", "");
      saveDraft("signOff", "");
      saveDraft("from", "");
      // clear persisted storage
      clearDraft();
      return; // keep card open so user sees emptied fields
    }

    // already empty -> close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "welcome_letter",
          formData: { to, subject, coreMessage, finalTouch, signOff, from },
        },
      });
      if (error) throw error;
      if (data?.success && data?.prompt) {
        onPromptGenerated?.(data.prompt);
        clearDraft();
        setShowCard(false);
      }
    } catch (err) {
      console.error("Error generating prompt:", err);
    }
  };

  useClickOutside(showCard, () => setShowCard(false), "[data-welcome-card]", "[data-welcome-trigger]");

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-welcome-trigger
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
            data-welcome-card
            className="absolute left-[910px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Smile className="w-5 h-5 text-[#5B34A0]" />
                      <h3 className="text-lg font-semibold text-[#5B34A0]">Welcome Letter</h3>
                    </div>
                    <p className="text-sm text-[#6E6E6E] mb-4">Welcome newcomers warmly</p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-[#6C3EB6] hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90 group"
                    onClick={(e) => handleClearDraft(e)}
                    title="Clear draft"
                  >
                    <X className="h-4 w-4 text-[#5B34A0] group-hover:text-white transition-colors duration-300" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                    <Textarea
                      value={to}
                      onChange={(e) => saveDraft("to", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Dear [Name], New Member, Employee, Guest, Friend, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label>
                    <Textarea
                      value={subject}
                      onChange={(e) => saveDraft("subject", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Greetings, Onboarding, New start, Arrival, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label>
                    <Textarea
                      value={coreMessage}
                      onChange={(e) => saveDraft("coreMessage", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Warm welcome, excited to have you, helpful resources, support, etc..."
                      className="w-full min-h-[80px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label>
                    <Textarea
                      value={finalTouch}
                      onChange={(e) => saveDraft("finalTouch", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Support, opportunities, encouragement, next steps..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label>
                    <Textarea
                      value={signOff}
                      onChange={(e) => saveDraft("signOff", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Together ahead, With support, Regards, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label>
                    <Input
                      value={from}
                      onChange={(e) => saveDraft("from", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Your Name, On behalf of team, Sincerely, etc..."
                      className="w-full"
                      autoComplete="off"
                    />
                  </div>

                  <button
                    className="w-full py-3 bg-[#6C3EB6] text-white font-medium rounded-lg hover:bg-[#5B34A0] transition-colors"
                    onClick={handleGeneratePrompt}
                  >
                    Extend Welcome
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

export default WelcomeLetterHoverCard;
