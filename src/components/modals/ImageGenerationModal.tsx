import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageGenerationModal = ({ isOpen, onClose }: ImageGenerationModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [quota, setQuota] = useState<{ used: number; limit: number } | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('image-generation', {
        body: { prompt, size, quality }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        if (data.quota) {
          setQuota(data.quota);
        }
        return;
      }

      setGeneratedImage(data.image);
      setQuota(data.quota);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `mergenta-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700">Image Generation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quota Display */}
          {quota && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                <span className="font-semibold">Monthly Usage:</span> {quota.used} / {quota.limit} images
              </p>
            </div>
          )}

          {/* Prompt Input */}
          <div>
            <Label htmlFor="image-prompt" className="text-sm font-medium text-gray-700">
              Image Prompt *
            </Label>
            <Textarea
              id="image-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="mt-1 min-h-[100px]"
              disabled={isGenerating}
            />
          </div>

          {/* Size Selection */}
          <div>
            <Label htmlFor="size" className="text-sm font-medium text-gray-700">
              Image Size
            </Label>
            <Select value={size} onValueChange={setSize} disabled={isGenerating}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
                <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quality Selection */}
          <div>
            <Label htmlFor="quality" className="text-sm font-medium text-gray-700">
              Quality
            </Label>
            <Select value={quality} onValueChange={setQuality} disabled={isGenerating}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="hd">HD (Max plan only)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>

          {/* Generated Image Display */}
          {generatedImage && (
            <div className="space-y-3">
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={generatedImage} 
                  alt="Generated image" 
                  className="w-full h-auto"
                />
              </div>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
