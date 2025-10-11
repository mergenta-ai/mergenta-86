import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BentoItemsDrawer } from './BentoItemsDrawer';
import type { BentoCardItem } from '@/config/bentoGridConfig';

interface BentoCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  items?: BentoCardItem[];
  onClick?: () => void;
  onPromptGenerated?: (prompt: string) => void;
  onModalOpen?: (modalType: string) => void;
  modalType?: string;
}

export const BentoCard = ({
  id,
  title,
  subtitle,
  icon: Icon,
  gradient,
  items,
  onClick,
  onPromptGenerated,
  onModalOpen,
  modalType,
}: BentoCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (modalType && onModalOpen) {
      onModalOpen(modalType);
    } else if (onClick) {
      onClick();
    } else if (items) {
      setIsExpanded(true);
    }
  };

  return (
    <>
      {/* Main Card */}
      <div
        onClick={handleClick}
        className={cn(
          'relative rounded-2xl p-6 cursor-pointer transition-all duration-200',
          'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
          'min-h-[180px] sm:min-h-[160px]',
          'flex flex-col justify-between',
          gradient
        )}
        role="button"
        tabIndex={0}
        aria-label={`Open ${title} options`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Icon */}
        <Icon className="h-12 w-12 sm:h-10 sm:w-10 text-white mb-4 drop-shadow-sm" />
        
        {/* Text Content */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-1 drop-shadow-sm">
            {title}
          </h3>
          <p className="text-sm text-white/90 drop-shadow-sm">
            {subtitle}
          </p>
        </div>
        
        {/* Expand indicator (if has items) */}
        {items && items.length > 0 && (
          <ChevronRight 
            className="absolute bottom-4 right-4 h-5 w-5 text-white/70" 
            aria-hidden="true"
          />
        )}
      </div>

      {/* Items Drawer */}
      {items && items.length > 0 && isExpanded && (
        <BentoItemsDrawer
          title={title}
          items={items}
          onClose={() => setIsExpanded(false)}
          onPromptGenerated={onPromptGenerated}
          onModalOpen={onModalOpen}
        />
      )}
    </>
  );
};
