import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload, User } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  currentImageUrl: string;
  onImageUpload: (url: string) => void;
  loading?: boolean;
}

export const ProfileImageUpload = ({ 
  currentImageUrl, 
  onImageUpload, 
  loading = false 
}: ProfileImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // For now, we'll use the object URL as the image URL
      // In a real implementation, you would upload to Supabase Storage
      onImageUpload(objectUrl);
      
      toast.success('Profile image updated');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-4 border-pastel-violet shadow-soft">
          <AvatarImage src={displayUrl} alt="Profile" />
          <AvatarFallback className="bg-gradient-primary text-white text-xl">
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay with camera icon */}
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleFileSelect}
        disabled={uploading || loading}
        className="border-pastel-violet hover:bg-pastel-violet"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : 'Change Photo'}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground text-center">
        Recommended: Square image, at least 300x300px
        <br />
        Max size: 5MB
      </p>
    </div>
  );
};