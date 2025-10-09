import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadResult {
  success: boolean;
  extractedText?: string;
  pagesExtracted?: number;
  usage?: {
    used: number;
    limit: number;
  };
}

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocument = async (file: File): Promise<UploadResult | null> => {
    setIsUploading(true);
    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error('Unsupported file type. Please upload PDF, DOCX, TXT, or Excel files.');
        return null;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File too large. Maximum size is 10MB.');
        return null;
      }

      // Convert file to base64
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data URL prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call document-upload edge function
      const { data, error } = await supabase.functions.invoke('document-upload', {
        body: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileBase64,
        },
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes('limit exceeded')) {
          toast.error(`${data.error}. Used: ${data.used}/${data.limit}`);
        } else {
          toast.error(data.error);
        }
        return null;
      }

      toast.success(`Document uploaded successfully! ${data.pagesExtracted} pages extracted.`);
      return data;
    } catch (error: any) {
      console.error('Document upload error:', error);
      toast.error(error.message || 'Failed to upload document');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadDocument, isUploading };
};
