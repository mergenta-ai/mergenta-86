import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encrypt } from "../_shared/encryption.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // user_id
    const error = url.searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      return new Response(
        `<html><body><script>window.opener.postMessage({type:'gmail-oauth-error',error:'${error}'},'*');window.close();</script></body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    if (!code || !state) {
      throw new Error("Missing code or state parameter");
    }

    const userId = state;
    console.log("Processing OAuth callback for user:", userId);

    // Exchange code for tokens
    const clientId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");
    const redirectUri = `${Deno.env.get("SUPABASE_URL")}/functions/v1/gmail-oauth-callback`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange error:", errorData);
      throw new Error("Failed to exchange code for tokens");
    }

    const tokens = await tokenResponse.json();
    console.log("Received tokens from Google");

    // Get user email from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info from Google");
    }

    const userInfo = await userInfoResponse.json();
    const gmailEmail = userInfo.email;
    console.log("Gmail email:", gmailEmail);

    // Encrypt tokens
    const encryptedAccessToken = encrypt(tokens.access_token);
    const encryptedRefreshToken = encrypt(tokens.refresh_token);
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // Store in database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: dbError } = await supabase
      .from("gmail_connections")
      .upsert({
        user_id: userId,
        gmail_email: gmailEmail,
        encrypted_access_token: encryptedAccessToken,
        encrypted_refresh_token: encryptedRefreshToken,
        token_expires_at: expiresAt,
        connected_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store connection");
    }

    console.log("Gmail connection stored successfully");

    // Call users.watch to set up Pub/Sub
    try {
      const watchResponse = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/watch",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topicName: "projects/august-clover-471917-i6/topics/gmail-events",
          }),
        }
      );

      if (watchResponse.ok) {
        const watchData = await watchResponse.json();
        console.log("Watch set up successfully:", watchData);

        // Store history_id
        await supabase
          .from("gmail_connections")
          .update({ history_id: watchData.historyId })
          .eq("user_id", userId);
      } else {
        console.error("Failed to set up watch:", await watchResponse.text());
      }
    } catch (watchError) {
      console.error("Error setting up watch:", watchError);
      // Don't fail the whole flow if watch fails
    }

    // Success - close popup
    return new Response(
      `<html><body><script>window.opener.postMessage({type:'gmail-oauth-success',email:'${gmailEmail}'},'*');window.close();</script></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Error in gmail-oauth-callback:", error);
    return new Response(
      `<html><body><script>window.opener.postMessage({type:'gmail-oauth-error',error:'${error.message}'},'*');window.close();</script></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
});
