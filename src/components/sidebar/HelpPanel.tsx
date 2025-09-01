import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface HelpItem {
  id: string;
  title: string;
  section: 'documentation' | 'support' | 'community';
  action: () => void;
}

interface HelpPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ isVisible, onClose }) => {
  const helpItems: HelpItem[] = [
    // Documentation Section
    { id: '1', title: 'Help Documentation', section: 'documentation', action: () => console.log('Help Docs') },
    { id: '2', title: 'Video Tutorials', section: 'documentation', action: () => console.log('Tutorials') },
    { id: '3', title: 'Frequently Asked Questions', section: 'documentation', action: () => console.log('FAQs') },
    
    // Support Section  
    { id: '4', title: 'Contact Support', section: 'support', action: () => console.log('Contact Support') },
    
    // Community Section
    { id: '5', title: 'Community Forum', section: 'community', action: () => console.log('Community Forum') },
    { id: '6', title: 'Feature Requests', section: 'community', action: () => console.log('Feature Requests') },
  ];

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'documentation':
        return 'border-l-4 border-blue-300 bg-blue-50';
      case 'support':
        return 'border-l-4 border-green-300 bg-green-50';
      case 'community':
        return 'border-l-4 border-purple-300 bg-purple-50';
      default:
        return '';
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'documentation':
        return 'Documentation';
      case 'support':
        return 'Support';
      case 'community':
        return 'Community';
      default:
        return '';
    }
  };

  const groupedItems = helpItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, HelpItem[]>);

  return (
    <div 
      className={`fixed left-20 top-0 h-full w-80 bg-gradient-to-b from-purple-50 to-purple-100 border-r border-purple-200 z-30 transform transition-transform duration-300 ease-in-out shadow-lg ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-purple-200">
        <h2 className="text-lg font-semibold text-purple-800 text-center">Help & Support</h2>
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
                  className={`w-full h-auto p-3 mb-1 justify-start text-left text-purple-800 hover:text-purple-800 hover:bg-purple-200/40 transition-colors ${getSectionColor(item.section)}`}
                  onClick={item.action}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {item.title}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0 text-purple-600" />
                </Button>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HelpPanel;