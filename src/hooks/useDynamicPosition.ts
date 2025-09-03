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
    if (!isVisible) return;

    const updatePosition = () => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Fixed position specifications based on screenshot:
      // - 24px from right edge of viewport
      // - 180px from top of viewport
      // - Ensure card stays within viewport bounds
      
      const rightMargin = 24;
      const topPosition = 180;
      const minTopMargin = 20;
      const minBottomMargin = 20;

      let newPosition: Position = {};

      // Fixed horizontal position: 24px from right edge
      newPosition.right = rightMargin;

      // Fixed vertical position: 180px from top, but ensure it fits in viewport
      const maxTop = viewport.height - cardHeight - minBottomMargin;
      const idealTop = topPosition;
      
      if (idealTop + cardHeight + minBottomMargin <= viewport.height) {
        // Card fits at ideal position
        newPosition.top = idealTop;
      } else if (maxTop >= minTopMargin) {
        // Position at maximum allowed top to fit in viewport
        newPosition.top = maxTop;
      } else {
        // Viewport too small, position with minimum top margin
        newPosition.top = minTopMargin;
      }

      setPosition(newPosition);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, cardWidth, cardHeight]);

  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: 'fixed', // Changed from absolute to fixed for viewport positioning
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