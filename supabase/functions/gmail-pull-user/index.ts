import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decrypt } from "../_shared/encryption.ts";
import { processEmail } from "../_shared/email-processor.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    console.log(`[INFO] User ${user.email} pulling emails`);

    // Get user's Gmail connection
    const { data: connection, error: connError } = await supabaseClient
      .from("gmail_connections")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (connError || !connection) {
      throw new Error("Gmail not connected");
    }

    console.log(`[INFO] Found Gmail connection for ${connection.gmail_email}`);

    // Decrypt tokens
    const accessToken = decrypt(connection.encrypted_access_token);
    const refreshToken = decrypt(connection.encrypted_refresh_token);

    // Check if token needs refresh
    let currentAccessToken = accessToken;
    const now = new Date();
    const expiresAt = new Date(connection.token_expires_at);

    if (now >= expiresAt) {
      console.log(`[INFO] Token expired, refreshing...`);
      currentAccessToken = await refreshAccessToken(
        refreshToken,
        connection.id,
        supabaseClient
      );
    }

    // Fetch emails
    const emails = await fetchEmails(currentAccessToken);
    console.log(`[INFO] Fetched ${emails.length} emails`);

    // Process each email with shared processor
    let processed = 0;
    let skipped = 0;
    const results = [];

    for (const email of emails) {
      try {
        // Check if already processed
        const { data: existing } = await supabaseClient
          .from("messages")
          .select("id")
          .eq("user_id", user.id)
          .eq("metadata->>gmail_message_id", email.id)
          .single();

        if (existing) {
          skipped++;
          continue;
        }

        console.log(`[INFO] Processing email from ${email.from}: ${email.subject}`);

        // Use shared processor with sender rules
        const result = await processEmail(
          supabaseClient,
          user.id,
          {
            id: email.id,
            threadId: email.threadId,
            sender: email.from,
            senderName: email.from.split('<')[0].trim(),
            subject: email.subject,
            body: email.snippet,
            snippet: email.snippet,
          },
          currentAccessToken,
          connection.default_reply_mode || 'draft',
          'pull_user'
        );

        // Save to messages table for backward compatibility
        await supabaseClient.from("messages").insert({
          user_id: user.id,
          conversation_id: email.threadId || email.id,
          content: email.snippet,
          is_user: false,
          metadata: {
            gmail_message_id: email.id,
            gmail_thread_id: email.threadId,
            draft_id: result.draftId,
            message_sent_id: result.messageSentId,
            original_from: email.from,
            original_subject: email.subject,
            action: result.action,
            rule_applied: result.ruleApplied?.sender_name,
          },
        });

        if (result.action !== 'ignored') {
          processed++;
        } else {
          skipped++;
        }

        results.push({
          from: email.from,
          subject: email.subject,
          status: result.action === 'failed' ? 'failed' : 'processed',
          action: result.action,
          rule: result.ruleApplied?.sender_name,
          draft_id: result.draftId,
          message_sent_id: result.messageSentId,
          error: result.error,
        });

        console.log(`[INFO] Processed email: ${result.action}`);
      } catch (error) {
        console.error(`[ERROR] Failed to process email:`, error);
        results.push({
          from: email.from,
          subject: email.subject,
          status: "failed",
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed,
        skipped,
        total: emails.length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[ERROR] gmail-pull-user:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function refreshAccessToken(
  refreshToken: string,
  connectionId: string,
  supabaseClient: any
): Promise<string> {
  const clientId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID")!;
  const clientSecret = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET")!;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  const newAccessToken = data.access_token;
  const expiresIn = data.expires_in;

  // Update in database
  const { encrypt } = await import("../_shared/encryption.ts");
  await supabaseClient
    .from("gmail_connections")
    .update({
      encrypted_access_token: encrypt(newAccessToken),
      token_expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
    })
    .eq("id", connectionId);

  return newAccessToken;
}

async function fetchEmails(accessToken: string) {
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=is:unread in:inbox",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch emails");
  }

  const data = await response.json();
  const messages = data.messages || [];

  const emails = [];
  for (const msg of messages) {
    const detail = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!detail.ok) continue;

    const emailData = await detail.json();
    const headers = emailData.payload.headers;
    const from = headers.find((h: any) => h.name === "From")?.value || "";
    const subject = headers.find((h: any) => h.name === "Subject")?.value || "";

    emails.push({
      id: emailData.id,
      threadId: emailData.threadId,
      snippet: emailData.snippet,
      from,
      subject,
    });
  }

  return emails;
}
