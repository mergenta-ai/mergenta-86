import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BentoItemButton } from './BentoItemButton';
import type { BentoCardItem } from '@/config/bentoGridConfig';

interface BentoItemsDrawerProps {
  title: string;
  items: BentoCardItem[];
  onClose: () => void;
  onPromptGenerated?: (prompt: string) => void;
  onModalOpen?: (modalType: string) => void;
}

export const BentoItemsDrawer = ({ 
  title, 
  items, 
  onClose, 
  onPromptGenerated,
  onModalOpen 
}: BentoItemsDrawerProps) => {
  const isMobile = useIsMobile();

  const renderItems = () => {
    return (
      <div className="space-y-2">
        {items.map((item, idx) => {
          // If item has subItems, render as accordion
          if (item.subItems && item.subItems.length > 0) {
            return (
              <Accordion key={idx} type="single" collapsible className="w-full">
                <AccordionItem value={item.text} className="border-none">
                  <AccordionTrigger className="text-lg font-semibold px-4 py-3 hover:no-underline hover:bg-purple-50 rounded-xl transition-colors">
                    {item.text}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="space-y-2 pl-2">
                      {item.subItems.map((subItem, subIdx) => (
                        <BentoItemButton
                          key={subIdx}
                          item={subItem}
                          onClose={onClose}
                          onPromptGenerated={onPromptGenerated}
                          onModalOpen={onModalOpen}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          }

          // Otherwise, render as regular button
          return (
            <BentoItemButton
              key={idx}
              item={item}
              onClose={onClose}
              onPromptGenerated={onPromptGenerated}
              onModalOpen={onModalOpen}
            />
          );
        })}
      </div>
    );
  };

  if (isMobile) {
    return (
      <Sheet open onOpenChange={onClose}>
        <SheetContent 
          side="bottom" 
          className="h-[80vh] rounded-t-3xl"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-semibold text-purple-primary">
              {title}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-80px)]">
            <div className="px-4 pb-8">
              {renderItems()}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Dialog modal
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-purple-primary">
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="pr-4">
            {renderItems()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
