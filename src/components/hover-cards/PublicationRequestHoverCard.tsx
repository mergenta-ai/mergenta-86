import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";
import { useToast } from "@/hooks/use-toast";
import { useClickOutside } from "@/lib/clickOutside";

interface PublicationRequestHoverCardProps {
  children: React.ReactNode;
  onAddToChat?: (message: string, response: string) => void;
  onPromptGenerated?: (prompt: string) => void;
}

const PublicationRequestHoverCard = ({ children, onAddToChat, onPromptGenerated }: PublicationRequestHoverCardProps) => {
  const { toast } = useToast();
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "publication-request",
    initialData: {
      to: "",
      subject: "",
      workDetails: "",
      publicationDetails: "",
      signOff: "",
      from: "",
    },
  });

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

  const handleClearDraft = () => {
    const hasContent = Boolean(
      (draftData?.to && draftData.to.trim() !== "") ||
        (draftData?.subject && draftData.subject.trim() !== "") ||
        (draftData?.workDetails && draftData.workDetails.trim() !== "") ||
        (draftData?.publicationDetails && draftData.publicationDetails.trim() !== "") ||
        (draftData?.signOff && draftData.signOff.trim() !== "") ||
        (draftData?.from && draftData.from.trim() !== ""),
    );

    if (hasContent) {
      saveDraft("to", "");
      saveDraft("subject", "");
      saveDraft("workDetails", "");
      saveDraft("publicationDetails", "");
      saveDraft("signOff", "");
      saveDraft("from", "");
      clearDraft();
    }
  };

  const handleGeneratePrompt = () => {
    const prompt = `Generate a professional publication request letter with the following details:
To: ${draftData.to}
Subject: ${draftData.subject}
Work Details: ${draftData.workDetails}
Publication Details: ${draftData.publicationDetails}
Sign Off: ${draftData.signOff}
From: ${draftData.from}

Please create a formal, well-structured publication request letter.`;

    if (onPromptGenerated) {
      onPromptGenerated(prompt);
    }

    if (onAddToChat) {
      onAddToChat(prompt, "Generating your publication request letter...");
    }

    clearDraft();
    setShowCard(false);
  };

  // Close card when clicking outside
  useClickOutside(
    showCard,
    () => setShowCard(false),
    '[data-publication-request-card]',
    '[data-publication-request-trigger]'
  );

  if (isLoading) {
    return <div className="p-4">Loading draft...</div>;
  }

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div 
        data-publication-request-trigger
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
            data-publication-request-card
            className="absolute left-[918px] top-[160px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-6 bg-background rounded-lg shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Publication Request Letter</h3>
                <Button variant="ghost" size="icon" onClick={handleClearDraft} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="to" className="text-sm font-medium text-foreground">
                    To (Publisher/Editor)
                  </Label>
                  <Input
                    id="to"
                    placeholder="e.g., Editor-in-Chief, Journal Name"
                    value={draftData.to || ""}
                    onChange={(e) => saveDraft("to", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Request for Publication of Research Article"
                    value={draftData.subject || ""}
                    onChange={(e) => saveDraft("subject", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workDetails" className="text-sm font-medium text-foreground">
                    Work Details
                  </Label>
                  <Textarea
                    id="workDetails"
                    placeholder="Describe your work (title, abstract, key findings, etc.)"
                    value={draftData.workDetails || ""}
                    onChange={(e) => saveDraft("workDetails", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full min-h-[80px] resize-none"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicationDetails" className="text-sm font-medium text-foreground">
                    Publication Details
                  </Label>
                  <Textarea
                    id="publicationDetails"
                    placeholder="Publication venue, why it's suitable, any relevant background"
                    value={draftData.publicationDetails || ""}
                    onChange={(e) => saveDraft("publicationDetails", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full min-h-[80px] resize-none"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signOff" className="text-sm font-medium text-foreground">
                    Sign Off
                  </Label>
                  <Input
                    id="signOff"
                    placeholder="e.g., Sincerely, Best regards"
                    value={draftData.signOff || ""}
                    onChange={(e) => saveDraft("signOff", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from" className="text-sm font-medium text-foreground">
                    From
                  </Label>
                  <Input
                    id="from"
                    placeholder="Your name and credentials"
                    value={draftData.from || ""}
                    onChange={(e) => saveDraft("from", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full"
                    autoComplete="off"
                  />
                </div>

                <Button onClick={handleGeneratePrompt} className="w-full mt-4">
                  Generate Publication Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationRequestHoverCard;
