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
        // Fallback: use right with clamping
        placement = 'right';
        left = triggerRect.right + gap;
        top = triggerRect.top;
        clamped = true;
      }

      // Clamp horizontal position
      left = Math.max(margin, Math.min(left, window.innerWidth - popoverWidth - margin));

      // Clamp vertical position
      top = Math.max(margin, Math.min(top, window.innerHeight - popoverHeight - margin));

      setPosition({ top, left, placement, clamped });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
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