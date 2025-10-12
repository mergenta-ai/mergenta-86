import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface EssayHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const EssayHoverCard: React.FC<EssayHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "essay",
    initialData: {
      essayTitle: "",
      keyPoints: "",
      wordCount: "",
      tone: "",
      audience: "",
    },
  });

  // stable locals (always strings) to avoid controlled/uncontrolled issues
  const essayTitle = draftData?.essayTitle ?? "";
  const keyPoints = draftData?.keyPoints ?? "";
  const wordCount = draftData?.wordCount ?? "";
  const tone = draftData?.tone ?? "";
  const audience = draftData?.audience ?? "";

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
      (essayTitle && essayTitle.trim() !== "") ||
        (keyPoints && keyPoints.trim() !== "") ||
        (wordCount && wordCount.trim() !== "") ||
        (tone && tone.trim() !== "") ||
        (audience && audience.trim() !== ""),
    );

    if (hasContent) {
      // immediately clear visible fields so UI updates right away
      saveDraft("essayTitle", "");
      saveDraft("keyPoints", "");
      saveDraft("wordCount", "");
      saveDraft("tone", "");
      saveDraft("audience", "");
      // then clear persisted storage
      clearDraft();
      return; // keep card open so user can see emptiness
    }

    // already empty -> close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "essay",
          formData: {
            essayTitle,
            keyPoints,
            wordCount,
            tone,
            audience,
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
  useClickOutside(showCard, () => setShowCard(false), "[data-essay-card]", "[data-essay-trigger]");

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-essay-trigger
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
            data-essay-card
            className="absolute left-[580px] top-[140px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-3">
                {/* Header + Clear */}
                <div className="flex items-start justify-between pb-2 border-b border-pastel-lavender-hover">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📄</span>
                    <div>
                      <h3 className="font-semibold text-sidebar-text-violet text-lg">Essay</h3>
                      <p className="text-xs text-sidebar-text-dark italic">
                        Structured, formal writing — balanced arguments and clarity.
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

                {/* Essay Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="essay-title" className="text-sm font-medium text-sidebar-text-dark">
                    Essay Title
                  </Label>
                  <Input
                    id="essay-title"
                    value={essayTitle}
                    onChange={(e) => saveDraft("essayTitle", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter your essay title..."
                    className="text-sm"
                    autoComplete="off"
                  />
                </div>

                {/* Key Points Input */}
                <div className="space-y-2">
                  <Label htmlFor="key-points" className="text-sm font-medium text-sidebar-text-dark">
                    Key Points / Topics
                  </Label>
                  <Textarea
                    id="key-points"
                    value={keyPoints}
                    onChange={(e) => saveDraft("keyPoints", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="List your main points or topics..."
                    className="text-sm min-h-[70px] resize-none"
                    autoComplete="off"
                  />
                </div>

                {/* Word Count Input */}
                <div className="space-y-2">
                  <Label htmlFor="word-count" className="text-sm font-medium text-sidebar-text-dark">
                    Word Count
                  </Label>
                  <Input
                    id="word-count"
                    type="number"
                    value={wordCount}
                    onChange={(e) => saveDraft("wordCount", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="400–2000"
                    min={400}
                    max={2000}
                    className="text-sm"
                    autoComplete="off"
                  />
                </div>

                {/* Tone Input */}
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-sm font-medium text-sidebar-text-dark">
                    Tone
                  </Label>
                  <Textarea
                    id="tone"
                    value={tone}
                    onChange={(e) => saveDraft("tone", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="formal, analytical, narrative, persuasive, etc..."
                    className="text-sm min-h-[60px] resize-none"
                    autoComplete="off"
                  />
                </div>

                {/* Audience Input */}
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-sm font-medium text-sidebar-text-dark">
                    Audience
                  </Label>
                  <Textarea
                    id="audience"
                    value={audience}
                    onChange={(e) => saveDraft("audience", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="academic, business, professional, general, etc..."
                    className="text-sm min-h-[60px] resize-none"
                    autoComplete="off"
                  />
                </div>

                {/* Start Essay Button */}
                <Button
                  className="w-full bg-[#6F42C1] hover:bg-[#5A359A] text-white transition-colors duration-200"
                  onClick={handleGeneratePrompt}
                >
                  Start Essay
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayHoverCard;
