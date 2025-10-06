import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decrypt } from "../_shared/encryption.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify user is authenticated
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    console.log(`[REFRESH-WATCH] User ${user.id} requesting watch refresh`);

    // Get Gmail connection
    const { data: connection, error: connError } = await supabase
      .from("gmail_connections")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (connError || !connection) {
      throw new Error("No Gmail connection found");
    }

    console.log(`[REFRESH-WATCH] Found connection for: ${connection.gmail_email}`);

    // Decrypt access token
    const accessToken = decrypt(connection.encrypted_access_token);

    // Check if token is expired
    const tokenExpiresAt = new Date(connection.token_expires_at);
    if (tokenExpiresAt <= new Date()) {
      console.log("[REFRESH-WATCH] Token expired, need to refresh first");
      throw new Error("Access token expired. Please reconnect your Gmail account.");
    }

    // Set up Gmail watch
    console.log("[REFRESH-WATCH] Setting up Gmail watch...");
    const watchResponse = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/watch",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicName: "projects/august-clover-471917-i6/topics/gmail-events",
          labelIds: ["INBOX"],
        }),
      }
    );

    if (!watchResponse.ok) {
      const errorText = await watchResponse.text();
      console.error("[REFRESH-WATCH] Watch setup failed:", errorText);
      throw new Error(`Gmail watch setup failed: ${errorText}`);
    }

    const watchData = await watchResponse.json();
    console.log("[REFRESH-WATCH] ✓ Watch set up successfully");
    console.log("[REFRESH-WATCH] History ID:", watchData.historyId);
    console.log("[REFRESH-WATCH] Expiration:", watchData.expiration);

    // Update connection with history_id
    const { error: updateError } = await supabase
      .from("gmail_connections")
      .update({
        history_id: watchData.historyId,
        last_synced_at: new Date().toISOString(),
      })
      .eq("id", connection.id);

    if (updateError) {
      console.error("[REFRESH-WATCH] Failed to update history_id:", updateError);
      throw new Error("Failed to update connection");
    }

    console.log("[REFRESH-WATCH] ✓ Connection updated with history ID");

    return new Response(
      JSON.stringify({
        success: true,
        email: connection.gmail_email,
        historyId: watchData.historyId,
        expiration: watchData.expiration,
        message: "Gmail watch refreshed successfully. New emails will now trigger notifications.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[REFRESH-WATCH] Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
