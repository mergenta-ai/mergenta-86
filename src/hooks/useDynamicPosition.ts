import { useEffect, useRef, useState } from 'react';

type Placement = 'right' | 'left' | 'top' | 'bottom';

interface Position {
  top: number;
  left: number;
  placement: Placement;
  clamped: boolean;
}

export const useDynamicPosition = (isVisible: boolean, popoverWidth = 320, popoverHeight = 400) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, placement: 'right', clamped: false });

  useEffect(() => {
    if (!isVisible || !triggerRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const gap = 8;
      const margin = 8;

      // Calculate available space in each direction
      const spaceRight = window.innerWidth - triggerRect.right - gap;
      const spaceLeft = triggerRect.left - gap;
      const spaceTop = triggerRect.top - gap;
      const spaceBottom = window.innerHeight - triggerRect.bottom - gap;

      let placement: Placement = 'right';
      let top = 0;
      let left = 0;
      let clamped = false;

      // Prefer right, then left, then top, then bottom
      if (spaceRight >= popoverWidth) {
        placement = 'right';
        left = triggerRect.right + gap;
        top = triggerRect.top;
      } else if (spaceLeft >= popoverWidth) {
        placement = 'left';
        left = triggerRect.left - popoverWidth - gap;
        top = triggerRect.top;
      } else if (spaceTop >= popoverHeight) {
        placement = 'top';
        top = triggerRect.top - popoverHeight - gap;
        left = triggerRect.left;
      } else if (spaceBottom >= popoverHeight) {
        placement = 'bottom';
        top = triggerRect.bottom + gap;
        left = triggerRect.left;
      } else {
        // Fallback: center on screen with clamping when no ideal position exists
        placement = 'right';
        const centerX = window.innerWidth / 2 - popoverWidth / 2;
        const centerY = window.innerHeight / 2 - popoverHeight / 2;
        
        // Try to position near trigger but fallback to center if needed
        left = spaceRight > spaceLeft ? triggerRect.right + gap : triggerRect.left - popoverWidth - gap;
        top = triggerRect.top;
        
        // If still doesn't fit, center it
        if (left < margin || left + popoverWidth > window.innerWidth - margin) {
          left = centerX;
          clamped = true;
        }
        if (top < margin || top + popoverHeight > window.innerHeight - margin) {
          top = centerY;
          clamped = true;
        }
      }

      // Clamp horizontal position with proper bounds checking
      left = Math.max(margin, Math.min(left, window.innerWidth - popoverWidth - margin));

      // Clamp vertical position with proper bounds checking
      top = Math.max(margin, Math.min(top, window.innerHeight - popoverHeight - margin));

      // Mark as clamped if position was adjusted
      if (left === margin || left === window.innerWidth - popoverWidth - margin) {
        clamped = true;
      }
      if (top === margin || top === window.innerHeight - popoverHeight - margin) {
        clamped = true;
      }

      setPosition({ top, left, placement, clamped });
    };

    updatePosition();
    
    // Use passive listeners for better performance
    window.addEventListener('scroll', updatePosition, { passive: true, capture: true });
    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, popoverWidth, popoverHeight]);

  const getPositionStyles = (): React.CSSProperties => {
    return {
      position: 'fixed',
      top: `${position.top}px`,
      left: `${position.left}px`,
      zIndex: 50,
    };
  };

  return { triggerRef, getPositionStyles, position };
};