import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decrypt } from "../_shared/encryption.ts";

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

    // Process each email
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

        // Generate AI response
        const aiResponse = await generateEmailResponse(email.snippet, email.from);

        // Create draft in Gmail
        const draft = await createDraft(
          currentAccessToken,
          email.id,
          email.from,
          email.subject,
          aiResponse
        );

        // Save to database
        await supabaseClient.from("messages").insert({
          user_id: user.id,
          conversation_id: email.threadId || email.id,
          content: aiResponse,
          is_user: false,
          metadata: {
            gmail_message_id: email.id,
            gmail_thread_id: email.threadId,
            draft_id: draft.id,
            original_from: email.from,
            original_subject: email.subject,
          },
        });

        processed++;
        results.push({
          from: email.from,
          subject: email.subject,
          status: "processed",
        });

        console.log(`[INFO] Processed email from ${email.from}`);
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

async function generateEmailResponse(emailSnippet: string, fromEmail: string): Promise<string> {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const prompt = `You received an email from ${fromEmail}. Email content: "${emailSnippet}". Write a professional, concise reply.`;

  console.log(`[INFO] Generating AI response for email from ${fromEmail}`);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5-mini-2025-08-07",
      messages: [
        { role: "system", content: "You are a professional email assistant." },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 1500,  // Increased to accommodate reasoning tokens + output
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
  
  console.log(`[INFO] Generated AI response length: ${content.length} chars`);
  return content;
}

async function createDraft(
  accessToken: string,
  messageId: string,
  to: string,
  subject: string,
  body: string
) {
  const emailContent = [
    `To: ${to}`,
    `Subject: Re: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    "",
    body,
  ].join("\r\n");

  // Properly encode UTF-8 to base64
  const encoder = new TextEncoder();
  const data = encoder.encode(emailContent);
  const binaryString = Array.from(data, byte => String.fromCharCode(byte)).join('');
  const encodedEmail = btoa(binaryString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

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
          raw: encodedEmail,
          threadId: messageId,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create draft");
  }

  return await response.json();
}
