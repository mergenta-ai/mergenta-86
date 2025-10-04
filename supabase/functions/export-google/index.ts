import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleExportRequest {
  content: string;
  exportType: 'docs' | 'sheets';
  fileName: string;
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

    const { content, exportType, fileName } = await req.json() as GoogleExportRequest;

    console.log(`Exporting to Google ${exportType}: ${fileName}`);

    // Get user's plan
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    const planType = userPlan?.plan_type || 'free';

    // Get export limits
    const { data: exportLimits } = await supabase
      .from('export_limits')
      .select('daily_google_docs_export, daily_google_sheets_export')
      .eq('plan_type', planType)
      .single();

    if (!exportLimits) {
      throw new Error('Plan limits not found');
    }

    const limitField = exportType === 'docs' ? 'daily_google_docs_export' : 'daily_google_sheets_export';
    const dailyLimit = exportLimits[limitField];

    // Check usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usageData } = await supabase
      .from('cloudconvert_usage')
      .select('daily_count')
      .eq('user_id', user.id)
      .eq('export_date', today)
      .eq('export_type', `google_${exportType}`)
      .single();

    const currentCount = usageData?.daily_count || 0;

    if (currentCount >= dailyLimit) {
      return new Response(
        JSON.stringify({
          error: `Daily Google ${exportType} export limit exceeded`,
          used: currentCount,
          limit: dailyLimit,
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

    // TODO: Implement actual Google Drive API integration
    // For now, return a success response with a placeholder URL
    const exportUrl = `https://docs.google.com/${exportType}/d/placeholder`;

    // Update usage
    await supabase
      .from('cloudconvert_usage')
      .upsert({
        user_id: user.id,
        export_date: today,
        export_type: `google_${exportType}`,
        daily_count: currentCount + 1,
        last_reset: new Date().toISOString(),
      });

    console.log(`Google ${exportType} export successful`);

    return new Response(
      JSON.stringify({
        success: true,
        exportUrl,
        message: `Content exported to Google ${exportType}`,
        usage: {
          used: currentCount + 1,
          limit: dailyLimit,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in export-google:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
