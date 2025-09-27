import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const elevenLabsKey = Deno.env.get('ELEVENLABS_API_KEY');

interface TTSRequest {
  text: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

interface TTSResponse {
  audioUrl?: string;
  audioContent?: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!elevenLabsKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const { 
      text, 
      voiceId = 'EXAVITQu4vr4xnSDxMaL', // Sarah voice by default
      modelId = 'eleven_multilingual_v2',
      stability = 0.5,
      similarityBoost = 0.8,
      style = 0.0,
      useSpeakerBoost = true
    }: TTSRequest = await req.json();

    if (!text || text.trim().length === 0) {
      throw new Error('Text is required for speech synthesis');
    }

    if (text.length > 5000) {
      throw new Error('Text too long. Maximum 5000 characters allowed.');
    }

    console.log('ElevenLabs TTS request:', { voiceId, modelId, textLength: text.length });

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsKey
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: useSpeakerBoost
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      
      let errorMessage = 'Failed to generate speech';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail?.message || errorData.message || errorMessage;
      } catch (e) {
        // Use default error message
      }
      
      throw new Error(errorMessage);
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log('TTS generated successfully, audio size:', arrayBuffer.byteLength);

    const ttsResponse: TTSResponse = {
      audioContent: base64Audio
    };

    return new Response(JSON.stringify(ttsResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    
    const errorResponse: TTSResponse = {
      error: (error as Error).message || 'Internal server error'
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});