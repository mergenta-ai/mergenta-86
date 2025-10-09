import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone');
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No active recording'));
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);

        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          console.log('Audio blob size:', audioBlob.size);

          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];

            // Call talk-mode-router for transcription
            const { data, error } = await supabase.functions.invoke('talk-mode-router', {
              body: {
                action: 'stt',
                audioBase64: base64Audio,
              },
            });

            setIsTranscribing(false);

            if (error) {
              console.error('Transcription error:', error);
              toast.error('Failed to transcribe audio');
              reject(error);
              return;
            }

            if (data.error) {
              if (data.error.includes('limit exceeded')) {
                toast.error(`Daily talk mode limit reached: ${data.used}/${data.limit} minutes`);
              } else {
                toast.error(data.error);
              }
              reject(new Error(data.error));
              return;
            }

            console.log('Transcription:', data.text);
            
            // Show usage info
            if (data.usage) {
              toast.info(`Talk mode: ${data.usage.used}/${data.usage.limit} minutes used today`);
            }

            resolve(data.text || '');
          };

          reader.onerror = () => {
            setIsTranscribing(false);
            reject(new Error('Failed to read audio file'));
          };
        } catch (error) {
          setIsTranscribing(false);
          console.error('Error processing recording:', error);
          toast.error('Failed to process recording');
          reject(error);
        }

        // Stop all tracks
        if (mediaRecorderRef.current?.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
  };
};
