import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface PolicyItem {
  id: string;
  title: string;
  section: 'legal' | 'business' | 'other';
  action: () => void;
}

interface PoliciesPanelProps {
  isVisible: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

const PoliciesPanel: React.FC<PoliciesPanelProps> = ({ isVisible, onClose, navigate }) => {
  const policyItems: PolicyItem[] = [
    // Legal Section
    { id: '1', title: 'Terms of Service', section: 'legal', action: () => console.log('Terms of Service') },
    { id: '2', title: 'Privacy Policy', section: 'legal', action: () => console.log('Privacy Policy') },
    
    // Business Section  
    { id: '3', title: 'Refund Policy', section: 'business', action: () => console.log('Refund Policy') },
    { id: '4', title: 'Pricing Policy', section: 'business', action: () => console.log('Pricing Policy') },
    { id: '5', title: 'Shipping Policy', section: 'business', action: () => console.log('Shipping Policy') },
    
    // Other Section
    { id: '6', title: 'Other Policies', section: 'other', action: () => console.log('Other Policies') },
  ];

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'legal':
        return 'border-l-4 border-pastel-magenta-hover bg-pastel-magenta';
      case 'business':
        return 'border-l-4 border-pastel-violet-hover bg-pastel-violet';
      case 'other':
        return 'border-l-4 border-pastel-lavender-hover bg-pastel-lavender';
      default:
        return '';
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'legal':
        return 'Legal';
      case 'business':
        return 'Business';
      case 'other':
        return 'Other';
      default:
        return '';
    }
  };

  const groupedItems = policyItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, PolicyItem[]>);

  return (
    <div 
      className={`fixed left-20 top-0 h-full w-80 bg-gradient-to-b from-purple-50 to-purple-100 border-r border-purple-200 z-30 transform transition-transform duration-300 ease-in-out shadow-lg ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-purple-200">
        <h2 className="text-lg font-semibold text-purple-800 text-center">Policies</h2>
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

export default PoliciesPanel;