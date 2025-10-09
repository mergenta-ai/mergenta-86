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
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    console.log("Disconnecting Gmail for user:", user.id);

    // Get connection to revoke tokens
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: connection, error: fetchError } = await supabaseAdmin
      .from("gmail_connections")
      .select("encrypted_access_token")
      .eq("user_id", user.id)
      .single();

    if (fetchError || !connection) {
      console.log("No connection found for user");
      return new Response(
        JSON.stringify({ success: true, message: "No connection to disconnect" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decrypt and revoke access token
    try {
      const accessToken = decrypt(connection.encrypted_access_token);

      // Call users.stop to stop watching
      await fetch("https://gmail.googleapis.com/gmail/v1/users/me/stop", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Revoke token with Google
      await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
        method: "POST",
      });

      console.log("Revoked Gmail access");
    } catch (revokeError) {
      console.error("Error revoking token:", revokeError);
      // Continue even if revoke fails
    }

    // Delete connection from database
    const { error: deleteError } = await supabaseAdmin
      .from("gmail_connections")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting connection:", deleteError);
      throw new Error("Failed to delete connection");
    }

    // Delete quota usage
    await supabaseAdmin
      .from("gmail_quota_usage")
      .delete()
      .eq("user_id", user.id);

    console.log("Gmail disconnected successfully");

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in gmail-disconnect:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
