import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface BlogHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const BlogHoverCard: React.FC<BlogHoverCardProps> = ({ children, onPromptGenerated }) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "blog",
    initialData: {
      blogTitle: "",
      keywords: "",
      wordCount: "",
      voice: "",
      tone: "",
      audience: "",
      seoKeywords: "",
    },
  });

  // locals for convenience
  const blogTitle = draftData?.blogTitle ?? "";
  const keywords = draftData?.keywords ?? "";
  const wordCount = draftData?.wordCount ?? "";
  const voice = draftData?.voice ?? "";
  const tone = draftData?.tone ?? "";
  const audience = draftData?.audience ?? "";
  const seoKeywords = draftData?.seoKeywords ?? "";

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
      (blogTitle && blogTitle.trim() !== "") ||
        (keywords && keywords.trim() !== "") ||
        (wordCount && wordCount.trim() !== "") ||
        (voice && voice.trim() !== "") ||
        (tone && tone.trim() !== "") ||
        (audience && audience.trim() !== "") ||
        (seoKeywords && seoKeywords.trim() !== ""),
    );

    if (hasContent) {
      // immediately clear visible fields so UI updates right away
      saveDraft("blogTitle", "");
      saveDraft("keywords", "");
      saveDraft("wordCount", "");
      saveDraft("voice", "");
      saveDraft("tone", "");
      saveDraft("audience", "");
      saveDraft("seoKeywords", "");

      // clear persisted storage as well
      clearDraft();

      // keep card open so user can verify emptiness
      return;
    }

    // already empty → close card
    setShowCard(false);
  };

  const handleGeneratePrompt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
        body: {
          contentType: "blog",
          formData: {
            blogTitle,
            keywords,
            wordCount,
            voice,
            tone,
            audience,
            seoKeywords,
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

  useClickOutside(showCard, () => setShowCard(false), "[data-blog-card]", "[data-blog-trigger]");

  if (isLoading) return <div className="p-4">Loading draft...</div>;

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div
        data-blog-trigger
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
            data-blog-card
            className="absolute left-[620px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-fade-in duration-300">
              <div className="space-y-3">
                {/* Header + Clear button */}
                <div className="flex items-start justify-between pb-2 border-b border-pastel-lavender-hover">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    <div>
                      <h3 className="font-semibold text-sidebar-text-violet text-lg">Blog</h3>
                      <p className="text-xs text-sidebar-text-dark italic">
                        Conversational, engaging style for online readers — SEO-friendly and reader-focused.
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

                {/* Blog Title */}
                <div className="space-y-2">
                  <Label htmlFor="blog-title" className="text-sm font-medium text-sidebar-text-dark">
                    Blog Title
                  </Label>
                  <Input
                    id="blog-title"
                    value={blogTitle}
                    onChange={(e) => saveDraft("blogTitle", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter your blog title..."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-sm font-medium text-sidebar-text-dark">
                    Keywords
                  </Label>
                  <Input
                    id="keywords"
                    value={keywords}
                    onChange={(e) => saveDraft("keywords", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Add key phrases or focus keywords..."
                    className="text-sm placeholder:text-gray-500"
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
                    placeholder="600–2000 words"
                    min="600"
                    max="2000"
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                {/* Voice */}
                <div className="space-y-2">
                  <Label htmlFor="voice" className="text-sm font-medium text-sidebar-text-dark">
                    Voice
                  </Label>
                  <Input
                    id="voice"
                    value={voice}
                    onChange={(e) => saveDraft("voice", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Informative, Conversational, Persuasive"
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
                    placeholder="Friendly, Formal, Expert, Humorous"
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
                    placeholder="Professionals, Students, General Readers"
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                {/* SEO Keywords */}
                <div className="space-y-2">
                  <Label htmlFor="seo-keywords" className="text-sm font-medium text-sidebar-text-dark">
                    Primary Keywords for SEO
                  </Label>
                  <Input
                    id="seo-keywords"
                    value={seoKeywords}
                    onChange={(e) => saveDraft("seoKeywords", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Add your SEO keywords..."
                    className="text-sm placeholder:text-gray-500"
                    autoComplete="off"
                  />
                </div>

                {/* Publish Button */}
                <Button
                  className="w-full bg-sidebar-text-violet hover:bg-sidebar-text-violet/90 text-white transition-colors duration-200"
                  onClick={handleGeneratePrompt}
                >
                  Publish Blog
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogHoverCard;
