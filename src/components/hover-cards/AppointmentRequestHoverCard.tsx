import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar, X } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useClickOutside } from "@/lib/clickOutside";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface AppointmentRequestHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const AppointmentRequestHoverCard = ({ children, onPromptGenerated }: AppointmentRequestHoverCardProps) => {
  const [showCard, setShowCard] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { draftData, saveDraft, clearDraft, isLoading } = useDraftPersistence({
    cardId: "appointment-request",
    initialData: { to: "", subject: "", coreMessage: "", finalTouch: "", signOff: "", from: "" },
  });

  // always-string locals to avoid controlled/uncontrolled issues
  const to = draftData?.to ?? "";
  const subject = draftData?.subject ?? "";
  const coreMessage = draftData?.coreMessage ?? "";
  const finalTouch = draftData?.finalTouch ?? "";
  const signOff = draftData?.signOff ?? "";
  const from = draftData?.from ?? "";

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClearDraft = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    const hasContent = Boolean(
      (to && to.toString().trim() !== "") ||
        (subject && subject.toString().trim() !== "") ||
        (coreMessage && coreMessage.toString().trim() !== "") ||
        (finalTouch && finalTouch.toString().trim() !== "") ||
        (signOff && signOff.toString().trim() !== "") ||
        (from && from.toString().trim() !== ""),
    );

    if (hasContent) {
      // Immediately clear visible fields
      saveDraft("to", "");
      saveDraft("subject", "");
      saveDraft("coreMessage", "");
      saveDraft("finalTouch", "");
      saveDraft("signOff", "");
      saveDraft("from", "");
      // Clear persisted storage
      clearDraft();
      return; // keep card open
    }

    // already empty -> close card
    setShowCard(false);
  };

  // Close card when clicking outside
  useClickOutside(
    showCard,
    () => setShowCard(false),
    "[data-appointment-request-card]",
    "[data-appointment-request-trigger]",
  );

  if (isLoading) return <div className="p-4">Loading draft...</div>;

  return (
    <div className="relative">
      {/* Trigger Element — click to open */}
      <div data-appointment-request-trigger onClick={() => setShowCard(true)}>
        {children}
      </div>

      {/* Card overlay (accepts clicks) */}
      {showCard && (
        <div className="fixed inset-0 z-[200]">
          <div
            data-appointment-request-card
            className="absolute left-[918px] top-[220px] w-80 pointer-events-auto"
            onClick={handleCardClick}
          >
            <div className="p-6 bg-pastel-lavender rounded-2xl shadow-lg border border-[#E5D9F2] animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-5 h-5 text-[#5B34A0]" />
                      <h3 className="text-lg font-semibold text-[#5B34A0]">Appointment Request</h3>
                    </div>
                    <p className="text-sm text-[#6E6E6E] mb-4">Request appointment or meeting</p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-[#6C3EB6] hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90 group"
                    onClick={(e) => handleClearDraft(e)}
                    title="Clear draft"
                  >
                    <X className="h-4 w-4 text-[#5B34A0] group-hover:text-white transition-colors duration-300" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">To</label>
                    <Textarea
                      value={to}
                      onChange={(e) => saveDraft("to", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Dear Sir/Madam, HR Manager / Company Name, CA, Honourable Minister, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Subject / Purpose</label>
                    <Textarea
                      value={subject}
                      onChange={(e) => saveDraft("subject", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Request for Appointment/Interview etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Core Message</label>
                    <Textarea
                      value={coreMessage}
                      onChange={(e) => saveDraft("coreMessage", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Write about job interview, partnership, discussion, intervention, deals, consultation, problems, contract discussion, etc..."
                      className="w-full min-h-[80px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Final Touch</label>
                    <Textarea
                      value={finalTouch}
                      onChange={(e) => saveDraft("finalTouch", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Preferred appointment date and time..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">Sign Off</label>
                    <Textarea
                      value={signOff}
                      onChange={(e) => saveDraft("signOff", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Sincerely yours, Respectfully yours, Yours truly, Best regards, etc..."
                      className="w-full min-h-[60px] resize-none"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#5B34A0] mb-1 block">From</label>
                    <Input
                      value={from}
                      onChange={(e) => saveDraft("from", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Your Name"
                      className="w-full"
                      autoComplete="off"
                    />
                  </div>

                  <button
                    className="w-full py-3 bg-[#6C3EB6] text-white font-medium rounded-lg hover:bg-[#5B34A0] transition-colors"
                    onClick={async () => {
                      try {
                        const { data, error } = await supabase.functions.invoke("prompt-engine-consolidated", {
                          body: {
                            contentType: "appointment_request",
                            formData: { to, subject, coreMessage, finalTouch, signOff, from },
                          },
                        });
                        if (error) throw error;
                        if (data?.success && data?.prompt) {
                          onPromptGenerated?.(data.prompt);
                          clearDraft();
                          setShowCard(false);
                        }
                      } catch (error) {
                        console.error("Error generating prompt:", error);
                      }
                    }}
                  >
                    Request Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentRequestHoverCard;
