import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface ProfileItem {
  id: string;
  title: string;
  section: 'account' | 'preferences' | 'about' | 'danger';
  action: () => void;
}

interface ProfilePanelProps {
  isVisible: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ isVisible, onClose, navigate }) => {
  const profileItems: ProfileItem[] = [
    // Account Section
    { id: '1', title: 'Current Plan: Pro', section: 'account', action: () => console.log('Current Plan') },
    { id: '2', title: 'Upgrade Plan', section: 'account', action: () => navigate('/plans') },
    { id: '3', title: 'Billing & Payment', section: 'account', action: () => navigate('/billing') },
    
    // Preferences Section  
    { id: '4', title: 'Bio', section: 'preferences', action: () => console.log('Bio') },
    { id: '5', title: 'Memory Guide', section: 'preferences', action: () => console.log('Memory Guide') },
    { id: '6', title: 'Personal Preferences', section: 'preferences', action: () => console.log('Personal Preferences') },
    { id: '7', title: 'Settings', section: 'preferences', action: () => console.log('Settings') },
    
    // About Section
    { id: '8', title: 'Inside Mergenta', section: 'about', action: () => console.log('Inside Mergenta') },
    { id: '9', title: 'About Mergenta', section: 'about', action: () => console.log('About Mergenta') },
    
    // Danger Zone
    { id: '10', title: 'Sign Out', section: 'danger', action: () => console.log('Sign Out') },
    { id: '11', title: 'Delete Account', section: 'danger', action: () => console.log('Delete Account') },
  ];

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'account':
        return 'border-l-4 border-pastel-magenta-hover bg-pastel-magenta';
      case 'preferences':
        return 'border-l-4 border-pastel-violet-hover bg-pastel-violet';
      case 'about':
        return 'border-l-4 border-pastel-lavender-hover bg-pastel-lavender';
      case 'danger':
        return 'border-l-4 border-pastel-rose-lilac bg-pastel-rose-lilac';
      default:
        return '';
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'account':
        return 'Account';
      case 'preferences':
        return 'Preferences';
      case 'about':
        return 'About';
      case 'danger':
        return 'Danger Zone';
      default:
        return '';
    }
  };

  const groupedItems = profileItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, ProfileItem[]>);

  return (
    <div 
      className={`fixed left-20 top-0 h-full w-80 bg-gradient-to-b from-purple-50 to-purple-100 border-r border-purple-200 z-30 transform transition-transform duration-300 ease-in-out shadow-lg ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-purple-200">
        <h2 className="text-lg font-semibold text-purple-800 text-center">Profile</h2>
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
                  className={`w-full h-auto p-3 mb-1 justify-start text-left text-sidebar-text-dark hover:text-sidebar-text-violet hover:bg-pastel-lavender-hover/50 transition-colors ${getSectionColor(item.section)}`}
                  onClick={item.action}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {item.title}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0 text-sidebar-text-violet" />
                </Button>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProfilePanel;