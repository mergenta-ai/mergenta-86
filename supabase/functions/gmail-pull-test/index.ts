import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestLog {
  timestamp: string;
  level: "info" | "success" | "error" | "warning";
  message: string;
}

interface GmailNotification {
  emailAddress: string;
  historyId: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const logs: TestLog[] = [];
  
  const log = (level: TestLog["level"], message: string) => {
    logs.push({
      timestamp: new Date().toISOString(),
      level,
      message,
    });
    console.log(`[${level.toUpperCase()}] ${message}`);
  };

  try {
    // Verify JWT and get user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    log("info", `Test initiated by user: ${user.id}`);

    // Check if user is admin/moderator
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "moderator"])
      .maybeSingle();

    if (!roleData) {
      log("error", "Access denied - admin role required");
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    log("success", `Admin access verified (role: ${roleData.role})`);

    // Use service role for database operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get first active Gmail connection for testing
    log("info", "Looking up Gmail connections...");
    const { data: connections, error: connectionError } = await supabase
      .from("gmail_connections")
      .select("user_id, gmail_email, history_id")
      .eq("auto_reply_enabled", false)
      .limit(1);

    if (connectionError || !connections || connections.length === 0) {
      log("warning", "No Gmail connections found");
      return new Response(
        JSON.stringify({
          success: false,
          logs,
          error: "No Gmail connections available for testing",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const connection = connections[0];
    log("success", `Found Gmail connection: ${connection.gmail_email}`);

    // Generate mock Gmail notification
    const mockHistoryId = String(Number(connection.history_id || "1000") + 1);
    const notification: GmailNotification = {
      emailAddress: connection.gmail_email,
      historyId: mockHistoryId,
    };

    log("info", `Generated mock notification with historyId: ${mockHistoryId}`);

    // Simulate Pub/Sub message format
    const mockPubSubMessage = {
      ackId: `mock-ack-${Date.now()}`,
      message: {
        data: btoa(JSON.stringify(notification)),
        messageId: `mock-msg-${Date.now()}`,
        publishTime: new Date().toISOString(),
      },
    };

    log("info", "Processing mock Pub/Sub message...");

    // Check for duplicates
    const { data: existingQueue } = await supabase
      .from("gmail_processing_queue")
      .select("id")
      .eq("user_id", connection.user_id)
      .eq("history_id", mockHistoryId)
      .maybeSingle();

    if (existingQueue) {
      log("warning", "Duplicate historyId detected - queue entry already exists");
      return new Response(
        JSON.stringify({
          success: false,
          logs,
          duplicate: true,
          queueId: existingQueue.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert into processing queue
    log("info", "Inserting entry into gmail_processing_queue...");
    const { data: queueEntry, error: insertError } = await supabase
      .from("gmail_processing_queue")
      .insert({
        user_id: connection.user_id,
        email_address: connection.gmail_email,
        history_id: mockHistoryId,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      log("error", `Failed to insert queue entry: ${insertError.message}`);
      return new Response(
        JSON.stringify({
          success: false,
          logs,
          error: insertError.message,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    log("success", `Queue entry created successfully (ID: ${queueEntry.id})`);
    log("info", `Status: ${queueEntry.status}`);
    log("success", "✓ Test completed - message flow verified");

    return new Response(
      JSON.stringify({
        success: true,
        logs,
        result: {
          queueId: queueEntry.id,
          userId: connection.user_id,
          email: connection.gmail_email,
          historyId: mockHistoryId,
          status: queueEntry.status,
          createdAt: queueEntry.created_at,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    log("error", `Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    console.error("Error in gmail-pull-test:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        logs,
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
