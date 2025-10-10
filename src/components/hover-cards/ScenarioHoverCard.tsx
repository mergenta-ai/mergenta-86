import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface ScenarioHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const ScenarioHoverCard: React.FC<ScenarioHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "scenario_planning",
    initialData: {
      centralChallenge: "",
      keyVariables: "",
      possibleOutcomes: "",
      focus: "",
      timeHorizon: "",
      desiredResponse: "",
    },
  });

  // convenience locals
  const centralChallenge = (draftData?.centralChallenge as string) ?? "";
  const keyVariables = (draftData?.keyVariables as string) ?? "";
  const possibleOutcomes = (draftData?.possibleOutcomes as string) ?? "";
  const focus = (draftData?.focus as string) ?? "";
  const timeHorizon = (draftData?.timeHorizon as string) ?? "";
  const desiredResponse = (draftData?.desiredResponse as string) ?? "";

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
      (centralChallenge && centralChallenge.trim() !== "") ||
        (keyVariables && keyVariables.trim() !== "") ||
        (possibleOutcomes && possibleOutcomes.trim() !== "") ||
        (focus && focus.trim() !== "") ||
        (timeHorizon && timeHorizon.trim() !== "") ||
        (desiredResponse && desiredResponse.trim() !== ""),
    );

    if (hasContent) {
      // Immediately clear visible fields so UI updates right away
      saveDraft("centralChallenge", "");
      saveDraft("keyVariables", "");
      saveDraft("possibleOutcomes", "");
      saveDraft("focus", "");
      saveDraft("timeHorizon", "");
      saveDraft("desiredResponse", "");

      // Then clear persisted storage (localStorage / DB) if hook uses persistence
      clearDraft();

      // Keep card open so user can see empty fields
      return;
    }

    // already empty -> close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "scenario_planning",
          formData: {
            centralChallenge,
            keyVariables,
            possibleOutcomes,
            focus,
            timeHorizon,
            desiredResponse,
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

  useClickOutside(showCard, () => setShowCard(false), "[data-scenario-card]", "[data-scenario-trigger]");

  

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-scenario-trigger
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
            data-scenario-card
            className="absolute left-[1050px] top-[150px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div
              className="p-4 border rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-200"
              style={{ backgroundColor: "#E9D7F7", borderColor: "#DCC7EF" }}
            >
              <div className="space-y-3">
                {/* Header + clear */}
                <div className="flex items-start justify-between pb-2 border-b" style={{ borderColor: "#DCC7EF" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <div>
                      <h3 className="font-semibold text-[#5B34A0] text-lg">Scenario Planning</h3>
                      <p className="text-xs text-[#6E6E6E] italic">
                        Anticipate futures — map risks, opportunities and strategies.
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

                {/* Central Challenge */}
                <div className="space-y-2">
                  <Label htmlFor="central-challenge" className="text-sm font-medium text-[#5B34A0]">
                    Central Challenge
                  </Label>
                  <Textarea
                    id="central-challenge"
                    value={centralChallenge}
                    onChange={(e) => saveDraft("centralChallenge", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter the core issue or question…"
                    className="text-sm min-h-[60px] resize-none bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Key Variables */}
                <div className="space-y-2">
                  <Label htmlFor="key-variables" className="text-sm font-medium text-[#5B34A0]">
                    Key Variables / Factors
                  </Label>
                  <Input
                    id="key-variables"
                    value={keyVariables}
                    onChange={(e) => saveDraft("keyVariables", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Political, economic, social, technological etc."
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Possible Outcomes */}
                <div className="space-y-2">
                  <Label htmlFor="possible-outcomes" className="text-sm font-medium text-[#5B34A0]">
                    Possible Outcomes
                  </Label>
                  <Input
                    id="possible-outcomes"
                    value={possibleOutcomes}
                    onChange={(e) => saveDraft("possibleOutcomes", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Best case, worst case, alternatives..."
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Focus */}
                <div className="space-y-2">
                  <Label htmlFor="focus" className="text-sm font-medium text-[#5B34A0]">
                    Focus
                  </Label>
                  <Input
                    id="focus"
                    value={focus}
                    onChange={(e) => saveDraft("focus", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Risks, Benefits, Trade-offs, Outcomes.."
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Time Horizon */}
                <div className="space-y-2">
                  <Label htmlFor="time-horizon" className="text-sm font-medium text-[#5B34A0]">
                    Time Horizon
                  </Label>
                  <Input
                    id="time-horizon"
                    value={timeHorizon}
                    onChange={(e) => saveDraft("timeHorizon", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Months, years, decades"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Desired Response */}
                <div className="space-y-2">
                  <Label htmlFor="desired-response" className="text-sm font-medium text-[#5B34A0]">
                    Desired Response
                  </Label>
                  <Input
                    id="desired-response"
                    value={desiredResponse}
                    onChange={(e) => saveDraft("desiredResponse", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Strategies, policies, actions to test..."
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Action Button */}
                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: "#6C3EB6" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5A2F9A")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6C3EB6")}
                  onClick={handleGeneratePrompt}
                >
                  Plan Scenarios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioHoverCard;
