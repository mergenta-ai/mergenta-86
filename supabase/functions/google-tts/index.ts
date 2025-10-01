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
    const { text, voiceConfig } = await req.json();
    
    if (!text) {
      throw new Error('No text provided');
    }

    const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!GOOGLE_CLOUD_API_KEY) {
      throw new Error('GOOGLE_CLOUD_API_KEY not configured');
    }

    console.log('Calling Google Cloud Text-to-Speech API...');

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voiceConfig?.languageCode || 'en-US',
            name: voiceConfig?.name || 'en-US-Neural2-C',
            ssmlGender: voiceConfig?.ssmlGender || 'FEMALE',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: voiceConfig?.speakingRate || 1.0,
            pitch: voiceConfig?.pitch || 0.0,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Google TTS error:', error);
      throw new Error(`Google TTS API error: ${error}`);
    }

    const result = await response.json();
    console.log('Google TTS generated audio');

    return new Response(
      JSON.stringify({ audioContent: result.audioContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in google-tts:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
