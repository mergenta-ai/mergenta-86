import React, { useState } from 'react';
import { Menu, Clock, FileText, Crown, HelpCircle, User, Plus, TrendingUp, Mail, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import HistoryPanel from './sidebar/HistoryPanel';
import PoliciesPanel from './sidebar/PoliciesPanel';
import HelpPanel from './sidebar/HelpPanel';
import { ProfilePanel } from './sidebar/ProfilePanel';
import PlansPanel from './sidebar/PlansPanel';
import TrendingPanel from './sidebar/TrendingPanel';

interface MobileNavigationProps {}

const MobileNavigation: React.FC<MobileNavigationProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const navigate = useNavigate();

  // Sidebar menu items - matching desktop sidebar exactly
  const sidebarMenuItems = [
    { 
      id: 'new-chat', 
      icon: Plus, 
      label: 'Start new chat', 
      color: 'text-primary',
      action: () => {
        setIsOpen(false);
        window.location.reload(); // Same as desktop behavior
      }
    },
    { 
      id: 'trending', 
      icon: TrendingUp, 
      label: 'Trending', 
      color: 'text-primary' 
    },
    { 
      id: 'email', 
      icon: Mail, 
      label: 'Email', 
      color: 'text-primary',
      action: () => {
        setIsOpen(false);
        window.location.href = 'mailto:';
      }
    },
    { id: 'history', icon: Clock, label: 'History', color: 'text-primary' },
    { id: 'policies', icon: FileText, label: 'Policies', color: 'text-primary' },
    { id: 'plans', icon: Crown, label: 'Plans', color: 'text-primary' },
    { id: 'help', icon: HelpCircle, label: 'Help', color: 'text-primary' },
    { id: 'profile', icon: User, label: 'Profile', color: 'text-primary' },
  ];

  const handleItemClick = (itemId: string) => {
    // Handle direct actions first
    const item = sidebarMenuItems.find(item => item.id === itemId);
    if (item?.action) {
      item.action();
      return;
    }
    
    // Handle panel opening
    setActivePanel(itemId);
    setIsOpen(false);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'trending':
        return <TrendingPanel isVisible={true} onClose={() => setActivePanel(null)} />;
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
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl bg-white/90 backdrop-blur-sm border-primary/20 hover:bg-primary/5 shadow-lg"
            >
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          
          <SheetContent side="left" className="w-[320px] p-0 overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* Header with Logo and Brand */}
              <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-purple-50">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png" 
                    alt="Mergenta Logo" 
                    className="h-10 w-10 object-contain" 
                  />
                  <h1 className="text-2xl font-bold text-primary">Mergenta</h1>
                </div>
                <p className="text-sm text-muted-foreground">AI-Powered Writing Assistant</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Menu Section - Only sidebar items */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    Menu
                  </h2>
                  
                  <div className="space-y-2">
                    {sidebarMenuItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start h-12 p-3 hover:bg-primary/10 rounded-lg"
                        onClick={() => handleItemClick(item.id)}
                      >
                        <item.icon className={`h-5 w-5 mr-3 ${item.color}`} />
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        {!item.action && <ChevronRight className="h-4 w-4 opacity-50" />}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Panel rendering */}
      {activePanel && (
        <div className="fixed inset-0 z-50 bg-background">
          {renderPanel()}
        </div>
      )}
    </>
  );
};

export default MobileNavigation;