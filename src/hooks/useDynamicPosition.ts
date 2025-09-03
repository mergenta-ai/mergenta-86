import { useEffect, useRef, useState } from 'react';

interface Position {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export const useDynamicPosition = (isVisible: boolean, cardWidth = 320, cardHeight = 400) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({});

  useEffect(() => {
    if (!isVisible || !triggerRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let newPosition: Position = {};

      // Position specifications for card next to dropdown menu:
      // - Horizontally: Right next to the trigger element
      // - Vertically: Aligned with top of trigger, but ensure full visibility
      
      const horizontalGap = 8; // Small gap between menu and card
      const minMargin = 20; // Minimum margin from viewport edges

      // Horizontal positioning: Always to the right of the trigger
      newPosition.left = triggerRect.width + horizontalGap;

      // Vertical positioning: Align with trigger top, but ensure card fits in viewport  
      const triggerTop = triggerRect.top;
      const maxTop = viewport.height - cardHeight - minMargin;
      
      if (triggerTop + cardHeight + minMargin <= viewport.height) {
        // Card fits when aligned with trigger top
        newPosition.top = 0; // Relative to trigger
      } else if (maxTop - triggerTop >= -triggerRect.height) {
        // Position to fit within viewport
        newPosition.top = maxTop - triggerTop;
      } else {
        // Position at top of viewport with minimum margin
        newPosition.top = -triggerTop + minMargin;
      }

      setPosition(newPosition);
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, cardWidth, cardHeight]);

  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: 'absolute', // Changed back to absolute for trigger-relative positioning
      zIndex: 50,
    };

    if (position.left !== undefined) {
      styles.left = typeof position.left === 'number' ? `${position.left}px` : position.left;
    }
    if (position.right !== undefined) {
      styles.right = typeof position.right === 'number' ? `${position.right}px` : position.right;
    }
    if (position.top !== undefined) {
      styles.top = typeof position.top === 'number' ? `${position.top}px` : position.top;
    }
    if (position.bottom !== undefined) {
      styles.bottom = typeof position.bottom === 'number' ? `${position.bottom}px` : position.bottom;
    }

    return styles;
  };

  return { triggerRef, getPositionStyles };
};