import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PubSubMessage {
  ackId: string;
  message: {
    data: string;
    messageId: string;
    publishTime: string;
  };
}

interface GmailNotification {
  emailAddress: string;
  historyId: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("=== Starting PULL subscription test ===");

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get Google Cloud credentials
    const projectId = "august-clover-471917-i6";
    const subscriptionId = "gmail-events-pull";
    
    // Note: In production, you would use proper service account credentials
    // For testing, we'll use gcloud CLI or Cloud Console to pull messages manually
    // This function demonstrates the processing logic that would handle pulled messages

    const url = new URL(req.url);
    const testMode = url.searchParams.get("test");

    if (testMode === "manual") {
      // Manual test mode: expects message data in request body
      console.log("Running in manual test mode");
      
      const body = await req.json();
      const messages: PubSubMessage[] = body.messages || [];

      console.log(`Processing ${messages.length} test messages`);

      const results = [];

      for (const pubsubMessage of messages) {
        try {
          console.log("--- Processing message ---");
          console.log("Message ID:", pubsubMessage.message.messageId);
          console.log("Publish time:", pubsubMessage.message.publishTime);

          // Decode base64 message data
          const decodedData = atob(pubsubMessage.message.data);
          console.log("Decoded data:", decodedData);

          const notification: GmailNotification = JSON.parse(decodedData);
          console.log("Parsed notification:", notification);

          const { emailAddress, historyId } = notification;

          if (!emailAddress || !historyId) {
            console.error("Invalid notification format - missing emailAddress or historyId");
            results.push({
              messageId: pubsubMessage.message.messageId,
              status: "error",
              error: "Invalid notification format",
            });
            continue;
          }

          // Look up user_id from gmail_connections
          console.log("Looking up user for email:", emailAddress);
          const { data: connection, error: lookupError } = await supabase
            .from("gmail_connections")
            .select("user_id, history_id")
            .eq("gmail_email", emailAddress)
            .single();

          if (lookupError || !connection) {
            console.error("Failed to find gmail_connection:", lookupError);
            results.push({
              messageId: pubsubMessage.message.messageId,
              status: "error",
              error: "User not found",
              emailAddress,
            });
            continue;
          }

          console.log("Found user:", connection.user_id);
          console.log("Current history_id in DB:", connection.history_id);
          console.log("New history_id from notification:", historyId);

          // Check for duplicates
          const { data: existingQueue, error: queueCheckError } = await supabase
            .from("gmail_processing_queue")
            .select("id")
            .eq("user_id", connection.user_id)
            .eq("history_id", historyId)
            .maybeSingle();

          if (queueCheckError) {
            console.error("Error checking for duplicates:", queueCheckError);
          }

          if (existingQueue) {
            console.log("⚠ Duplicate message detected - skipping");
            results.push({
              messageId: pubsubMessage.message.messageId,
              status: "duplicate",
              userId: connection.user_id,
              historyId,
            });
            continue;
          }

          // Insert into processing queue
          console.log("Inserting into gmail_processing_queue");
          const { data: queueEntry, error: insertError } = await supabase
            .from("gmail_processing_queue")
            .insert({
              user_id: connection.user_id,
              email_address: emailAddress,
              history_id: historyId,
              status: "pending",
            })
            .select()
            .single();

          if (insertError) {
            console.error("Failed to insert queue entry:", insertError);
            results.push({
              messageId: pubsubMessage.message.messageId,
              status: "error",
              error: insertError.message,
            });
            continue;
          }

          console.log("✓ Queue entry created:", queueEntry.id);
          results.push({
            messageId: pubsubMessage.message.messageId,
            status: "success",
            queueId: queueEntry.id,
            userId: connection.user_id,
            historyId,
          });

          // In production with actual Pub/Sub SDK, you would acknowledge here:
          // await pubsub.subscription(subscriptionId).ack([pubsubMessage.ackId]);
          console.log("Message processed successfully");

        } catch (error) {
          console.error("Error processing message:", error);
          results.push({
            messageId: pubsubMessage.message.messageId,
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      console.log("=== Processing complete ===");
      console.log("Results:", JSON.stringify(results, null, 2));

      return new Response(
        JSON.stringify({
          success: true,
          processed: results.length,
          results,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Default response with instructions
    return new Response(
      JSON.stringify({
        message: "Gmail PULL Subscription Test Function",
        usage: {
          manualTest: "POST with ?test=manual and JSON body containing {messages: [...]}"
        },
        instructions: [
          "1. Pull messages using: gcloud pubsub subscriptions pull gmail-events-pull --limit=10 --format=json",
          "2. Save the output to a file (e.g., messages.json)",
          "3. Send the messages array to this function with ?test=manual",
          "4. Check the response and logs for processing results"
        ],
        example: {
          url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/test-gmail-pull?test=manual`,
          method: "POST",
          body: {
            messages: [
              {
                ackId: "...",
                message: {
                  data: "base64_encoded_gmail_notification",
                  messageId: "...",
                  publishTime: "..."
                }
              }
            ]
          }
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in test-gmail-pull:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
