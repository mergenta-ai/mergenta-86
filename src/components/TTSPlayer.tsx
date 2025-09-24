import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

interface TTSPlayerProps {
  text: string;
  isVisible: boolean;
  onClose: () => void;
}

const VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Soft American female' },
  { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', description: 'Confident American female' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Confident American male' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Casual American male' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Warm British male' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', description: 'Intense American male' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Young American male' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Seductive American female' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Gentle British female' }
];

const TTSPlayer: React.FC<TTSPlayerProps> = ({ text, isVisible, onClose }) => {
  const [selectedVoice, setSelectedVoice] = useState('EXAVITQu4vr4xnSDxMaL'); // Sarah
  const [stability, setStability] = useState([0.5]);
  const [similarityBoost, setSimilarityBoost] = useState([0.8]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast.error('No text to convert to speech');
      return;
    }

    if (text.length > 5000) {
      toast.error('Text is too long. Maximum 5000 characters allowed.');
      return;
    }

    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: text.trim(),
          voiceId: selectedVoice,
          stability: stability[0],
          similarityBoost: similarityBoost[0]
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.audioContent) {
        // Convert base64 to blob URL
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Clean up previous audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        
        toast.success('Speech generated successfully!');
      }

    } catch (error: any) {
      console.error('TTS Error:', error);
      toast.error(error.message || 'Failed to generate speech');
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = () => {
    if (!audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      toast.error('Failed to play audio');
    };

    audio.play().catch(error => {
      console.error('Audio play error:', error);
      toast.error('Failed to play audio');
    });
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const selectedVoiceInfo = VOICES.find(v => v.id === selectedVoice);

  if (!isVisible) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Volume2 className="h-5 w-5" />
          Text to Speech
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice</label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICES.map(voice => (
                <SelectItem key={voice.id} value={voice.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{voice.name}</span>
                    <span className="text-xs text-muted-foreground">{voice.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Stability: {stability[0].toFixed(1)}
            </label>
            <Slider
              value={stability}
              onValueChange={setStability}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Higher values make speech more stable but less expressive
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Similarity Boost: {similarityBoost[0].toFixed(1)}
            </label>
            <Slider
              value={similarityBoost}
              onValueChange={setSimilarityBoost}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Higher values enhance voice similarity but may reduce stability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button 
            onClick={generateSpeech} 
            disabled={isGenerating || !text.trim()}
            size="sm"
            className="flex-1"
          >
            {isGenerating ? 'Generating...' : 'Generate Speech'}
          </Button>
          
          {audioUrl && (
            <div className="flex gap-1">
              <Button
                onClick={isPlaying ? pauseAudio : playAudio}
                variant="outline"
                size="sm"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                onClick={stopAudio}
                variant="outline"
                size="sm"
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Characters: {text.length}/5000
          </p>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TTSPlayer;