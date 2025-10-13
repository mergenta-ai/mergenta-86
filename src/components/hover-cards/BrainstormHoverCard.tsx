import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface BrainstormHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const BrainstormHoverCard: React.FC<BrainstormHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "brainstorm",
    initialData: {
      problemStatement: "",
      constraints: "",
      desiredOutcome: "",
    },
  });

  // convenience locals
  const problemStatement = (draftData?.problemStatement as string) ?? "";
  const constraints = (draftData?.constraints as string) ?? "";
  const desiredOutcome = (draftData?.desiredOutcome as string) ?? "";

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
      (problemStatement && problemStatement.trim() !== "") ||
        (constraints && constraints.trim() !== "") ||
        (desiredOutcome && desiredOutcome.trim() !== ""),
    );

    if (hasContent) {
      // immediately clear visible fields so UI updates right away
      saveDraft("problemStatement", "");
      saveDraft("constraints", "");
      saveDraft("desiredOutcome", "");

      // clear persisted storage as well
      clearDraft();

      // keep card open so user can verify emptiness
      return;
    }

    // already empty -> close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "brainstorm",
          formData: {
            idea: problemStatement,
            keyAssumptions: constraints,
            risksWeaknesses: desiredOutcome,
            alternativePerspectives: "",
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

  useClickOutside(showCard, () => setShowCard(false), "[data-brainstorm-card]", "[data-brainstorm-trigger]");

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-brainstorm-trigger
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
            data-brainstorm-card
            className="absolute left-[1044px] top-[490px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div
              className="p-4 border rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200"
              style={{ backgroundColor: "#F1E4FA", borderColor: "#E5D9F2" }}
            >
              <div className="space-y-3">
                {/* Header + clear */}
                <div className="flex items-start justify-between pb-2 border-b" style={{ borderColor: "#E5D9F2" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    <div>
                      <h3 className="font-semibold text-[#5B34A0] text-lg">Brainstorm with me</h3>
                      <p className="text-xs text-[#6E6E6E] italic">
                        Generate fresh ideas fast — creative, bold and varied.
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

                {/* Problem Statement */}
                <div className="space-y-2">
                  <Label htmlFor="problem-statement" className="text-sm font-medium text-[#5B34A0]">
                    Problem Statement
                  </Label>
                  <Textarea
                    id="problem-statement"
                    value={problemStatement}
                    onChange={(e) => saveDraft("problemStatement", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter topic, challenge or idea…"
                    className="text-sm min-h-[70px] resize-none bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Constraints */}
                <div className="space-y-2">
                  <Label htmlFor="constraints" className="text-sm font-medium text-[#5B34A0]">
                    Constraints
                  </Label>
                  <Input
                    id="constraints"
                    value={constraints}
                    onChange={(e) => saveDraft("constraints", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Budget, time limit, resources etc."
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Desired Outcome */}
                <div className="space-y-2">
                  <Label htmlFor="desired-outcome" className="text-sm font-medium text-[#5B34A0]">
                    Desired Outcome
                  </Label>
                  <Input
                    id="desired-outcome"
                    value={desiredOutcome}
                    onChange={(e) => saveDraft("desiredOutcome", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Innovation, efficiency, alternatives etc."
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: "#7D4EFF" }}
                  onClick={handleGeneratePrompt}
                >
                  Start Brainstorming
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainstormHoverCard;
