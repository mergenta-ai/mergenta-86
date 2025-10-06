import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    // Verify admin access
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

    log("info", `Manual processing triggered by user: ${user.id}`);

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

    // Get request body for specific queue_id (optional)
    let queueId: string | null = null;
    try {
      const body = await req.json();
      queueId = body.queue_id || null;
    } catch {
      // No body or invalid JSON - process all pending
    }

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get pending queue entries
    let query = adminSupabase
      .from("gmail_processing_queue")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (queueId) {
      query = query.eq("id", queueId);
      log("info", `Processing specific queue entry: ${queueId}`);
    } else {
      query = query.limit(10);
      log("info", "Processing up to 10 pending queue entries");
    }

    const { data: queueEntries, error: queueError } = await query;

    if (queueError) {
      throw queueError;
    }

    if (!queueEntries || queueEntries.length === 0) {
      log("info", "No pending entries found in queue");
      return new Response(
        JSON.stringify({ success: true, logs, processed: 0, message: "No pending entries" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    log("info", `Found ${queueEntries.length} pending entries`);

    // Process each entry by invoking the worker
    const results = [];
    for (const entry of queueEntries) {
      log("info", `Invoking worker for queue entry: ${entry.id}`);
      log("info", `  Email: ${entry.email_address}, History: ${entry.history_id}`);

      try {
        const workerResponse = await adminSupabase.functions.invoke("gmail-worker", {
          body: { queue_id: entry.id },
        });

        if (workerResponse.error) {
          log("error", `Worker failed for ${entry.id}: ${workerResponse.error.message}`);
          results.push({
            queue_id: entry.id,
            success: false,
            error: workerResponse.error.message,
          });
        } else {
          log("success", `Worker completed for ${entry.id}`);
          results.push({
            queue_id: entry.id,
            success: true,
            data: workerResponse.data,
          });
        }
      } catch (invokeError: any) {
        log("error", `Exception invoking worker for ${entry.id}: ${invokeError.message}`);
        results.push({
          queue_id: entry.id,
          success: false,
          error: invokeError.message,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    log("success", `Processing complete: ${successCount}/${results.length} successful`);

    return new Response(
      JSON.stringify({
        success: true,
        logs,
        processed: results.length,
        successful: successCount,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    log("error", `Processing failed: ${error.message}`);
    console.error("Error in gmail-process-manual:", error);

    return new Response(
      JSON.stringify({ success: false, logs, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
