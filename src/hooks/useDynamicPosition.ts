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

      // Calculate horizontal position
      const spaceRight = viewport.width - triggerRect.right;
      const spaceLeft = triggerRect.left;

      if (spaceRight >= cardWidth + 16) {
        // Enough space on right
        newPosition.left = triggerRect.width;
      } else if (spaceLeft >= cardWidth + 16) {
        // Not enough space on right, try left
        newPosition.right = triggerRect.width;
      } else {
        // Not enough space on either side, center over trigger
        newPosition.left = Math.max(-triggerRect.left + 16, -(cardWidth - triggerRect.width) / 2);
      }

      // Calculate vertical position
      const spaceBelow = viewport.height - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      if (spaceBelow >= cardHeight + 16) {
        // Enough space below
        newPosition.top = 0;
      } else if (spaceAbove >= cardHeight + 16) {
        // Not enough space below, try above
        newPosition.bottom = triggerRect.height;
      } else {
        // Not enough space above or below, position to fit in viewport
        const maxTop = viewport.height - cardHeight - 16;
        const idealTop = -triggerRect.top + 16;
        newPosition.top = Math.min(idealTop, maxTop);
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