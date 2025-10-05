import { useState, useEffect } from "react";
import * as React from "react";
import { Dialog, DialogOverlay, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Mail, X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Custom DialogContent without automatic close button - styled like SnapshotModal
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg border-4 border-mergenta-violet/30",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
CustomDialogContent.displayName = "CustomDialogContent";

interface EmailSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailSettingsModal = ({ isOpen, onClose }: EmailSettingsModalProps) => {
  const navigate = useNavigate();
  const { planType, loading: planLoading } = useUserPlan();
  
  const [gmailConnection, setGmailConnection] = useState<any>(null);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [connectingGmail, setConnectingGmail] = useState(false);
  const [disconnectingGmail, setDisconnectingGmail] = useState(false);
  const [defaultReplyMode, setDefaultReplyMode] = useState<"send" | "draft">("draft");

  useEffect(() => {
    if (isOpen) {
      fetchGmailConnection();
    }
  }, [isOpen]);

  const fetchGmailConnection = async () => {
    try {
      setLoadingConnection(true);
      const { data, error } = await supabase
        .from("gmail_connections")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching connection:", error);
        return;
      }

      if (data) {
        setGmailConnection(data);
        const mode = data.default_reply_mode === "send" ? "send" : "draft";
        setDefaultReplyMode(mode);
      } else {
        setGmailConnection(null);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingConnection(false);
    }
  };

  const handleGmailConnect = async () => {
    if (!planType || planLoading) {
      toast.info("Loading", { description: "Checking your plan..." });
      return;
    }

    if (!["zip", "max"].includes(planType)) {
      const upgradeMessage =
        planType === "ace"
          ? "Upgrade to the Max plan to unlock Gmail automation."
          : "Gmail automation is available from the Zip plan. Please upgrade to connect Gmail.";

      toast.warning("Upgrade Required", {
        description: upgradeMessage,
        action: {
          label: "View Plans",
          onClick: () => {
            onClose();
            navigate("/plans");
          },
        },
      });
      return;
    }

    try {
      setConnectingGmail(true);

      const { data, error } = await supabase.functions.invoke("gmail-oauth-authorize");

      if (error) throw error;

      if (data.error === "plan_upgrade_required") {
        toast.warning("Upgrade Required", {
          description: data.message,
          action: {
            label: "View Plans",
            onClick: () => {
              onClose();
              navigate("/plans");
            },
          },
        });
        return;
      }

      const popup = window.open(
        data.authUrl,
        "Gmail OAuth",
        "width=600,height=700,left=200,top=100"
      );

      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === "gmail-oauth-success") {
          toast.success("Gmail Connected", {
            description: `Connected to ${event.data.email}`,
          });
          fetchGmailConnection();
          window.removeEventListener("message", messageHandler);
        } else if (event.data.type === "gmail-oauth-error") {
          toast.error("Connection Failed", {
            description: event.data.error || "Failed to connect Gmail",
          });
          window.removeEventListener("message", messageHandler);
        }
      };

      window.addEventListener("message", messageHandler);

      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup);
          setConnectingGmail(false);
          window.removeEventListener("message", messageHandler);
        }
      }, 500);
    } catch (error: any) {
      console.error("Error connecting Gmail:", error);
      toast.error("Error", {
        description: error.message || "Failed to initiate Gmail connection",
      });
    } finally {
      setConnectingGmail(false);
    }
  };

  const handleGmailDisconnect = async () => {
    try {
      setDisconnectingGmail(true);

      const { error } = await supabase.functions.invoke("gmail-disconnect");

      if (error) throw error;

      toast.success("Gmail Disconnected", {
        description: "Your Gmail account has been disconnected",
      });

      setGmailConnection(null);
    } catch (error: any) {
      console.error("Error disconnecting Gmail:", error);
      toast.error("Error", {
        description: error.message || "Failed to disconnect Gmail",
      });
    } finally {
      setDisconnectingGmail(false);
    }
  };

  const handleUpdateReplyMode = async (mode: "send" | "draft") => {
    if (!gmailConnection) return;

    try {
      const { error } = await supabase
        .from("gmail_connections")
        .update({ default_reply_mode: mode })
        .eq("user_id", gmailConnection.user_id);

      if (error) throw error;

      setDefaultReplyMode(mode);
      toast.success("Settings Updated", {
        description: `Default reply mode set to ${mode === "send" ? "Send Automatically" : "Save as Draft"}`,
      });
    } catch (error: any) {
      console.error("Error updating reply mode:", error);
      toast.error("Error", { description: "Failed to update settings" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-gradient-to-br from-mergenta-deep-violet/80 via-mergenta-violet/70 to-mergenta-magenta/60 backdrop-blur-lg" />
      <CustomDialogContent className="max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <DialogHeader className="text-center mb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-mergenta-violet/10">
              <Mail className="h-8 w-8 text-mergenta-violet" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold text-mergenta-deep-violet">Connect your Gmail</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">Configure Gmail automation settings</p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {loadingConnection ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Gmail Section */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Gmail Connection</h3>
                    {gmailConnection ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Connected to:</span>
                          <span className="text-muted-foreground">
                            {gmailConnection.gmail_email}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Connected on {new Date(gmailConnection.connected_at).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        To let Mergenta read and reply to your emails we need your permission from Google. 
                        Click Connect with Google and follow the secure sign-in. Mergenta will not see your password.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {gmailConnection ? (
                    <Button
                      onClick={handleGmailDisconnect}
                      variant="outline"
                      disabled={disconnectingGmail}
                    >
                      {disconnectingGmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Disconnecting...
                        </>
                      ) : (
                        "Disconnect Gmail"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleGmailConnect}
                      disabled={connectingGmail || planLoading}
                    >
                      {connectingGmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Connect Gmail"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      toast.info("Required Permissions", {
                        description: "Mergenta requires: Read emails, Send emails, and Modify labels. These permissions allow us to read incoming emails, draft replies, and organize your inbox.",
                      });
                    }}
                  >
                    Why we need this
                  </Button>
                </div>
              </div>

              {/* Default Reply Mode */}
              {gmailConnection && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Default Reply Mode</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose how Mergenta should handle drafted replies by default
                      </p>
                    </div>

                    <RadioGroup
                      value={defaultReplyMode}
                      onValueChange={(value) => handleUpdateReplyMode(value as "send" | "draft")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="send" id="send" />
                        <Label htmlFor="send" className="font-normal cursor-pointer">
                          Send automatically
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="draft" id="draft" />
                        <Label htmlFor="draft" className="font-normal cursor-pointer">
                          Save as draft
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                      <strong>Automation Status:</strong>{" "}
                      {gmailConnection.auto_reply_enabled ? "ON" : "OFF"}
                      {" • "}
                      <strong>Mode:</strong>{" "}
                      {defaultReplyMode === "send" ? "Send" : "Draft"}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Outlook Section */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      Outlook <span className="text-sm font-normal text-muted-foreground">(Coming Soon)</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Microsoft Outlook integration will be available soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage Limits */}
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Usage Limits</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Zip Plan:</strong> 150 emails/day, 1,500/month
                  <br />
                  <strong>Max Plan:</strong> 300 emails/day, 3,000/month
                  <br />
                  <br />
                  Check your account page for current usage. Automation pauses when limits are reached.
                </p>
              </div>
            </>
          )}
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export default EmailSettingsModal;
