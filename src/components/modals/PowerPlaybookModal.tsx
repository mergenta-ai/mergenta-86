import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface PowerPlaybookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToChat?: (message: string, response: string) => void;
}

export const PowerPlaybookModal = ({ open, onOpenChange, onAddToChat }: PowerPlaybookModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 w-full h-full max-w-none max-h-none m-0 p-0 bg-pastel-lavender rounded-none border-none">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-12 pb-8">
          <h1 className="text-4xl font-bold text-mergenta-deep-violet mb-4">Power Playbook</h1>
          <p className="text-lg text-mergenta-dark-grey max-w-2xl text-center">
            Discover powerful workflows and strategies to enhance your productivity and creativity
          </p>
        </div>

        {/* Content area for tiles - will be populated in next iteration */}
        <div className="flex-1 px-12 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Placeholder for tiles - user will provide categories in next prompt */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Tiles will be added here based on user's requirements */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};