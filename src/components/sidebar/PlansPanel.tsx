import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface PlanItem {
  id: string;
  title: string;
  section: 'current' | 'available' | 'upgrade' | 'enterprise';
  action: () => void;
}

interface PlansPanelProps {
  isVisible: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

const PlansPanel: React.FC<PlansPanelProps> = ({ isVisible, onClose, navigate }) => {
  const planItems: PlanItem[] = [
    // Current Plan Section
    { id: '1', title: 'Current Plan: Free', section: 'current', action: () => console.log('Current Plan') },
    { id: '2', title: 'Usage & Limits', section: 'current', action: () => console.log('Usage & Limits') },
    
    // Available Plans Section  
    { id: '3', title: 'Basic Plan', section: 'available', action: () => navigate('/plans') },
    { id: '4', title: 'Professional Plan', section: 'available', action: () => navigate('/plans') },
    { id: '5', title: 'Premium Plan', section: 'available', action: () => navigate('/plans') },
    
    // Upgrade Plan Section
    { id: '6', title: 'Upgrade & Compare', section: 'upgrade', action: () => navigate('/plans') },
    
    // Enterprise Section
    { id: '7', title: 'Enterprise Solutions', section: 'enterprise', action: () => console.log('Enterprise Solutions') },
    { id: '8', title: 'Custom Pricing', section: 'enterprise', action: () => console.log('Custom Pricing') },
  ];

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'current':
        return 'border-l-4 border-pastel-magenta-hover bg-pastel-magenta';
      case 'available':
        return 'border-l-4 border-pastel-violet-hover bg-pastel-violet';
      case 'upgrade':
        return 'border-l-4 border-pastel-lavender-hover bg-pastel-lavender';
      case 'enterprise':
        return 'border-l-4 border-pastel-magenta-hover bg-pastel-magenta';
      default:
        return '';
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'current':
        return 'Current Plan';
      case 'available':
        return 'Available Plans';
      case 'upgrade':
        return 'Upgrade Plan';
      case 'enterprise':
        return 'Enterprise';
      default:
        return '';
    }
  };

  const groupedItems = planItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, PlanItem[]>);

  return (
    <div 
      className={`fixed left-20 top-0 h-full w-80 bg-gradient-to-b from-purple-50 to-purple-100 border-r border-purple-200 z-30 transform transition-transform duration-300 ease-in-out shadow-lg ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-purple-200">
        <h2 className="text-lg font-semibold text-purple-800 text-center">Plans & Billing</h2>
      </div>
      
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="p-2">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section} className="mb-4">
              <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2 px-2">
                {getSectionTitle(section)}
              </h3>
              {items.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full h-12 px-4 py-3 mb-1 justify-start text-left rounded-lg hover:bg-purple-light transition-colors duration-200"
                  onClick={item.action}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                    <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                </Button>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlansPanel;