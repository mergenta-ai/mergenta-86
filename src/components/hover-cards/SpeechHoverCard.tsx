import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface SpeechHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const SpeechHoverCard: React.FC<SpeechHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "speech",
    initialData: {
      theme: "",
      tone: "",
      audience: "",
      languageStyle: "",
      engagementTechniques: "",
      duration: "",
      impact: "",
    },
  });

  // convenience locals
  const theme = (draftData?.theme as string) ?? "";
  const tone = (draftData?.tone as string) ?? "";
  const audience = (draftData?.audience as string) ?? "";
  const languageStyle = (draftData?.languageStyle as string) ?? "";
  const engagementTechniques = (draftData?.engagementTechniques as string) ?? "";
  const duration = (draftData?.duration as string) ?? "";
  const impact = (draftData?.impact as string) ?? "";

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
      (theme && theme.trim() !== "") ||
        (tone && tone.trim() !== "") ||
        (audience && audience.trim() !== "") ||
        (languageStyle && languageStyle.trim() !== "") ||
        (engagementTechniques && engagementTechniques.trim() !== "") ||
        (duration && duration.trim() !== "") ||
        (impact && impact.trim() !== ""),
    );

    if (hasContent) {
      // clear visible fields immediately
      saveDraft("theme", "");
      saveDraft("tone", "");
      saveDraft("audience", "");
      saveDraft("languageStyle", "");
      saveDraft("engagementTechniques", "");
      saveDraft("duration", "");
      saveDraft("impact", "");

      // clear persisted storage as well
      clearDraft();

      // keep card open so user sees it's cleared
      return;
    }

    // already empty -> close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "speech",
          formData: {
            topic: theme,
            audience,
            length: duration,
            tone,
            keyMessages: engagementTechniques,
            callToAction: impact,
            languageStyle,
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
      console.error("Error generating speech prompt:", err);
    }
  };

  useClickOutside(showCard, () => setShowCard(false), "[data-speech-card]", "[data-speech-trigger]");

  

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-speech-trigger
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
            data-speech-card
            className="absolute left-[620px] top-[180px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Header + clear */}
                <div className="flex items-start justify-between pb-2 border-b border-pastel-lavender-hover">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎤</span>
                    <div>
                      <h3 className="font-semibold text-sidebar-text-violet text-lg">Speech</h3>
                      <p className="text-xs text-sidebar-text-dark italic">
                        Inspiring words crafted for audience and impact.
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

                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm font-medium text-sidebar-text-dark">
                    Theme
                  </Label>
                  <Input
                    id="theme"
                    value={theme}
                    onChange={(e) => saveDraft("theme", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Write your central idea..."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-sm font-medium text-sidebar-text-dark">
                    Tone
                  </Label>
                  <Input
                    id="tone"
                    value={tone}
                    onChange={(e) => saveDraft("tone", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Solemn, Motivational, Humorous etc."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-sm font-medium text-sidebar-text-dark">
                    Audience
                  </Label>
                  <Input
                    id="audience"
                    value={audience}
                    onChange={(e) => saveDraft("audience", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Students, Public, Leaders, Associations"
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language-style" className="text-sm font-medium text-sidebar-text-dark">
                    Language Style
                  </Label>
                  <Input
                    id="language-style"
                    value={languageStyle}
                    onChange={(e) => saveDraft("languageStyle", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Simple, Poetic, Technical, Rhetorical etc."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engagement-techniques" className="text-sm font-medium text-sidebar-text-dark">
                    Engagement Techniques
                  </Label>
                  <Input
                    id="engagement-techniques"
                    value={engagementTechniques}
                    onChange={(e) => saveDraft("engagementTechniques", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Stories, Questions, Humour, Quotes etc."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium text-sidebar-text-dark">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => saveDraft("duration", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Mention minutes or hours..."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impact" className="text-sm font-medium text-sidebar-text-dark">
                    Impact
                  </Label>
                  <Input
                    id="impact"
                    value={impact}
                    onChange={(e) => saveDraft("impact", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Memorable, Thought-provoking etc."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <Button
                  className="w-full bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white transition-colors duration-200"
                  onClick={handleGeneratePrompt}
                >
                  Deliver Speech
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechHoverCard;
