import { useEffect, useRef, useState } from 'react';

interface Position {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export const useDynamicPosition = (isVisible: boolean, cardWidth = 320, cardHeight = 400) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({ left: '100%', top: '-5rem' } as any);

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

      // Calculate horizontal position with better edge handling
      const spaceRight = viewport.width - triggerRect.right;
      const spaceLeft = triggerRect.left;
      const minMargin = 20; // Minimum margin from viewport edges

      if (spaceRight >= cardWidth + minMargin) {
        // Enough space on right
        newPosition.left = triggerRect.width;
      } else if (spaceLeft >= cardWidth + minMargin) {
        // Not enough space on right, try left
        newPosition.right = triggerRect.width;
      } else {
        // Not enough space on either side, position to stay within viewport
        const maxLeftOffset = viewport.width - cardWidth - minMargin;
        const idealLeftOffset = -triggerRect.left + minMargin;
        newPosition.left = Math.max(idealLeftOffset, Math.min(0, maxLeftOffset - triggerRect.left));
      }

      // Calculate vertical position with better edge handling
      const spaceBelow = viewport.height - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      if (spaceBelow >= cardHeight + minMargin) {
        // Enough space below
        newPosition.top = triggerRect.height + 8;
      } else if (spaceAbove >= cardHeight + minMargin) {
        // Not enough space below, position above
        newPosition.bottom = triggerRect.height + 8;
      } else {
        // Not enough space above or below, position to fit in viewport
        if (spaceBelow > spaceAbove) {
          // More space below, position at bottom of viewport
          newPosition.top = viewport.height - triggerRect.bottom - cardHeight - minMargin;
        } else {
          // More space above, position at top of viewport
          newPosition.top = -triggerRect.top + minMargin;
        }
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
      position: 'absolute',
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