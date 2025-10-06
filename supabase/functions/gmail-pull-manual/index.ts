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

        const processedMessages = [];
        for (const message of messages) {
          try {
            accountLogger("info", `Processing message: ${message.id}`);
            const result = await processMessage(message.id, accessToken, connection, adminSupabase);
            processedMessages.push(result);
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

async function processMessage(
  messageId: string,
  accessToken: string,
  connection: any,
  supabase: any
): Promise<any> {
  const messageUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
  const messageResponse = await fetch(messageUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!messageResponse.ok) {
    throw new Error(`Failed to fetch message: ${messageResponse.status}`);
  }

  const message: GmailMessage = await messageResponse.json();

  const headers = message.payload.headers;
  const subject = headers.find((h) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
  const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "";
  const to = headers.find((h) => h.name.toLowerCase() === "to")?.value || "";

  let body = "";
  if (message.payload.parts) {
    const textPart = message.payload.parts.find((p) => p.mimeType === "text/plain");
    if (textPart?.body?.data) {
      body = atob(textPart.body.data.replace(/-/g, "+").replace(/_/g, "/"));
    }
  } else if (message.payload.body?.data) {
    body = atob(message.payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
  }

  // Generate AI response
  const aiResponse = await generateEmailResponse(subject, from, body);
  console.log(`[INFO] Generated AI response length: ${aiResponse.length} chars`);

  // Create draft or send based on settings
  if (connection.auto_reply_enabled && connection.default_reply_mode === "send") {
    await sendReply(messageId, message.threadId, subject, from, to, aiResponse, accessToken);
    return {
      messageId,
      success: true,
      action: "sent",
      from,
      subject,
    };
  } else {
    await createDraft(messageId, message.threadId, subject, from, to, aiResponse, accessToken);
    return {
      messageId,
      success: true,
      action: "draft_created",
      from,
      subject,
    };
  }
}

async function generateEmailResponse(subject: string, from: string, body: string): Promise<string> {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const prompt = `You are an email assistant. Generate a professional and helpful reply to this email.

From: ${from}
Subject: ${subject}

Email content:
${body}

Generate a concise, professional response (max 500 words):`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "You are a professional email assistant." },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[ERROR] OpenAI API failed: ${response.status}`);
    console.error(`[ERROR] Response body: ${errorText}`);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(`[DEBUG] OpenAI response:`, JSON.stringify(data));
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error(`[ERROR] Invalid OpenAI response structure`);
    throw new Error("Invalid OpenAI response structure");
  }
  
  const content = data.choices[0].message.content?.trim() || "";
  if (content.length === 0) {
    console.warn(`[WARNING] OpenAI returned empty content`);
  }
  
  return content;
}

async function createDraft(
  messageId: string,
  threadId: string,
  subject: string,
  from: string,
  to: string,
  replyBody: string,
  accessToken: string
): Promise<void> {
  const rawMessage = [
    `To: ${from}`,
    `Subject: Re: ${subject}`,
    `In-Reply-To: ${messageId}`,
    `References: ${messageId}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    "",
    replyBody,
  ].join("\n");

  const encodedMessage = btoa(rawMessage).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const draftResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        raw: encodedMessage,
        threadId,
      },
    }),
  });

  if (!draftResponse.ok) {
    throw new Error(`Failed to create draft: ${draftResponse.status}`);
  }
}

async function sendReply(
  messageId: string,
  threadId: string,
  subject: string,
  from: string,
  to: string,
  replyBody: string,
  accessToken: string
): Promise<void> {
  const rawMessage = [
    `To: ${from}`,
    `Subject: Re: ${subject}`,
    `In-Reply-To: ${messageId}`,
    `References: ${messageId}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    "",
    replyBody,
  ].join("\n");

  const encodedMessage = btoa(rawMessage).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const sendResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: encodedMessage,
      threadId,
    }),
  });

  if (!sendResponse.ok) {
    throw new Error(`Failed to send reply: ${sendResponse.status}`);
  }
}
