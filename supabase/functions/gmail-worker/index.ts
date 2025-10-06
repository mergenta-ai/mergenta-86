import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decrypt } from "../_shared/encryption.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProcessRequest {
  queue_id: string;
}

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload?: {
    headers?: Array<{ name: string; value: string }>;
    parts?: Array<{ body?: { data?: string } }>;
    body?: { data?: string };
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { queue_id } = await req.json() as ProcessRequest;
    console.log(`[WORKER] Processing queue entry: ${queue_id}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get queue entry
    const { data: queueEntry, error: queueError } = await supabase
      .from("gmail_processing_queue")
      .select("*")
      .eq("id", queue_id)
      .single();

    if (queueError || !queueEntry) {
      throw new Error(`Queue entry not found: ${queue_id}`);
    }

    console.log(`[WORKER] Queue entry email: ${queueEntry.email_address}`);
    console.log(`[WORKER] History ID: ${queueEntry.history_id}`);

    // Update status to processing
    await supabase
      .from("gmail_processing_queue")
      .update({ status: "processing" })
      .eq("id", queue_id);

    // Get Gmail connection
    const { data: connection, error: connError } = await supabase
      .from("gmail_connections")
      .select("*")
      .eq("user_id", queueEntry.user_id)
      .single();

    if (connError || !connection) {
      throw new Error("Gmail connection not found");
    }

    console.log(`[WORKER] Found connection for: ${connection.gmail_email}`);

    // Decrypt tokens
    let accessToken: string;
    try {
      accessToken = decrypt(connection.encrypted_access_token);
      console.log("[WORKER] ✓ Tokens decrypted");
    } catch (decryptError) {
      console.error("[WORKER] Token decryption failed:", decryptError);
      throw new Error("Failed to decrypt tokens");
    }

    // Check if token needs refresh
    const tokenExpiresAt = new Date(connection.token_expires_at);
    const now = new Date();
    if (tokenExpiresAt <= now) {
      console.log("[WORKER] Token expired, refreshing...");
      accessToken = await refreshAccessToken(supabase, connection);
    }

    // Fetch Gmail history changes
    console.log(`[WORKER] Fetching history from: ${queueEntry.history_id}`);
    let historyResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${queueEntry.history_id}&historyTypes=messageAdded`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // If history ID is invalid (404), use the stored history_id from connection or get current one
    if (historyResponse.status === 404) {
      console.log("[WORKER] History ID not found (likely test data), using connection's history_id");
      
      if (connection.history_id && connection.history_id !== queueEntry.history_id) {
        console.log(`[WORKER] Trying with connection's history_id: ${connection.history_id}`);
        historyResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${connection.history_id}&historyTypes=messageAdded`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
      
      // If still 404, get the current profile to establish a baseline
      if (historyResponse.status === 404) {
        console.log("[WORKER] Fetching current profile to get valid history ID");
        const profileResponse = await fetch(
          "https://gmail.googleapis.com/gmail/v1/users/me/profile",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        
        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          console.log(`[WORKER] Current history ID from profile: ${profile.historyId}`);
          
          // Update the connection with the current history ID
          await supabase
            .from("gmail_connections")
            .update({ history_id: profile.historyId })
            .eq("id", connection.id);
          
          console.log("[WORKER] No new messages to process (established baseline)");
          
          // Mark as completed since we've established a baseline
          await supabase
            .from("gmail_processing_queue")
            .update({
              status: "completed",
              processed_at: new Date().toISOString(),
            })
            .eq("id", queue_id);
          
          return new Response(
            JSON.stringify({
              success: true,
              messages_processed: 0,
              note: "Baseline established, no messages to process",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    if (!historyResponse.ok) {
      const errorText = await historyResponse.text();
      console.error("[WORKER] History API error:", errorText);
      throw new Error(`Gmail API error: ${historyResponse.status}`);
    }

    const historyData = await historyResponse.json();
    console.log(`[WORKER] History response:`, JSON.stringify(historyData, null, 2));

    const messages: string[] = [];
    if (historyData.history) {
      for (const record of historyData.history) {
        if (record.messagesAdded) {
          for (const msgAdded of record.messagesAdded) {
            messages.push(msgAdded.message.id);
          }
        }
      }
    }

    console.log(`[WORKER] Found ${messages.length} new messages`);

    // Process each message
    const processedMessages = [];
    for (const messageId of messages) {
      try {
        const processed = await processMessage(
          supabase,
          accessToken,
          messageId,
          connection.user_id,
          connection.gmail_email,
          connection.auto_reply_enabled,
          connection.default_reply_mode
        );
        processedMessages.push(processed);
      } catch (msgError) {
        console.error(`[WORKER] Failed to process message ${messageId}:`, msgError);
      }
    }

    // Update queue entry as completed
    await supabase
      .from("gmail_processing_queue")
      .update({
        status: "completed",
        processed_at: new Date().toISOString(),
      })
      .eq("id", queue_id);

    // Update connection's last_synced_at and history_id
    if (historyData.historyId) {
      await supabase
        .from("gmail_connections")
        .update({
          history_id: historyData.historyId,
          last_synced_at: new Date().toISOString(),
        })
        .eq("id", connection.id);
    }

    console.log(`[WORKER] ✓ Processing complete: ${processedMessages.length} messages processed`);

    return new Response(
      JSON.stringify({
        success: true,
        messages_processed: processedMessages.length,
        details: processedMessages,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[WORKER] Error:", error);

    // Update queue entry as failed
    if (error.message.includes("queue_id")) {
      // Can't update if we don't have the ID
    } else {
      try {
        const { queue_id } = await req.json() as ProcessRequest;
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );
        await supabase
          .from("gmail_processing_queue")
          .update({
            status: "failed",
            processed_at: new Date().toISOString(),
            error_message: error.message,
          })
          .eq("id", queue_id);
      } catch {}
    }

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function refreshAccessToken(
  supabase: any,
  connection: any
): Promise<string> {
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
    throw new Error("Failed to refresh token");
  }

  const tokens = await response.json();
  const { encrypt } = await import("../_shared/encryption.ts");
  const encryptedAccessToken = encrypt(tokens.access_token);
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await supabase
    .from("gmail_connections")
    .update({
      encrypted_access_token: encryptedAccessToken,
      token_expires_at: expiresAt,
    })
    .eq("id", connection.id);

  console.log("[WORKER] ✓ Token refreshed");
  return tokens.access_token;
}

async function processMessage(
  supabase: any,
  accessToken: string,
  messageId: string,
  userId: string,
  userEmail: string,
  autoReplyEnabled: boolean,
  defaultReplyMode: string
): Promise<any> {
  console.log(`[WORKER] Processing message: ${messageId}`);

  // Fetch full message
  const msgResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!msgResponse.ok) {
    throw new Error(`Failed to fetch message ${messageId}`);
  }

  const message: GmailMessage = await msgResponse.json();
  
  // Extract email details
  const headers = message.payload?.headers || [];
  const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
  const from = headers.find(h => h.name === "From")?.value || "Unknown";
  const to = headers.find(h => h.name === "To")?.value || "";
  
  // Get email body
  let body = message.snippet || "";
  if (message.payload?.parts) {
    const textPart = message.payload.parts.find(p => p.body?.data);
    if (textPart?.body?.data) {
      body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }
  } else if (message.payload?.body?.data) {
    body = atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
  }

  console.log(`[WORKER] Email from: ${from}`);
  console.log(`[WORKER] Subject: ${subject}`);

  // Generate LLM response
  const aiResponse = await generateEmailResponse(subject, from, body);
  console.log(`[WORKER] ✓ AI response generated (${aiResponse.length} chars)`);

  // Create draft or send reply
  let actionTaken = "draft_created";
  if (autoReplyEnabled && defaultReplyMode === "send") {
    await sendReply(accessToken, message.threadId, to, from, subject, aiResponse);
    actionTaken = "reply_sent";
    console.log(`[WORKER] ✓ Reply sent`);
  } else {
    await createDraft(accessToken, message.threadId, to, from, subject, aiResponse);
    console.log(`[WORKER] ✓ Draft created`);
  }

  return {
    message_id: messageId,
    from,
    subject,
    action: actionTaken,
    ai_response_length: aiResponse.length,
  };
}

async function generateEmailResponse(
  subject: string,
  from: string,
  body: string
): Promise<string> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const prompt = `You are an AI email assistant. Generate a professional, concise reply to the following email.

From: ${from}
Subject: ${subject}

Email Body:
${body.substring(0, 1000)}

Generate a polite, professional response that acknowledges the email and provides a helpful reply. Keep it under 200 words.`;

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-2025-08-07",
        messages: [
          { role: "system", content: "You are a professional email assistant." },
          { role: "user", content: prompt }
        ],
        max_completion_tokens: 500
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[WORKER] OpenAI API error:", errorText);
    throw new Error("Failed to generate AI response");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function createDraft(
  accessToken: string,
  threadId: string,
  to: string,
  replyTo: string,
  originalSubject: string,
  body: string
): Promise<void> {
  const subject = originalSubject.startsWith("Re:") ? originalSubject : `Re: ${originalSubject}`;
  
  const rawMessage = [
    `To: ${replyTo}`,
    `Subject: ${subject}`,
    `In-Reply-To: ${threadId}`,
    `References: ${threadId}`,
    "",
    body,
  ].join("\r\n");

  const encodedMessage = btoa(rawMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/drafts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          threadId,
          raw: encodedMessage,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create draft: ${errorText}`);
  }
}

async function sendReply(
  accessToken: string,
  threadId: string,
  to: string,
  replyTo: string,
  originalSubject: string,
  body: string
): Promise<void> {
  const subject = originalSubject.startsWith("Re:") ? originalSubject : `Re: ${originalSubject}`;
  
  const rawMessage = [
    `To: ${replyTo}`,
    `Subject: ${subject}`,
    `In-Reply-To: ${threadId}`,
    `References: ${threadId}`,
    "",
    body,
  ].join("\r\n");

  const encodedMessage = btoa(rawMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId,
        raw: encodedMessage,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send reply: ${errorText}`);
  }
}
