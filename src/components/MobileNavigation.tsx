import React, { useState } from 'react';
import { Menu, X, Clock, FileText, Crown, HelpCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Drawer } from 'vaul';
import HistoryPanel from './sidebar/HistoryPanel';
import PoliciesPanel from './sidebar/PoliciesPanel';
import HelpPanel from './sidebar/HelpPanel';
import { ProfilePanel } from './sidebar/ProfilePanel';
import PlansPanel from './sidebar/PlansPanel';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'history', icon: Clock, label: 'History', color: 'pastel-magenta' },
    { id: 'policies', icon: FileText, label: 'Policies', color: 'pastel-violet' },
    { id: 'plans', icon: Crown, label: 'Plans', color: 'pastel-lavender' },
    { id: 'help', icon: HelpCircle, label: 'Help', color: 'pastel-magenta' },
    { id: 'profile', icon: User, label: 'Profile', color: 'pastel-violet' },
  ];

  const handleItemClick = (itemId: string) => {
    setActivePanel(itemId);
    setIsOpen(false);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'history':
        return <HistoryPanel isVisible={true} onClose={() => setActivePanel(null)} />;
      case 'policies':
        return <PoliciesPanel isVisible={true} onClose={() => setActivePanel(null)} navigate={navigate} />;
      case 'plans':
        return <PlansPanel isVisible={true} onClose={() => setActivePanel(null)} navigate={navigate} />;
      case 'help':
        return <HelpPanel isVisible={true} onClose={() => setActivePanel(null)} />;
      case 'profile':
        return <ProfilePanel isVisible={true} onClose={() => setActivePanel(null)} navigate={navigate} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="flex lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-xl bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Drawer */}
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[80%] mt-24 fixed bottom-0 left-0 right-0 z-50">
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
              
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img 
                  src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png" 
                  alt="Mergenta Logo" 
                  className="h-16 w-16 object-contain" 
                />
              </div>

              {/* Menu Items */}
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="outline"
                      onClick={() => handleItemClick(item.id)}
                      className={`h-20 flex flex-col gap-2 border-2 hover:bg-${item.color} hover:border-${item.color} transition-colors`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Panel Modal */}
      {activePanel && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute top-0 right-0 left-0 bottom-0 bg-white overflow-y-auto">
            <div className="p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActivePanel(null)}
                className="absolute top-4 right-4"
              >
                <X className="h-6 w-6" />
              </Button>
              {renderPanel()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;