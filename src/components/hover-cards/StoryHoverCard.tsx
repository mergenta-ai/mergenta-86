import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface StoryHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const StoryHoverCard: React.FC<StoryHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "story",
    initialData: {
      title: "",
      genre: "",
      keyDetails: "",
      wordCount: "",
      tone: "",
      audience: "",
    },
  });

  // stable locals (strings)
  const title = draftData?.title ?? "";
  const genre = draftData?.genre ?? "";
  const keyDetails = draftData?.keyDetails ?? "";
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
    closeTimeoutRef.current = setTimeout(() => setShowCard(false), 250);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClearDraft = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    const hasContent = Boolean(
      (title && title.trim() !== "") ||
        (genre && genre.trim() !== "") ||
        (keyDetails && keyDetails.trim() !== "") ||
        (wordCount && wordCount.trim() !== "") ||
        (tone && tone.trim() !== "") ||
        (audience && audience.trim() !== ""),
    );

    if (hasContent) {
      // update visible fields immediately
      saveDraft("title", "");
      saveDraft("genre", "");
      saveDraft("keyDetails", "");
      saveDraft("wordCount", "");
      saveDraft("tone", "");
      saveDraft("audience", "");
      // clear persisted storage
      clearDraft();
      return; // keep card open so user sees empty fields
    }

    // already empty -> close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "story",
          formData: {
            title,
            genre,
            keyDetails,
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
      console.error("Error generating story prompt:", err);
    }
  };

  // Close card when clicking outside
  useClickOutside(showCard, () => setShowCard(false), "[data-story-card]", "[data-story-trigger]");

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-story-trigger
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
            data-story-card
            className="absolute left-[620px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Header + Clear */}
                <div className="flex items-start justify-between pb-2 border-b border-pastel-lavender-hover">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📖</span>
                    <div>
                      <h3 className="font-semibold text-sidebar-text-violet text-lg">Story</h3>
                      <p className="text-xs text-sidebar-text-dark italic">
                        Longer narrative with characters, plot and detail.
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

                {/* Story Title */}
                <div className="space-y-2">
                  <Label htmlFor="story-title" className="text-sm font-medium text-sidebar-text-dark">
                    Story Title
                  </Label>
                  <Input
                    id="story-title"
                    value={title}
                    onChange={(e) => saveDraft("title", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter your story title..."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-sm font-medium text-sidebar-text-dark">
                    Genre
                  </Label>
                  <Input
                    id="genre"
                    value={genre}
                    onChange={(e) => saveDraft("genre", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Fantasy, Mystery, Romance, Sci-Fi etc."
                    className="text-sm placeholder:text-gray-500"
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
                    placeholder="Main characters, plot points, key events..."
                    className="text-sm min-h-[70px] resize-none placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                {/* Word Count */}
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
                    placeholder="500–2000"
                    min={500}
                    max={5000}
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-sm font-medium text-sidebar-text-dark">
                    Tone
                  </Label>
                  <Input
                    id="tone"
                    value={tone}
                    onChange={(e) => saveDraft("tone", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Descriptive, Humorous, Passionate etc."
                    className="text-sm placeholder:text-gray-500"
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
                    placeholder="Children, Young Adults, Mature etc."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                {/* Button */}
                <Button
                  className="w-full bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white transition-colors duration-200"
                  onClick={handleGeneratePrompt}
                >
                  Begin Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryHoverCard;
