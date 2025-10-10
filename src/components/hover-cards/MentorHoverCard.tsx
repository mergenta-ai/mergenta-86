import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface MentorHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const MentorHoverCard: React.FC<MentorHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "mentor",
    initialData: {
      mentorshipDomain: "",
      currentStage: "",
      challenges: "",
      desiredOutcome: "",
      preferredStyle: "",
    },
  });

  // convenience locals
  const mentorshipDomain = (draftData?.mentorshipDomain as string) ?? "";
  const currentStage = (draftData?.currentStage as string) ?? "";
  const challenges = (draftData?.challenges as string) ?? "";
  const desiredOutcome = (draftData?.desiredOutcome as string) ?? "";
  const preferredStyle = (draftData?.preferredStyle as string) ?? "";

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
      (mentorshipDomain && mentorshipDomain.trim() !== "") ||
        (currentStage && currentStage.trim() !== "") ||
        (challenges && challenges.trim() !== "") ||
        (desiredOutcome && desiredOutcome.trim() !== "") ||
        (preferredStyle && preferredStyle.trim() !== ""),
    );

    if (hasContent) {
      // Immediately clear visible fields so UI updates right away
      saveDraft("mentorshipDomain", "");
      saveDraft("currentStage", "");
      saveDraft("challenges", "");
      saveDraft("desiredOutcome", "");
      saveDraft("preferredStyle", "");

      // Then clear persisted storage (localStorage / DB) if hook uses persistence
      clearDraft();

      // Keep card open so user can verify it's empty
      return;
    }

    // already empty → close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "mentor",
          formData: {
            mentorshipDomain,
            currentStage,
            challenges,
            desiredOutcome,
            preferredStyle,
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
  useClickOutside(showCard, () => setShowCard(false), "[data-mentor-card]", "[data-mentor-trigger]");

  

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-mentor-trigger
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
            data-mentor-card
            className="absolute left-[1050px] top-[275px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div
              className="p-4 border rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-200"
              style={{ backgroundColor: "#F0E6FA", borderColor: "#E4D1F0" }}
            >
              <div className="space-y-3">
                {/* Header + clear */}
                <div className="flex items-start justify-between pb-2 border-b" style={{ borderColor: "#E4D1F0" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: "#5B34A0" }}>
                        Think like a Mentor
                      </h3>
                      <p className="text-xs italic" style={{ color: "#6E6E6E" }}>
                        Get wise guidance tailored to your goals and challenges.
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

                {/* Mentorship Domain */}
                <div className="space-y-2">
                  <Label htmlFor="mentorship-domain" className="text-sm font-medium" style={{ color: "#6E6E6E" }}>
                    Mentorship Domain
                  </Label>
                  <Input
                    id="mentorship-domain"
                    value={mentorshipDomain}
                    onChange={(e) => saveDraft("mentorshipDomain", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Career, entrepreneurship, leadership, personal growth…"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Current Stage */}
                <div className="space-y-2">
                  <Label htmlFor="current-stage" className="text-sm font-medium" style={{ color: "#6E6E6E" }}>
                    Your Current Stage
                  </Label>
                  <Input
                    id="current-stage"
                    value={currentStage}
                    onChange={(e) => saveDraft("currentStage", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Beginner, intermediate, advanced…"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Challenges */}
                <div className="space-y-2">
                  <Label htmlFor="challenges" className="text-sm font-medium" style={{ color: "#6E6E6E" }}>
                    Challenges / Obstacles
                  </Label>
                  <Input
                    id="challenges"
                    value={challenges}
                    onChange={(e) => saveDraft("challenges", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Confidence, skills, direction…"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Desired Outcome */}
                <div className="space-y-2">
                  <Label htmlFor="desired-outcome" className="text-sm font-medium" style={{ color: "#6E6E6E" }}>
                    Desired Outcome
                  </Label>
                  <Input
                    id="desired-outcome"
                    value={desiredOutcome}
                    onChange={(e) => saveDraft("desiredOutcome", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Decision-making, clarity, confidence…"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Preferred Style */}
                <div className="space-y-2">
                  <Label htmlFor="preferred-style" className="text-sm font-medium" style={{ color: "#6E6E6E" }}>
                    Preferred Style
                  </Label>
                  <Input
                    id="preferred-style"
                    value={preferredStyle}
                    onChange={(e) => saveDraft("preferredStyle", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Encouraging, tough-love, structured…"
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
                  Be My Mentor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorHoverCard;
