import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useDevice';

export default function MobileHoverCardWrapper({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Keyboard support
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open || !contentRef.current) return;

    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the modal content
    const focusableElements = contentRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (firstElement) {
      firstElement.focus();
    }

    // Trap focus within modal
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    // Restore focus on close
    return () => {
      document.removeEventListener('keydown', handleTab);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  if (!isMobile) return <>{children}</>;

  return (
    <div className="relative">
      <div 
        onClick={() => setOpen(v => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(v => !v);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {trigger}
      </div>
      {open && (
        <div 
          className="fixed inset-0 z-overlay flex items-end justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in-0 duration-200" 
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div 
            ref={contentRef}
            className="z-modal bg-popover text-popover-foreground rounded-lg shadow-lg p-4 max-w-[95%] max-h-[85vh] overflow-y-auto scrollbar-thin animate-in slide-in-from-bottom-4 duration-300" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-dialog-title"
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
