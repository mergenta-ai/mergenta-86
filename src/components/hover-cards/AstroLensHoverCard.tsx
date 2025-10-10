import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface AstroLensHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const AstroLensHoverCard: React.FC<AstroLensHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "astro_lens",
    initialData: {
      date: "",
      year: "",
      place: "",
      specific: "",
    },
  });

  // convenience locals
  const date = (draftData?.date as string) ?? "";
  const year = (draftData?.year as string) ?? "";
  const place = (draftData?.place as string) ?? "";
  const specific = (draftData?.specific as string) ?? "";

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
      (date && date.trim() !== "") ||
        (year && year.trim() !== "") ||
        (place && place.trim() !== "") ||
        (specific && specific.trim() !== ""),
    );

    if (hasContent) {
      // Immediately clear visible fields so UI updates right away
      saveDraft("date", "");
      saveDraft("year", "");
      saveDraft("place", "");
      saveDraft("specific", "");

      // Then clear persisted storage
      clearDraft();

      // Keep the card open so user sees empty fields
      return;
    }

    // already empty -> close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "astro_lens",
          formData: { date, year, place, specific },
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
  useClickOutside(showCard, () => setShowCard(false), "[data-astro-card]", "[data-astro-trigger]");

  if (isLoading) return <div className="p-4">Loading draft...</div>;

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-astro-trigger
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
            data-astro-card
            className="absolute left-[1052px] top-[360px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div
              className="p-4 border rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-200"
              style={{ backgroundColor: "#F3E8FB", borderColor: "#E5D9F2" }}
            >
              <div className="space-y-3">
                {/* Header + clear */}
                <div className="flex items-start justify-between pb-2 border-b" style={{ borderColor: "#E5D9F2" }}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-lg" style={{ color: "#5B34A0" }} />
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: "#5B34A0" }}>
                        Astro Lens
                      </h3>
                      <p className="text-xs italic" style={{ color: "#6E6E6E" }}>
                        Personal insights through planetary patterns.
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

                {/* Date of birth */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-sidebar-text-dark">
                    Date of birth
                  </Label>
                  <Input
                    id="date"
                    value={date}
                    onChange={(e) => saveDraft("date", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter your date of birth (DD/MM)"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Year of birth */}
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium text-sidebar-text-dark">
                    Year of birth
                  </Label>
                  <Input
                    id="year"
                    value={year}
                    onChange={(e) => saveDraft("year", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter your year of birth (YYYY)"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Place of birth */}
                <div className="space-y-2">
                  <Label htmlFor="place" className="text-sm font-medium text-sidebar-text-dark">
                    Place of Birth
                  </Label>
                  <Textarea
                    id="place"
                    value={place}
                    onChange={(e) => saveDraft("place", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Write city, state and country"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Specific info */}
                <div className="space-y-2">
                  <Label htmlFor="specific" className="text-sm font-medium text-sidebar-text-dark">
                    Specific information you seek
                  </Label>
                  <Textarea
                    id="specific"
                    value={specific}
                    onChange={(e) => saveDraft("specific", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Describe what you want to know in particular"
                    className="text-sm bg-white"
                    autoComplete="off"
                  />
                </div>

                {/* Action */}
                <Button
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: "#6C3EB6" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5B34A0")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6C3EB6")}
                  onClick={handleGeneratePrompt}
                >
                  Reveal Insights
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstroLensHoverCard;
