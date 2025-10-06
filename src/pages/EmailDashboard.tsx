import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowLeft, Settings } from "lucide-react";
import { SenderRulesPanel } from "@/components/email/SenderRulesPanel";
import { ProcessingHistory } from "@/components/email/ProcessingHistory";
import { ProcessingStats } from "@/components/email/ProcessingStats";

export default function EmailDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pulling, setPulling] = useState(false);
  const [connection, setConnection] = useState<any>(null);
  const [replyMode, setReplyMode] = useState("draft");
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    fetchConnection();
  }, []);

  const fetchConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("gmail_connections")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      setConnection(data);
      setReplyMode(data.default_reply_mode || "draft");
    } catch (error) {
      console.error("Error fetching connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePullEmails = async () => {
    setPulling(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("gmail-pull-user", {
        body: {},
      });

      if (error) throw error;

      setResults(data);
      toast.success(`Processed ${data.processed} emails, skipped ${data.skipped}`);
    } catch (error: any) {
      console.error("Error pulling emails:", error);
      toast.error(error.message || "Failed to pull emails");
    } finally {
      setPulling(false);
    }
  };

  const handleUpdateReplyMode = async (mode: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("gmail_connections")
        .update({ default_reply_mode: mode })
        .eq("user_id", user.id);

      if (error) throw error;

      setReplyMode(mode);
      toast.success("Reply mode updated");
    } catch (error) {
      console.error("Error updating reply mode:", error);
      toast.error("Failed to update reply mode");
    }
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase.functions.invoke("gmail-disconnect");
      if (error) throw error;

      toast.success("Gmail disconnected");
      setConnection(null);
    } catch (error) {
      console.error("Error disconnecting:", error);
      toast.error("Failed to disconnect Gmail");
    }
  };

  const handleConnect = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("gmail-oauth-authorize");
      if (error) throw error;

      window.open(data.authUrl, "_blank", "width=600,height=700");
      
      // Poll for connection
      const checkConnection = setInterval(async () => {
        await fetchConnection();
        if (connection) {
          clearInterval(checkConnection);
          toast.success("Gmail connected successfully");
        }
      }, 2000);

      setTimeout(() => clearInterval(checkConnection), 60000);
    } catch (error) {
      console.error("Error connecting Gmail:", error);
      toast.error("Failed to initiate Gmail connection");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Email Automation</h1>
            <p className="text-muted-foreground mt-2">
              Manage your Gmail connection and automated responses
            </p>
          </div>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Gmail Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {connection ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Connected to: {connection.gmail_email}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Connected on {new Date(connection.connected_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDisconnect}>
                      Disconnect
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">No Gmail connected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Connect your Gmail to enable automated responses
                    </p>
                  </div>
                  <Button onClick={handleConnect}>
                    Connect Gmail
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {connection && (
            <>
              {/* Sender Rules */}
              <SenderRulesPanel />

              {/* Pull Emails */}
              <Card>
                <CardHeader>
                  <CardTitle>Process Emails</CardTitle>
                  <CardDescription>
                    Fetch unread emails and generate AI-powered draft responses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handlePullEmails}
                    disabled={pulling}
                    className="w-full"
                  >
                    {pulling ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing Emails...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Pull New Emails
                      </>
                    )}
                  </Button>

                  {results && (
                    <div className="space-y-3">
                      <Separator />
                      <div className="flex gap-4">
                        <Badge variant="outline">
                          Total: {results.total}
                        </Badge>
                        <Badge variant="default">
                          Processed: {results.processed}
                        </Badge>
                        <Badge variant="secondary">
                          Skipped: {results.skipped}
                        </Badge>
                      </div>

                      {results.results && results.results.length > 0 && (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {results.results.map((result: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-3 border rounded-lg space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{result.from}</span>
                                <Badge
                                  variant={result.status === "processed" ? "default" : "destructive"}
                                >
                                  {result.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {result.subject}
                              </p>
                              {result.error && (
                                <p className="text-xs text-destructive">{result.error}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Reply Settings
                  </CardTitle>
                  <CardDescription>
                    Choose how Mergenta should handle drafted replies by default
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={replyMode} onValueChange={handleUpdateReplyMode}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="draft" id="draft" />
                      <Label htmlFor="draft" className="font-normal cursor-pointer">
                        Save as draft (recommended)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="send" id="send" />
                      <Label htmlFor="send" className="font-normal cursor-pointer">
                        Send automatically
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium">Automation Status: OFF</p>
                    <p className="text-muted-foreground">Mode: {replyMode === "draft" ? "Draft" : "Send"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Processing History */}
              <ProcessingHistory />

              {/* Statistics */}
              <ProcessingStats />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
