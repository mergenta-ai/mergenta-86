import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileResponsiveHoverCardProps {
  children: React.ReactNode;
  title: string;
  content: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const MobileResponsiveHoverCard: React.FC<MobileResponsiveHoverCardProps> = ({
  children,
  title,
  content,
  onPromptGenerated
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowCard(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setShowCard(false);
      }, 300);
    }
  };

  const handleCardEnter = () => {
    if (!isMobile && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleCardLeave = () => {
    if (!isMobile) {
      setShowCard(false);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(true);
    }
  };

  // Handle click outside for desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowCard(false);
      }
    };

    if (showCard && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCard, isMobile]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isMobile) {
    return (
      <>
        <div 
          className="cursor-pointer touch-manipulation"
          onClick={handleClick}
        >
          {children}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="p-2">
              <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
              <div className="w-full">
                {content}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="relative">
      <div
        className="cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
      </div>
      
      {showCard && (
        <div
          ref={cardRef}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-[60] 
                     bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 max-w-[90vw]
                     animate-in fade-in-0 zoom-in-95 duration-200"
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleCardLeave}
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            position: 'absolute',
            top: '100%',
            marginTop: '8px'
          }}
        >
          <h3 className="text-base font-semibold mb-3 text-center">{title}</h3>
          <div className="w-full">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileResponsiveHoverCard;