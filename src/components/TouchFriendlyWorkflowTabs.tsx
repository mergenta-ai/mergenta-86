import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer } from 'vaul';
import { Button } from './ui/button';
import MobileHoverCardWrapper from './MobileHoverCardWrapper';
import BrainstormHoverCard from './hover-cards/BrainstormHoverCard';
import EssayHoverCard from './hover-cards/EssayHoverCard';
import StoryHoverCard from './hover-cards/StoryHoverCard';
import FlashFictionHoverCard from './hover-cards/FlashFictionHoverCard';

interface TouchFriendlyWorkflowTabsProps {
  onAddToChat?: (message: string, response: string) => void;
  onPromptGenerated?: (prompt: string) => void;
}

const TouchFriendlyWorkflowTabs: React.FC<TouchFriendlyWorkflowTabsProps> = ({ onAddToChat, onPromptGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const categories = [
    {
      id: 'beautiful-writing',
      title: 'Beautiful Writing',
      items: [
        { id: 'essay', title: 'Essay', component: EssayHoverCard },
        { id: 'story', title: 'Story', component: StoryHoverCard },
        { id: 'flash-fiction', title: 'Flash Fiction', component: FlashFictionHoverCard },
      ]
    },
    {
      id: 'task-assistant',
      title: 'Task Assistant',
      items: [
        { id: 'brainstorm', title: 'Brainstorm', component: BrainstormHoverCard },
      ]
    },
  ];

  const renderContent = (item: any) => {
    const Component = item.component;
    return (
      <Component onPromptGenerated={onPromptGenerated}>
        <div className="p-4">
          <Button 
            className="w-full h-12 text-lg font-medium"
            onClick={() => {
              console.log(`Selected: ${item.title}`);
              if (onAddToChat) {
                onAddToChat(`Start ${item.title}`, `Starting ${item.title} workflow...`);
              }
            }}
          >
            Start {item.title}
          </Button>
        </div>
      </Component>
    );
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            size="icon"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Workflow Drawer */}
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[90%] mt-24 fixed bottom-0 left-0 right-0">
              <div className="p-4 bg-white rounded-t-[20px] flex-1 overflow-y-auto">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-6" />
                <h2 className="text-2xl font-bold mb-6 text-center">Workflows</h2>
                
                {categories.map((category) => (
                  <div key={category.id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">{category.title}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {category.items.map((item) => (
                        <MobileHoverCardWrapper
                          key={item.id}
                          title={item.title}
                          content={renderContent(item)}
                        >
                          <Button 
                            variant="outline" 
                            className="w-full h-12 justify-start text-left font-medium"
                          >
                            {item.title}
                            <ChevronRight className="ml-auto h-4 w-4" />
                          </Button>
                        </MobileHoverCardWrapper>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </>
    );
  }

  // Desktop version - return null as original WorkflowTabs will handle
  return null;
};

export default TouchFriendlyWorkflowTabs;