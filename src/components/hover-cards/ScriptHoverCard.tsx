import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface ScriptHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const ScriptHoverCard: React.FC<ScriptHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "script",
    initialData: {
      title: "",
      keyDetails: "",
      structure: "",
      theme: "",
      mood: "",
      format: "",
      audience: "",
    },
  });

  // locals
  const title = draftData?.title ?? "";
  const keyDetails = draftData?.keyDetails ?? "";
  const structure = draftData?.structure ?? "";
  const theme = draftData?.theme ?? "";
  const mood = draftData?.mood ?? "";
  const format = draftData?.format ?? "";
  const audience = draftData?.audience ?? "";

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowCard(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setShowCard(false), 250);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClearDraft = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    const hasContent = Boolean(
      (title && title.trim() !== "") ||
        (keyDetails && keyDetails.trim() !== "") ||
        (structure && structure.trim() !== "") ||
        (theme && theme.trim() !== "") ||
        (mood && mood.trim() !== "") ||
        (format && format.trim() !== "") ||
        (audience && audience.trim() !== ""),
    );

    if (hasContent) {
      // Immediately clear visible fields
      saveDraft("title", "");
      saveDraft("keyDetails", "");
      saveDraft("structure", "");
      saveDraft("theme", "");
      saveDraft("mood", "");
      saveDraft("format", "");
      saveDraft("audience", "");
      // Clear persisted storage
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
          contentType: "script",
          formData: {
            title,
            keyDetails,
            structure,
            theme,
            mood,
            format,
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

  useClickOutside(showCard, () => setShowCard(false), "[data-script-card]", "[data-script-trigger]");

  

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-script-trigger
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
            data-script-card
            className="absolute left-[620px] top-[140px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Header + Clear */}
                <div className="flex items-start justify-between pb-2 border-b border-pastel-lavender-hover">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎬</span>
                    <div>
                      <h3 className="font-semibold text-sidebar-text-violet text-lg">Script</h3>
                      <p className="text-xs text-sidebar-text-dark italic">
                        Dialogue-driven format for plays, films or skits.
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

                {/* Script Title */}
                <div className="space-y-2">
                  <Label htmlFor="script-title" className="text-sm font-medium text-sidebar-text-dark">
                    Script Title
                  </Label>
                  <Input
                    id="script-title"
                    value={title}
                    onChange={(e) => saveDraft("title", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter your script title..."
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Key Details */}
                <div className="space-y-2">
                  <Label htmlFor="key-details" className="text-sm font-medium text-sidebar-text-dark">
                    Key Details / Plot Points
                  </Label>
                  <Textarea
                    id="key-details"
                    value={keyDetails}
                    onChange={(e) => saveDraft("keyDetails", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Main characters, scenes, key movements..."
                    className="text-sm min-h-[70px] resize-none placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Structure */}
                <div className="space-y-2">
                  <Label htmlFor="structure" className="text-sm font-medium text-sidebar-text-dark">
                    Structure
                  </Label>
                  <Input
                    id="structure"
                    value={structure}
                    onChange={(e) => saveDraft("structure", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Long, Medium, Short, Micro"
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Theme */}
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm font-medium text-sidebar-text-dark">
                    Theme
                  </Label>
                  <Input
                    id="theme"
                    value={theme}
                    onChange={(e) => saveDraft("theme", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Identity, Revenge, Power, Love, etc."
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Mood */}
                <div className="space-y-2">
                  <Label htmlFor="mood" className="text-sm font-medium text-sidebar-text-dark">
                    Mood
                  </Label>
                  <Input
                    id="mood"
                    value={mood}
                    onChange={(e) => saveDraft("mood", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Romantic, Eerie, Dark, Light, Suspense"
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Format */}
                <div className="space-y-2">
                  <Label htmlFor="format" className="text-sm font-medium text-sidebar-text-dark">
                    Format
                  </Label>
                  <Input
                    id="format"
                    value={format}
                    onChange={(e) => saveDraft("format", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Screenplay, Radio, TV, Web Series"
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Audience */}
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-sm font-medium text-sidebar-text-dark">
                    Audience
                  </Label>
                  <Input
                    id="audience"
                    value={audience}
                    onChange={(e) => saveDraft("audience", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Children, Teens, Young Adults, Mature"
                    className="text-sm placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Start Button */}
                <Button
                  onClick={handleGeneratePrompt}
                  className="w-full mt-4 bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white font-medium"
                >
                  Craft Script
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptHoverCard;
