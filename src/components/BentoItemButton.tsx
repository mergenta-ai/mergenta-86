import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BentoCardItem } from '@/config/bentoGridConfig';

interface BentoItemButtonProps {
  item: BentoCardItem;
  onClose: () => void;
  onPromptGenerated?: (prompt: string) => void;
  onModalOpen?: (modalType: string) => void;
}

export const BentoItemButton = ({ 
  item, 
  onClose, 
  onPromptGenerated,
  onModalOpen 
}: BentoItemButtonProps) => {
  // If item has a component (HoverCard wrapper), render it
  if (item.component) {
    return (
      <div onClick={onClose}>
        {item.component(onPromptGenerated)}
      </div>
    );
  }

  // If item has modalType, handle modal opening
  if ('modalType' in item && item.modalType && onModalOpen) {
    return (
      <button
        className={cn(
          'w-full text-left px-6 py-4 rounded-xl',
          'bg-white hover:bg-purple-50 border border-purple-100',
          'transition-colors duration-200',
          'min-h-[60px] flex items-center justify-between',
          'text-base font-medium text-gray-700 hover:text-purple-600'
        )}
        onClick={() => {
          onModalOpen(item.modalType as string);
          onClose();
        }}
      >
        <span>{item.text}</span>
        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
      </button>
    );
  }

  // Otherwise, plain button
  return (
    <button
      className={cn(
        'w-full text-left px-6 py-4 rounded-xl',
        'bg-white hover:bg-purple-50 border border-purple-100',
        'transition-colors duration-200',
        'min-h-[60px] flex items-center justify-between',
        'text-base font-medium text-gray-700 hover:text-purple-600'
      )}
      onClick={onClose}
    >
      <span>{item.text}</span>
      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
    </button>
  );
};
