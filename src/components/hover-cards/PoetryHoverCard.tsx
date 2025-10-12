import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface PoetryHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const PoetryHoverCard: React.FC<PoetryHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "poetry",
    initialData: {
      poemTitle: "",
      form: "",
      keyLines: "",
      lineCount: "",
      tone: "",
      audience: "",
    },
  });

  // convenience locals
  const poemTitle = draftData?.poemTitle ?? "";
  const form = draftData?.form ?? "";
  const keyLines = draftData?.keyLines ?? "";
  const lineCount = draftData?.lineCount ?? "";
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
      (poemTitle && poemTitle.trim() !== "") ||
        (form && form.trim() !== "") ||
        (keyLines && keyLines.trim() !== "") ||
        (lineCount && lineCount.trim() !== "") ||
        (tone && tone.trim() !== "") ||
        (audience && audience.trim() !== ""),
    );

    if (hasContent) {
      // immediately clear visible fields
      saveDraft("poemTitle", "");
      saveDraft("form", "");
      saveDraft("keyLines", "");
      saveDraft("lineCount", "");
      saveDraft("tone", "");
      saveDraft("audience", "");

      // clear persisted storage as well
      clearDraft();

      // keep card open so user sees emptied fields
      return;
    }

    // already empty -> close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "poetry",
          formData: { poemTitle, form, keyLines, lineCount, tone, audience },
        },
      });

      if (error) throw error;

      if (data?.success && data?.prompt) {
        onPromptGenerated?.(data.prompt);
        clearDraft();
        setShowCard(false);
      }
    } catch (err) {
      console.error("Error generating poetry prompt:", err);
    }
  };

  useClickOutside(showCard, () => setShowCard(false), "[data-poetry-card]", "[data-poetry-trigger]");

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-poetry-trigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowCard(!showCard)}
      >
        {children}
      </div>

      {showCard && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          <div
            data-poetry-card
            className="absolute left-[610px] top-[180px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Header + clear */}
                <div className="flex items-start justify-between pb-2 border-b border-pastel-lavender-hover">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✒️</span>
                    <div>
                      <h3 className="font-semibold text-sidebar-text-violet text-lg">Poetry</h3>
                      <p className="text-xs text-sidebar-text-dark italic">
                        Create poems: sonnets, free verse, haiku and more.
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
                  <Label htmlFor="poem-title" className="text-sm font-medium text-sidebar-text-dark">
                    Poem Title
                  </Label>
                  <Input
                    id="poem-title"
                    value={poemTitle}
                    onChange={(e) => saveDraft("poemTitle", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="A title or theme for the poem..."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form" className="text-sm font-medium text-sidebar-text-dark">
                    Form
                  </Label>
                  <Input
                    id="form"
                    value={form}
                    onChange={(e) => saveDraft("form", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Free verse, Sonnet, Haiku, Limerick, etc."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-lines" className="text-sm font-medium text-sidebar-text-dark">
                    Key lines / images
                  </Label>
                  <Textarea
                    id="key-lines"
                    value={keyLines}
                    onChange={(e) => saveDraft("keyLines", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Any lines, images, metaphors or phrases to include..."
                    className="text-sm min-h-[70px] resize-none placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line-count" className="text-sm font-medium text-sidebar-text-dark">
                    Line / Length
                  </Label>
                  <Input
                    id="line-count"
                    type="number"
                    value={lineCount}
                    onChange={(e) => saveDraft("lineCount", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="e.g., 3 (haiku), 14 (sonnet), or leave blank"
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-sm font-medium text-sidebar-text-dark">
                    Tone / Mood
                  </Label>
                  <Input
                    id="tone"
                    value={tone}
                    onChange={(e) => saveDraft("tone", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Melancholic, Joyful, Bittersweet, Romantic, etc."
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
                    placeholder="General readers, Child, Partner, Audience type..."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                <Button
                  className="w-full bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white transition-colors duration-200"
                  onClick={handleGeneratePrompt}
                >
                  Compose Poem
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoetryHoverCard;
