import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface DevilsAdvocateHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const DevilsAdvocateHoverCard: React.FC<DevilsAdvocateHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "devils-advocate",
    initialData: {
      idea: "",
      keyAssumptions: "",
      risksWeaknesses: "",
      alternativePerspectives: "",
    },
  });

  // locals for convenience
  const idea = (draftData?.idea as string) ?? "";
  const keyAssumptions = (draftData?.keyAssumptions as string) ?? "";
  const risksWeaknesses = (draftData?.risksWeaknesses as string) ?? "";
  const alternativePerspectives = (draftData?.alternativePerspectives as string) ?? "";

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
      (idea && idea.trim() !== "") ||
        (keyAssumptions && keyAssumptions.trim() !== "") ||
        (risksWeaknesses && risksWeaknesses.trim() !== "") ||
        (alternativePerspectives && alternativePerspectives.trim() !== ""),
    );

    if (hasContent) {
      // Immediately clear visible fields so the UI updates right away
      saveDraft("idea", "");
      saveDraft("keyAssumptions", "");
      saveDraft("risksWeaknesses", "");
      saveDraft("alternativePerspectives", "");

      // Then clear persisted storage (localStorage / DB) if the hook uses persistence
      clearDraft();

      // Keep the card open so user can verify empty fields
      return;
    }

    // already empty -> close the card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "devils_advocate",
          formData: {
            idea,
            keyAssumptions,
            risksWeaknesses,
            alternativePerspectives,
          },
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

  // Close card when clicking outside
  useClickOutside(showCard, () => setShowCard(false), "[data-devils-advocate-card]", "[data-devils-advocate-trigger]");

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-devils-advocate-trigger
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
            data-devils-advocate-card
            className="absolute left-[1044px] top-[370px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div
              className="p-4 border rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-200"
              style={{ backgroundColor: "#EDE9F7", borderColor: "#DDD1ED" }}
            >
              <div className="space-y-3">
                {/* Header + clear */}
                <div className="flex items-start justify-between pb-2 border-b" style={{ borderColor: "#DDD1ED" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚖️</span>
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: "#5B34A0" }}>
                        Be a Devil's Advocate
                      </h3>
                      <p className="text-xs italic" style={{ color: "#6E6E6E" }}>
                        Challenge assumptions — counterpoints and tough questions.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleClearDraft}
                    title="Clear draft"
                    className="p-1 rounded hover:bg-[#5B34A0]/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-[#5B34A0]" />
                  </button>
                </div>

                {/* Idea */}
                <div className="space-y-2">
                  <Label htmlFor="idea" className="text-sm font-medium" style={{ color: "#6E6E6E" }}>
                    Idea
                  </Label>
                  <Textarea
                    id="idea"
                    value={idea}
                    onChange={(e) => saveDraft("idea", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter idea, plan or decision to be tested…"
                    className="text-sm min-h-[70px] resize-none bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Key Assumptions */}
                <div className="space-y-2">
                  <Label htmlFor="key-assumptions" className="text-sm font-medium" style={{ color: "#6E6E6E" }}>
                    Key Assumptions
                  </Label>
                  <Input
                    id="key-assumptions"
                    value={keyAssumptions}
                    onChange={(e) => saveDraft("keyAssumptions", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Beliefs to challenge…"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Risks / Weaknesses */}
                <div className="space-y-2">
                  <Label htmlFor="risks-weaknesses" className="text-sm font-medium" style={{ color: "#6E6E6E" }}>
                    Risks / Weaknesses
                  </Label>
                  <Input
                    id="risks-weaknesses"
                    value={risksWeaknesses}
                    onChange={(e) => saveDraft("risksWeaknesses", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Potential flaws, oversights, vulnerabilities…"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Alternative Perspectives */}
                <div className="space-y-2">
                  <Label
                    htmlFor="alternative-perspectives"
                    className="text-sm font-medium"
                    style={{ color: "#6E6E6E" }}
                  >
                    Alternative Perspectives
                  </Label>
                  <Input
                    id="alternative-perspectives"
                    value={alternativePerspectives}
                    onChange={(e) => saveDraft("alternativePerspectives", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Different viewpoints, counter arguments…"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Action Button */}
                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: "#6C3EB6" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5B34A0")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6C3EB6")}
                  onClick={handleGeneratePrompt}
                >
                  Play Devil's Advocate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevilsAdvocateHoverCard;
