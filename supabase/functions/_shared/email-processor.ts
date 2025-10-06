import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { decrypt } from './encryption.ts';

interface SenderRule {
  id: string;
  sender_email: string;
  sender_pattern_type: 'exact' | 'domain' | 'wildcard';
  sender_name?: string;
  action: 'reply' | 'ignore' | 'forward' | 'flag';
  reply_mode?: 'draft' | 'send';
  custom_prompt?: string;
  priority: number;
}

interface EmailData {
  id: string;
  threadId: string;
  sender: string;
  senderName?: string;
  subject: string;
  body: string;
  snippet: string;
}

interface ProcessingResult {
  action: 'replied_draft' | 'replied_sent' | 'ignored' | 'failed';
  ruleApplied?: SenderRule;
  draftId?: string;
  messageSentId?: string;
  tokensUsed?: number;
  processingTimeMs: number;
  error?: string;
}

/**
 * Get matching sender rule for an email
 */
export async function getSenderRule(
  userId: string,
  senderEmail: string,
  supabase: any
): Promise<SenderRule | null> {
  const { data: rules, error } = await supabase
    .from('email_sender_rules')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('priority', { ascending: true });

  if (error || !rules || rules.length === 0) {
    console.log('No active rules found for user:', userId);
    return null;
  }

  // Match rules by priority
  for (const rule of rules) {
    if (matchesSenderPattern(senderEmail, rule.sender_email, rule.sender_pattern_type)) {
      console.log(`Matched rule: ${rule.sender_name || rule.sender_email} (${rule.action})`);
      return rule;
    }
  }

  return null;
}

/**
 * Check if sender email matches pattern
 */
function matchesSenderPattern(
  senderEmail: string,
  pattern: string,
  patternType: 'exact' | 'domain' | 'wildcard'
): boolean {
  const normalizedSender = senderEmail.toLowerCase();
  const normalizedPattern = pattern.toLowerCase();

  switch (patternType) {
    case 'exact':
      return normalizedSender === normalizedPattern;
    
    case 'domain':
      // Extract domain from sender email
      const senderDomain = normalizedSender.split('@')[1];
      const patternDomain = normalizedPattern.replace('*@', '');
      return senderDomain === patternDomain;
    
    case 'wildcard':
      // Convert wildcard pattern to regex
      const regexPattern = normalizedPattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(normalizedSender);
    
    default:
      return false;
  }
}

/**
 * Generate AI response for email
 */
export async function generateAIResponse(
  email: EmailData,
  customPrompt?: string
): Promise<{ response: string; tokensUsed: number }> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const defaultPrompt = `You are an AI email assistant. Generate a professional, concise reply to the following email.

From: ${email.sender}
Subject: ${email.subject}
Body: ${email.body}

Generate a polite and professional response. Keep it under 200 words.`;

  const finalPrompt = customPrompt 
    ? `${customPrompt}\n\nFrom: ${email.sender}\nSubject: ${email.subject}\nBody: ${email.body}`
    : defaultPrompt;

  console.log('Generating AI response with OpenAI...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional email assistant.' },
        { role: 'user', content: finalPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const generatedResponse = data.choices[0].message.content;
  const tokensUsed = data.usage?.total_tokens || 0;

  console.log(`AI response generated. Tokens used: ${tokensUsed}`);
  return { response: generatedResponse, tokensUsed };
}

/**
 * Create draft or send reply in Gmail
 */
export async function createDraftOrSend(
  accessToken: string,
  email: EmailData,
  replyBody: string,
  mode: 'draft' | 'send'
): Promise<{ draftId?: string; messageSentId?: string }> {
  const rawMessage = [
    `To: ${email.sender}`,
    `Subject: Re: ${email.subject}`,
    `In-Reply-To: ${email.id}`,
    `References: ${email.id}`,
    '',
    replyBody
  ].join('\r\n');

  const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  if (mode === 'draft') {
    console.log('Creating draft in Gmail...');
    const draftResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          raw: encodedMessage,
          threadId: email.threadId,
        },
      }),
    });

    if (!draftResponse.ok) {
      const errorText = await draftResponse.text();
      console.error('Failed to create draft:', draftResponse.status, errorText);
      throw new Error(`Failed to create draft: ${draftResponse.status}`);
    }

    const draft = await draftResponse.json();
    console.log('Draft created:', draft.id);
    return { draftId: draft.id };
  } else {
    console.log('Sending email directly...');
    const sendResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage,
        threadId: email.threadId,
      }),
    });

    if (!sendResponse.ok) {
      const errorText = await sendResponse.text();
      console.error('Failed to send email:', sendResponse.status, errorText);
      throw new Error(`Failed to send email: ${sendResponse.status}`);
    }

    const sent = await sendResponse.json();
    console.log('Email sent:', sent.id);
    return { messageSentId: sent.id };
  }
}

/**
 * Log email processing to database
 */
export async function logProcessing(
  supabase: any,
  userId: string,
  email: EmailData,
  result: ProcessingResult,
  processingMode: 'pull_manual' | 'pull_user' | 'push_worker'
) {
  const logData = {
    user_id: userId,
    gmail_message_id: email.id,
    sender_email: email.sender,
    sender_name: email.senderName,
    subject: email.subject,
    processing_mode: processingMode,
    action_taken: result.action,
    rule_applied_id: result.ruleApplied?.id,
    rule_applied_name: result.ruleApplied?.sender_name || result.ruleApplied?.sender_email,
    ai_tokens_used: result.tokensUsed || 0,
    processing_time_ms: result.processingTimeMs,
    error_message: result.error,
    gmail_draft_id: result.draftId,
    gmail_message_sent_id: result.messageSentId,
  };

  const { error } = await supabase
    .from('email_processing_log')
    .insert(logData);

  if (error) {
    console.error('Failed to log processing:', error);
  }
}

/**
 * Update daily processing statistics
 */
export async function updateStats(
  supabase: any,
  userId: string,
  result: ProcessingResult
) {
  const today = new Date().toISOString().split('T')[0];

  // Get or create today's stats
  const { data: existingStats } = await supabase
    .from('email_processing_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (existingStats) {
    // Update existing stats
    const updates: any = {
      total_tokens_used: existingStats.total_tokens_used + (result.tokensUsed || 0),
    };

    if (result.action === 'ignored') {
      updates.total_ignored = existingStats.total_ignored + 1;
    } else if (result.action === 'failed') {
      updates.total_failed = existingStats.total_failed + 1;
    } else if (result.action === 'replied_draft') {
      updates.total_processed = existingStats.total_processed + 1;
      updates.drafts_created = existingStats.drafts_created + 1;
    } else if (result.action === 'replied_sent') {
      updates.total_processed = existingStats.total_processed + 1;
      updates.emails_sent = existingStats.emails_sent + 1;
    }

    // Update average processing time
    const totalProcessed = updates.total_processed || existingStats.total_processed;
    const currentAvg = existingStats.avg_processing_time_ms;
    const newAvg = Math.round(
      (currentAvg * (totalProcessed - 1) + result.processingTimeMs) / totalProcessed
    );
    updates.avg_processing_time_ms = newAvg;

    await supabase
      .from('email_processing_stats')
      .update(updates)
      .eq('id', existingStats.id);
  } else {
    // Create new stats entry
    const newStats = {
      user_id: userId,
      date: today,
      total_processed: result.action.startsWith('replied') ? 1 : 0,
      total_ignored: result.action === 'ignored' ? 1 : 0,
      total_failed: result.action === 'failed' ? 1 : 0,
      drafts_created: result.action === 'replied_draft' ? 1 : 0,
      emails_sent: result.action === 'replied_sent' ? 1 : 0,
      avg_processing_time_ms: result.processingTimeMs,
      total_tokens_used: result.tokensUsed || 0,
    };

    await supabase
      .from('email_processing_stats')
      .insert(newStats);
  }
}

/**
 * Process a single email with sender rules
 */
export async function processEmail(
  supabase: any,
  userId: string,
  email: EmailData,
  accessToken: string,
  defaultReplyMode: 'draft' | 'send',
  processingMode: 'pull_manual' | 'pull_user' | 'push_worker'
): Promise<ProcessingResult> {
  const startTime = Date.now();

  try {
    // Check for sender rule
    const rule = await getSenderRule(userId, email.sender, supabase);

    // If rule says ignore, skip processing
    if (rule && rule.action === 'ignore') {
      const result: ProcessingResult = {
        action: 'ignored',
        ruleApplied: rule,
        processingTimeMs: Date.now() - startTime,
      };
      await logProcessing(supabase, userId, email, result, processingMode);
      await updateStats(supabase, userId, result);
      return result;
    }

    // Generate AI response
    const { response, tokensUsed } = await generateAIResponse(
      email,
      rule?.custom_prompt
    );

    // Determine reply mode (rule overrides default)
    const replyMode = rule?.reply_mode || defaultReplyMode;

    // Create draft or send
    const { draftId, messageSentId } = await createDraftOrSend(
      accessToken,
      email,
      response,
      replyMode
    );

    const result: ProcessingResult = {
      action: replyMode === 'draft' ? 'replied_draft' : 'replied_sent',
      ruleApplied: rule || undefined,
      draftId,
      messageSentId,
      tokensUsed,
      processingTimeMs: Date.now() - startTime,
    };

    await logProcessing(supabase, userId, email, result, processingMode);
    await updateStats(supabase, userId, result);
    return result;

  } catch (error) {
    console.error('Error processing email:', error);
    const result: ProcessingResult = {
      action: 'failed',
      processingTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    await logProcessing(supabase, userId, email, result, processingMode);
    await updateStats(supabase, userId, result);
    return result;
  }
}
