import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioBase64 } = await req.json();
    
    if (!audioBase64) {
      throw new Error('No audio data provided');
    }

    const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!GOOGLE_CLOUD_API_KEY) {
      throw new Error('GOOGLE_CLOUD_API_KEY not configured');
    }

    console.log('Calling Google Cloud Speech-to-Text API...');

    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
          },
          audio: {
            content: audioBase64,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Google STT error:', error);
      throw new Error(`Google STT API error: ${error}`);
    }

    const result = await response.json();
    console.log('Google STT result:', result);

    const transcript = result.results?.[0]?.alternatives?.[0]?.transcript || '';

    return new Response(
      JSON.stringify({ text: transcript }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in google-stt:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
