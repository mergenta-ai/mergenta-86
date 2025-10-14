import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks/useDevice';

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
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[75%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-4 bg-white rounded-t-[20px] flex-1 overflow-y-auto">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
              <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
              <div className="pb-6">
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="p-2">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileHoverCardWrapper;