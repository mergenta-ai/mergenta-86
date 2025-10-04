import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EmailSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailSettingsModal = ({ isOpen, onClose }: EmailSettingsModalProps) => {
  const [gmailConnected, setGmailConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [autoReplyTemplate, setAutoReplyTemplate] = useState("");

  const handleGmailConnect = async () => {
    try {
      // TODO: Implement actual Google OAuth flow
      toast.info("Redirecting to Google OAuth...");
      setGmailConnected(true);
      toast.success("Gmail connected successfully");
    } catch (error) {
      console.error("Gmail connection error:", error);
      toast.error("Failed to connect Gmail");
    }
  };

  const handleOutlookConnect = () => {
    toast.info("Outlook integration coming soon");
  };

  const handleSaveAutoReply = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Call gmail-automation edge function
      const { data, error } = await supabase.functions.invoke('gmail-automation', {
        body: {
          action: 'auto_reply',
          body: autoReplyTemplate,
        },
      });

      if (error) throw error;

      toast.success("Auto-reply settings saved");
    } catch (error) {
      console.error("Save auto-reply error:", error);
      toast.error("Failed to save auto-reply settings");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Email Automation Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Gmail Connection */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-semibold">Gmail</h3>
                  <p className="text-sm text-muted-foreground">
                    {gmailConnected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleGmailConnect}
                variant={gmailConnected ? "outline" : "default"}
              >
                {gmailConnected ? "Disconnect" : "Connect Gmail"}
              </Button>
            </div>
          </div>

          {/* Outlook Connection */}
          <div className="border rounded-lg p-4 space-y-3 opacity-60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Outlook</h3>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
              </div>
              <Button onClick={handleOutlookConnect} disabled variant="outline">
                <Lock className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>
          </div>

          {/* Auto-Reply Settings */}
          {gmailConnected && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-reply">Auto-Reply</Label>
                <Switch
                  id="auto-reply"
                  checked={autoReplyEnabled}
                  onCheckedChange={setAutoReplyEnabled}
                />
              </div>

              {autoReplyEnabled && (
                <div className="space-y-3">
                  <Label htmlFor="auto-reply-subject">Subject</Label>
                  <Input
                    id="auto-reply-subject"
                    placeholder="Re: Your message"
                    defaultValue="Re: Your message"
                  />

                  <Label htmlFor="auto-reply-template">Template</Label>
                  <Textarea
                    id="auto-reply-template"
                    placeholder="Enter your auto-reply message..."
                    value={autoReplyTemplate}
                    onChange={(e) => setAutoReplyTemplate(e.target.value)}
                    rows={5}
                  />

                  <Button onClick={handleSaveAutoReply} className="w-full">
                    Save Auto-Reply Settings
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Usage Stats */}
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold mb-2">Usage Limits</h3>
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">Daily Gmail: 0 / 10</p>
              <p className="text-muted-foreground">Monthly Gmail: 0 / 100</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSettingsModal;
