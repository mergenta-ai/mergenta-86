import React, { useState } from 'react';
import { Menu, Clock, FileText, Crown, HelpCircle, User, Plus, TrendingUp, Mail, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';
import { useUserRole } from '@/hooks/useUserRole';
import { useUserPlan } from '@/hooks/useUserPlan';
import { getPlanBadgeColor } from '@/config/modelConfig';
import HistoryPanel from './sidebar/HistoryPanel';
import PoliciesPanel from './sidebar/PoliciesPanel';
import HelpPanel from './sidebar/HelpPanel';
import { ProfilePanel } from './sidebar/ProfilePanel';
import { RSSReaderModal } from './modals/RSSReaderModal';

interface MobileNavigationProps {
  onAddToChat?: (message: string, response: string) => void;
  onPromptGenerated?: (prompt: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ onAddToChat, onPromptGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showRSSReader, setShowRSSReader] = useState(false);
  const navigate = useNavigate();
  const { canAccessAdmin } = useUserRole();
  const { planType } = useUserPlan();
  
  const planDisplay = planType.charAt(0).toUpperCase() + planType.slice(1);

  // Quick action items (top section)
  const quickActions = [
    { id: 'new-chat', icon: Plus, label: 'New Chat', color: 'text-emerald-600', bgColor: 'hover:bg-emerald-50' },
    { id: 'trending', icon: TrendingUp, label: 'Trending', color: 'text-orange-600', bgColor: 'hover:bg-orange-50' },
    { id: 'email', icon: Mail, label: 'Email', color: 'text-blue-600', bgColor: 'hover:bg-blue-50' },
  ];

  // Sidebar panel items (middle section)
  const panelItems = [
    { id: 'history', icon: Clock, label: 'History', color: 'text-pink-600', bgColor: 'hover:bg-pink-50' },
    { id: 'policies', icon: FileText, label: 'Policies', color: 'text-purple-600', bgColor: 'hover:bg-purple-50' },
    { id: 'plans', icon: Crown, label: 'Plans', color: 'text-violet-600', bgColor: 'hover:bg-violet-50' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', color: 'text-pink-600', bgColor: 'hover:bg-pink-50' },
  ];

  // Admin item (conditional)
  const adminItem = canAccessAdmin ? { id: 'admin', icon: Shield, label: 'Admin Panel', color: 'text-orange-600', bgColor: 'hover:bg-orange-50' } : null;

  const handleItemClick = (itemId: string) => {
    setIsOpen(false);
    
    switch (itemId) {
      case 'new-chat':
        window.location.reload();
        break;
      case 'trending':
        setShowRSSReader(true);
        break;
      case 'email':
        navigate('/emails');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'plans':
        navigate('/plans');
        break;
      case 'history':
      case 'policies':
      case 'help':
      case 'profile':
        setActivePanel(itemId);
        break;
    }
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'history':
        return <HistoryPanel isVisible={true} onClose={() => setActivePanel(null)} />;
      case 'policies':
        return <PoliciesPanel isVisible={true} onClose={() => setActivePanel(null)} navigate={navigate} />;
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
          
          <SheetContent side="left" className="w-[85vw] sm:w-[300px] max-w-[320px] p-0 overflow-y-auto bg-gradient-to-b from-purple-50 to-purple-100">
            <div className="flex flex-col h-full">
              {/* Header with Logo and Brand */}
              <div className="p-6 border-b border-purple-200 bg-gradient-to-r from-purple-100 to-purple-50">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png" 
                    alt="Mergenta Logo" 
                    className="h-12 w-12 object-contain" 
                  />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Mergenta</h1>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Ideas in motion</p>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {/* Quick Actions Section */}
                <div className="px-4 mb-6">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Quick Actions
                  </h2>
                  
                  <div className="space-y-1">
                    {quickActions.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className={`w-full justify-start h-12 ${item.bgColor} rounded-xl transition-all duration-300 shadow-sm hover:shadow-md`}
                          onClick={() => handleItemClick(item.id)}
                        >
                          <IconComponent className={`h-5 w-5 mr-3 ${item.color}`} />
                          <span className="font-medium text-foreground">{item.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Admin Section (if applicable) */}
                {adminItem && (
                  <>
                    <div className="px-4 mb-6">
                      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                        Administration
                      </h2>
                      
                      <Button
                        variant="ghost"
                        className={`w-full justify-start h-12 ${adminItem.bgColor} rounded-xl transition-all duration-300 shadow-sm hover:shadow-md`}
                        onClick={() => handleItemClick(adminItem.id)}
                      >
                        <Shield className={`h-5 w-5 mr-3 ${adminItem.color}`} />
                        <span className="font-medium text-foreground">{adminItem.label}</span>
                      </Button>
                    </div>
                    <Separator className="my-4" />
                  </>
                )}

                {/* Panel Items Section */}
                <div className="px-4 mb-6">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Navigation
                  </h2>
                  
                  <div className="space-y-1">
                    {panelItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className={`w-full justify-start h-12 ${item.bgColor} rounded-xl transition-all duration-300 shadow-sm hover:shadow-md`}
                          onClick={() => handleItemClick(item.id)}
                        >
                          <IconComponent className={`h-5 w-5 mr-3 ${item.color}`} />
                          <span className="font-medium text-foreground">{item.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Profile Section */}
                <div className="px-4 mb-6">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Account
                  </h2>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 hover:bg-purple-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => handleItemClick('profile')}
                  >
                    <User className="h-5 w-5 mr-3 text-purple-600" />
                    <span className="font-medium text-foreground">Profile</span>
                  </Button>
                </div>

                {/* Provision for Future Domains */}
                <div className="px-4 mb-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200">
                    <p className="text-xs text-muted-foreground text-center font-medium">
                      More features coming soon...
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer with Plan Badge */}
              <div className="p-4 border-t border-purple-200 bg-white/50">
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ring-1 shadow-md ${getPlanBadgeColor(planType)}`}
                  >
                    {planDisplay} Plan
                  </span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Panel */}
      {activePanel && renderPanel()}

      {/* RSS Reader Modal */}
      <RSSReaderModal
        isOpen={showRSSReader}
        onClose={() => setShowRSSReader(false)}
        initialCategory=""
      />
    </>
  );
};

export default MobileNavigation;