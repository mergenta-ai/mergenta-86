import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileHoverCardWrapperProps {
  children: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const MobileHoverCardWrapper: React.FC<MobileHoverCardWrapperProps> = ({
  children,
  title,
  content
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Trigger asChild>
          <div className="cursor-pointer touch-manipulation">
            {children}
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-[20px] h-[80vh] fixed bottom-0 left-0 right-0 z-50 border border-border">
            <div className="p-4 bg-background rounded-t-[20px] flex-1 overflow-y-auto">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-4" />
              <h2 className="text-xl font-semibold mb-4 text-center text-foreground">{title}</h2>
              <div className="pb-6 w-full max-w-lg mx-auto">
                {content}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
        <div className="p-2">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div className="w-full">
            {content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileHoverCardWrapper;