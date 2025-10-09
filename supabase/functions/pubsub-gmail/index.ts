import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { verifyPubSubToken } from '../_shared/oidc-verification.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PubSubMessage {
  message: {
    data: string;
    messageId: string;
    publishTime: string;
    attributes?: Record<string, string>;
  };
  subscription: string;
}

interface GmailNotification {
  emailAddress: string;
  historyId: string;
}

// Rate limiting: Track requests per user (in-memory, resets on function cold start)
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute per user

/**
 * Check rate limit for a user
 */
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    // Reset or initialize
    rateLimits.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }

  userLimit.count++;
  return true;
}

/**
 * Background processing - invokes the gmail-worker function
 * This runs asynchronously after we've acknowledged the Pub/Sub message
 */
async function processNotification(
  supabase: any,
  queueId: string,
  userId: string,
  emailAddress: string
) {
  try {
    console.log(`[BG] Starting background processing for queue ID: ${queueId}`);
    console.log(`[BG] User: ${userId}, Email: ${emailAddress}`);

    // Invoke the gmail-worker function to process this queue entry
    console.log(`[BG] Invoking gmail-worker function...`);
    
    const { data: workerResult, error: workerError } = await supabase.functions.invoke(
      "gmail-worker",
      {
        body: { queue_id: queueId },
      }
    );

    if (workerError) {
      console.error(`[BG] Worker invocation failed:`, workerError);
      throw workerError;
    }

    console.log(`[BG] ✓ Worker completed successfully:`, workerResult);
    console.log(`[BG] Messages processed: ${workerResult?.messages_processed || 0}`);

  } catch (error: any) {
    console.error(`[BG] ✗ Background processing failed for queue ID: ${queueId}`, error);

    // The worker function handles status updates, but if invocation itself fails,
    // we need to mark it as failed here
    try {
      await supabase
        .from("gmail_processing_queue")
        .update({
          status: "failed",
          processed_at: new Date().toISOString(),
          error_message: `Worker invocation failed: ${error.message}`,
        })
        .eq("id", queueId);
    } catch (updateError) {
      console.error(`[BG] Failed to update queue status:`, updateError);
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify OIDC token from Pub/Sub
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify token (audience will be configured in Google Cloud Console)
    const verification = await verifyPubSubToken(authHeader);
    if (!verification.valid) {
      console.error('OIDC verification failed:', verification.error);
      return new Response(
        JSON.stringify({ error: `Unauthorized: ${verification.error}` }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('OIDC token verified successfully');

    // Parse Pub/Sub message
    const pubsubMessage: PubSubMessage = await req.json();
    console.log('Received Pub/Sub message:', {
      messageId: pubsubMessage.message.messageId,
      publishTime: pubsubMessage.message.publishTime,
      subscription: pubsubMessage.subscription
    });

    // Decode base64 message data
    const decodedData = atob(pubsubMessage.message.data);
    const notification: GmailNotification = JSON.parse(decodedData);

    console.log('Decoded Gmail notification:', {
      emailAddress: notification.emailAddress,
      historyId: notification.historyId
    });

    // Find user_id from gmail_connections table
    const { data: connection, error: connectionError } = await supabase
      .from('gmail_connections')
      .select('user_id')
      .eq('gmail_email', notification.emailAddress)
      .single();

    if (connectionError || !connection) {
      console.error('Gmail connection not found for email:', notification.emailAddress);
      // Return 200 to acknowledge the message (avoid retries for unknown users)
      return new Response(
        JSON.stringify({ message: 'User not found, ignoring notification' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = connection.user_id;

    // Check rate limit
    if (!checkRateLimit(userId)) {
      console.warn(`Rate limit exceeded for user ${userId}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for duplicate historyId (prevent reprocessing)
    const { data: existingQueue } = await supabase
      .from('gmail_processing_queue')
      .select('id, status')
      .eq('user_id', userId)
      .eq('history_id', notification.historyId)
      .maybeSingle();

    if (existingQueue) {
      // If existing entry is pending or processing, skip
      if (existingQueue.status === 'pending' || existingQueue.status === 'processing') {
        console.log(`Duplicate notification ignored (already ${existingQueue.status}):`, notification.historyId);
        return new Response(
          JSON.stringify({ message: 'Duplicate notification, already processing' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // If failed, allow reprocessing
      console.log(`Reprocessing failed notification:`, notification.historyId);
    }

    // Insert into processing queue
    const { data: queueEntry, error: queueError } = await supabase
      .from('gmail_processing_queue')
      .insert({
        user_id: userId,
        history_id: notification.historyId,
        email_address: notification.emailAddress,
        status: 'pending'
      })
      .select()
      .single();

    if (queueError) {
      console.error('Failed to insert into queue:', queueError);
      return new Response(
        JSON.stringify({ error: 'Failed to queue notification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Notification queued successfully: ${queueEntry.id}`);

    // Start background processing (non-blocking)
    // @ts-ignore - EdgeRuntime is available in Supabase environment
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(
        processNotification(
          supabase,
          queueEntry.id,
          userId,
          notification.emailAddress
        )
      );
    } else {
      // Fallback for local development
      processNotification(
        supabase,
        queueEntry.id,
        userId,
        notification.emailAddress
      ).catch(err => console.error('Background processing error:', err));
    }

    // Return 200 immediately (ACK to Pub/Sub)
    return new Response(
      JSON.stringify({ 
        message: 'Notification received and queued',
        queueId: queueEntry.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
