import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentUploadRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileBase64: string;
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

    const { fileName, fileType, fileSize, fileBase64 } = await req.json() as DocumentUploadRequest;

    console.log(`Processing document upload: ${fileName} (${fileType}, ${fileSize} bytes)`);

    // Get user's plan
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    const planType = userPlan?.plan_type || 'free';

    // Get export limits for the plan
    const { data: exportLimits } = await supabase
      .from('export_limits')
      .select('daily_document_upload, max_document_pages')
      .eq('plan_type', planType)
      .single();

    if (!exportLimits) {
      throw new Error('Plan limits not found');
    }

    // Check daily usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usageData } = await supabase
      .from('document_upload_usage')
      .select('daily_count, last_reset')
      .eq('user_id', user.id)
      .eq('upload_date', today)
      .single();

    const currentCount = usageData?.daily_count || 0;

    if (currentCount >= exportLimits.daily_document_upload) {
      return new Response(
        JSON.stringify({
          error: 'Daily document upload limit exceeded',
          used: currentCount,
          limit: exportLimits.daily_document_upload,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse document using Google Document AI (via Cloud API)
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('Google Cloud API key not configured');
    }

    // Simulate document parsing (replace with actual Google Doc AI integration)
    let extractedText = '';
    let pagesExtracted = 1;

    if (fileType === 'application/pdf' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For now, return a placeholder response
      // In production, integrate with Google Document AI
      extractedText = `Extracted content from ${fileName}. This is a placeholder for actual document parsing.`;
      pagesExtracted = Math.min(5, exportLimits.max_document_pages);
    } else if (fileType === 'text/plain') {
      // Decode base64 text file
      const decodedText = atob(fileBase64);
      extractedText = decodedText;
      pagesExtracted = 1;
    } else {
      throw new Error('Unsupported file type');
    }

    // Update usage
    await supabase
      .from('document_upload_usage')
      .upsert({
        user_id: user.id,
        upload_date: today,
        daily_count: currentCount + 1,
        file_name: fileName,
        file_size: fileSize,
        pages_extracted: pagesExtracted,
        last_reset: new Date().toISOString(),
      });

    console.log(`Document parsed successfully: ${pagesExtracted} pages extracted`);

    return new Response(
      JSON.stringify({
        success: true,
        extractedText,
        pagesExtracted,
        usage: {
          used: currentCount + 1,
          limit: exportLimits.daily_document_upload,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in document-upload:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
