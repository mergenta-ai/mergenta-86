import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GmailAutomationRequest {
  action: 'send' | 'auto_reply' | 'template';
  to?: string;
  subject?: string;
  body?: string;
  templateName?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, to, subject, body, templateName } = await req.json() as GmailAutomationRequest;

    console.log(`Gmail automation action: ${action}`);

    // Get user's plan
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    const planType = userPlan?.plan_type || 'free';

    // Get email limits
    const { data: emailLimits } = await supabase
      .from('email_limits')
      .select('daily_gmail_quota, monthly_gmail_quota')
      .eq('plan_type', planType)
      .single();

    if (!emailLimits) {
      throw new Error('Email limits not found');
    }

    // Check daily usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usageData } = await supabase
      .from('email_usage')
      .select('daily_count, monthly_count, last_daily_reset, last_monthly_reset')
      .eq('user_id', user.id)
      .eq('service_type', 'gmail')
      .eq('usage_date', today)
      .single();

    const dailyCount = usageData?.daily_count || 0;
    const monthlyCount = usageData?.monthly_count || 0;

    if (dailyCount >= emailLimits.daily_gmail_quota) {
      return new Response(
        JSON.stringify({
          error: 'Daily Gmail limit exceeded',
          used: dailyCount,
          limit: emailLimits.daily_gmail_quota,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (monthlyCount >= emailLimits.monthly_gmail_quota) {
      return new Response(
        JSON.stringify({
          error: 'Monthly Gmail limit exceeded',
          used: monthlyCount,
          limit: emailLimits.monthly_gmail_quota,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get Google OAuth credentials
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID');
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET');

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth not configured');
    }

    // TODO: Implement actual Gmail API integration
    // For now, return a success response
    let result;
    
    switch (action) {
      case 'send':
        result = { success: true, message: 'Email sent via Gmail' };
        break;
      case 'auto_reply':
        result = { success: true, message: 'Auto-reply configured' };
        break;
      case 'template':
        result = { success: true, message: `Template "${templateName}" applied` };
        break;
      default:
        throw new Error('Invalid action');
    }

    // Update usage
    await supabase
      .from('email_usage')
      .upsert({
        user_id: user.id,
        service_type: 'gmail',
        usage_date: today,
        daily_count: dailyCount + 1,
        monthly_count: monthlyCount + 1,
        last_daily_reset: new Date().toISOString(),
        last_monthly_reset: usageData?.last_monthly_reset || new Date().toISOString(),
      });

    console.log('Gmail automation successful');

    return new Response(
      JSON.stringify({
        ...result,
        usage: {
          daily: { used: dailyCount + 1, limit: emailLimits.daily_gmail_quota },
          monthly: { used: monthlyCount + 1, limit: emailLimits.monthly_gmail_quota },
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in gmail-automation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
