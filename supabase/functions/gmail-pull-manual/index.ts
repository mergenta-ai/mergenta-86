import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decrypt, encrypt } from "../_shared/encryption.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    parts?: Array<{ mimeType: string; body: { data?: string } }>;
    body?: { data?: string };
  };
  internalDate: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const logs: Array<{ timestamp: string; level: string; message: string }> = [];
  const log = (level: string, message: string) => {
    const entry = { timestamp: new Date().toISOString(), level, message };
    logs.push(entry);
    console.log(`[${level.toUpperCase()}] ${message}`);
  };

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Authentication failed");
    }

    log("info", `Manual pull triggered by user: ${user.id}`);

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleData?.role !== "admin") {
      throw new Error("Admin access required");
    }

    log("success", "Admin access verified");

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get ALL active Gmail connections
    const { data: connections, error: connError } = await adminSupabase
      .from("gmail_connections")
      .select("*");

    if (connError || !connections || connections.length === 0) {
      throw new Error("No Gmail connections found in the system");
    }

    log("info", `Found ${connections.length} Gmail connection(s) to process`);

    const accountsProcessed = [];
    let totalMessagesProcessed = 0;

    // Process each Gmail connection
    for (const connection of connections) {
      const accountLog: string[] = [];
      const accountLogger = (level: string, message: string) => {
        accountLog.push(`[${level.toUpperCase()}] ${message}`);
        log(level, `[${connection.gmail_email}] ${message}`);
      };

      try {
        accountLogger("info", `Processing account: ${connection.gmail_email}`);

        // Decrypt and refresh access token if needed
        let accessToken = decrypt(connection.encrypted_access_token);
        const expiresAt = new Date(connection.token_expires_at);

        if (expiresAt <= new Date()) {
          accountLogger("info", "Access token expired, refreshing...");
          accessToken = await refreshAccessToken(adminSupabase, connection);
          accountLogger("success", "Access token refreshed");
        }

        // Fetch email history from Gmail - initialize if needed
        let startHistoryId = connection.history_id;
        
        // If no history_id, establish baseline
        if (!startHistoryId) {
          accountLogger("info", "No history_id found, establishing baseline...");
          const profileUrl = `https://gmail.googleapis.com/gmail/v1/users/me/profile`;
          const profileResponse = await fetch(profileUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (!profileResponse.ok) {
            throw new Error(`Failed to fetch Gmail profile: ${profileResponse.status}`);
          }

          const profileData = await profileResponse.json();
          startHistoryId = profileData.historyId;

          // Update connection with baseline history_id
          await adminSupabase
            .from("gmail_connections")
            .update({
              history_id: startHistoryId,
              last_synced_at: new Date().toISOString(),
            })
            .eq("id", connection.id);

          accountLogger("success", `Baseline established with history_id: ${startHistoryId}`);
          
          accountsProcessed.push({
            email: connection.gmail_email,
            user_id: connection.user_id,
            status: "baseline_established",
            messages_found: 0,
            drafts_created: 0,
            logs: accountLog,
          });
          continue;
        }

        accountLogger("info", `Fetching history starting from: ${startHistoryId}`);

        const historyUrl = `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${startHistoryId}&historyTypes=messageAdded`;
        const historyResponse = await fetch(historyUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!historyResponse.ok) {
          const errorText = await historyResponse.text();
          accountLogger("error", `Gmail history API error: ${historyResponse.status} - ${errorText}`);
          throw new Error(`Failed to fetch Gmail history: ${historyResponse.status}`);
        }

        const historyData = await historyResponse.json();
        accountLogger("info", `History response received. New historyId: ${historyData.historyId}`);

        const history = historyData.history || [];
        const messages: GmailMessage[] = [];

        // Extract new messages from history
        for (const item of history) {
          if (item.messagesAdded) {
            for (const added of item.messagesAdded) {
              messages.push(added.message);
            }
          }
        }

        accountLogger("info", `Found ${messages.length} new messages`);

        if (messages.length === 0) {
          // Update history_id even if no messages
          await adminSupabase
            .from("gmail_connections")
            .update({
              history_id: historyData.historyId,
              last_synced_at: new Date().toISOString(),
            })
            .eq("id", connection.id);

          accountLogger("info", "No new messages to process");
          accountsProcessed.push({
            email: connection.gmail_email,
            user_id: connection.user_id,
            status: "no_new_messages",
            messages_found: 0,
            drafts_created: 0,
            logs: accountLog,
          });
          continue;
        }

        // Import shared email processor
        const { processEmail } = await import("../_shared/email-processor.ts");
        const processedMessages = [];
        
        for (const message of messages) {
          try {
            accountLogger("info", `Processing message: ${message.id}`);
            
            // Fetch full message details
            const messageUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`;
            const messageResponse = await fetch(messageUrl, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!messageResponse.ok) {
              throw new Error(`Failed to fetch message: ${messageResponse.status}`);
            }

            const fullMessage: GmailMessage = await messageResponse.json();
            const headers = fullMessage.payload.headers;
            const subject = headers.find((h) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
            const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "";
            const senderName = from.split('<')[0].trim() || undefined;
            const senderEmail = from.match(/<(.+)>/)?.[1] || from;

            let body = "";
            if (fullMessage.payload.parts) {
              const textPart = fullMessage.payload.parts.find((p) => p.mimeType === "text/plain");
              if (textPart?.body?.data) {
                body = atob(textPart.body.data.replace(/-/g, "+").replace(/_/g, "/"));
              }
            } else if (fullMessage.payload.body?.data) {
              body = atob(fullMessage.payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
            }

            const emailData = {
              id: fullMessage.id,
              threadId: fullMessage.threadId,
              sender: senderEmail,
              senderName,
              subject,
              body,
              snippet: fullMessage.snippet
            };

            const result = await processEmail(
              adminSupabase,
              connection.user_id,
              emailData,
              accessToken,
              connection.default_reply_mode || 'draft',
              'pull_manual'
            );

            processedMessages.push({
              messageId: message.id,
              success: true,
              action: result.action,
              from: senderEmail,
              subject,
              rule: result.ruleApplied?.sender_name || result.ruleApplied?.sender_email
            });
            
            accountLogger("success", `Processed message ${message.id}: ${result.action}`);
          } catch (error: any) {
            accountLogger("error", `Failed to process message ${message.id}: ${error.message}`);
            processedMessages.push({
              messageId: message.id,
              success: false,
              error: error.message,
            });
          }
        }

        // Update history_id
        await adminSupabase
          .from("gmail_connections")
          .update({
            history_id: historyData.historyId,
            last_synced_at: new Date().toISOString(),
          })
          .eq("id", connection.id);

        const successfulMessages = processedMessages.filter(m => m.success !== false).length;
        accountLogger("success", `Updated history_id to: ${historyData.historyId}`);
        accountLogger("success", `Processing complete: ${successfulMessages}/${messages.length} successful`);

        totalMessagesProcessed += messages.length;

        accountsProcessed.push({
          email: connection.gmail_email,
          user_id: connection.user_id,
          status: "success",
          messages_found: messages.length,
          drafts_created: successfulMessages,
          results: processedMessages,
          logs: accountLog,
        });

      } catch (error: any) {
        accountLogger("error", `Account processing failed: ${error.message}`);
        accountsProcessed.push({
          email: connection.gmail_email,
          user_id: connection.user_id,
          status: "error",
          messages_found: 0,
          drafts_created: 0,
          error: error.message,
          logs: accountLog,
        });
      }
    }

    const successfulAccounts = accountsProcessed.filter(a => a.status === "success" || a.status === "baseline_established" || a.status === "no_new_messages").length;

    return new Response(
      JSON.stringify({
        success: true,
        logs,
        accounts_processed: accountsProcessed,
        total_accounts: connections.length,
        successful_accounts: successfulAccounts,
        total_messages: totalMessagesProcessed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    log("error", `Pull failed: ${error.message}`);
    console.error("Error in gmail-pull-manual:", error);

    return new Response(
      JSON.stringify({ success: false, logs, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function refreshAccessToken(supabase: any, connection: any): Promise<string> {
  const refreshToken = decrypt(connection.encrypted_refresh_token);
  const clientId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  const encryptedAccessToken = encrypt(data.access_token);
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  await supabase
    .from("gmail_connections")
    .update({
      encrypted_access_token: encryptedAccessToken,
      token_expires_at: expiresAt.toISOString(),
    })
    .eq("id", connection.id);

  return data.access_token;
}
