import React, { useState, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Heart, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface LoveLetterHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const LoveLetterHoverCard = ({ children, onPromptGenerated }: LoveLetterHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "love_letter",
    initialData: { to: "", subject: "", coreMessage: "", finalTouch: "", signOff: "", from: "" },
  });

  // always-string locals to avoid controlled/uncontrolled issues
  const to = draftData?.to ?? "";
  const subject = draftData?.subject ?? "";
  const coreMessage = draftData?.coreMessage ?? "";
  const finalTouch = draftData?.finalTouch ?? "";
  const signOff = draftData?.signOff ?? "";
  const from = draftData?.from ?? "";

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "love_letter",
          formData: {
            to,
            subject,
            coreMessage,
            finalTouch,
            signOff,
            from,
          },
        },
      });

      if (error) throw error;

      if (data?.success && data?.prompt) {
        onPromptGenerated?.(data.prompt);
        clearDraft();
        setShowCard(false);
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
    }
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
      saveDraft("to", "");
      saveDraft("subject", "");
      saveDraft("coreMessage", "");
      saveDraft("finalTouch", "");
      saveDraft("signOff", "");
      saveDraft("from", "");
      clearDraft();
      return; // keep card open so user sees emptied fields
    }

    // already empty -> close card
    setShowCard(false);
  };

  useClickOutside(showCard, () => setShowCard(false), "[data-love-letter-card]", "[data-love-letter-trigger]");

  

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-love-letter-trigger
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
            data-love-letter-card
            className="absolute left-[918px] top-[120px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-primary/15 animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold text-primary">Love Letter</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Express your deepest feelings and emotions</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div />
                    <button
                      type="button"
                      onClick={(e) => handleClearDraft(e)}
                      className="p-1 hover:bg-primary/10 rounded-md transition-colors"
                      title="Clear Draft"
                    >
                      <X className="w-4 h-4 text-primary" />
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">To</label>
                    <Textarea
                      value={to}
                      onChange={(e) => saveDraft("to", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Dear [Name], My Love, Darling, Sweetheart, Honey, etc..."
                      className="w-full min-h-[80px]"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Subject / Purpose</label>
                    <Textarea
                      value={subject}
                      onChange={(e) => saveDraft("subject", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Affection, Care, Commitment, Admiration, Attraction, etc..."
                      className="w-full min-h-[80px]"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Core Message</label>
                    <Textarea
                      value={coreMessage}
                      onChange={(e) => saveDraft("coreMessage", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Feelings, cherished moments, longing, nostalgia, etc..."
                      className="w-full min-h-[100px]"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Final Touch</label>
                    <Textarea
                      value={finalTouch}
                      onChange={(e) => saveDraft("finalTouch", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Future dreams, promises, shared memories..."
                      className="w-full min-h-[80px]"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Sign Off</label>
                    <Textarea
                      value={signOff}
                      onChange={(e) => saveDraft("signOff", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Forever yours, With all my love, Yours truly..."
                      className="w-full min-h-[80px]"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">From</label>
                    <Input
                      value={from}
                      onChange={(e) => saveDraft("from", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Sender: Your Name"
                      className="w-full"
                      autoComplete="off"
                    />
                  </div>

                  <Button
                    className="w-full h-12"
                    onClick={handleGeneratePrompt}
                  >
                    Express Love
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoveLetterHoverCard;
