import React, { useState } from 'react';
import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks/useDevice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MobileResponsiveHoverCardProps {
  children: React.ReactNode;
  title?: string;
}

const MobileResponsiveHoverCard: React.FC<MobileResponsiveHoverCardProps> = ({ 
  children, 
  title = "Workflow" 
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    // On mobile, wrap in a Dialog that opens as full-screen modal
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            {children}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {/* Clone children and close modal on form submission */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  onPromptGenerated: (prompt: string) => {
                    // Call original onPromptGenerated if it exists
                    if (child.props.onPromptGenerated) {
                      child.props.onPromptGenerated(prompt);
                    }
                    // Close the modal
                    setOpen(false);
                  }
                } as any);
              }
              return child;
            })}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // On desktop, just return children as-is (hover cards work normally)
  return <>{children}</>;
};

export default MobileResponsiveHoverCard;