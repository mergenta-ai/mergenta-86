import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/useDevice';

export default function MobileHoverCardWrapper({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!isMobile) return <>{children}</>;

  return (
    <div className="relative">
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && (
        <div className="fixed inset-0 z-overlay flex items-end justify-center p-4 bg-black/20" onClick={() => setOpen(false)}>
          <div className="z-modal bg-popover rounded-lg shadow-lg p-3 max-w-[95%]" onClick={(e)=>e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
