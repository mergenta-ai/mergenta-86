import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BioModal } from '@/components/modals/BioModal';
import { PersonalPreferencesModal } from '@/components/modals/PersonalPreferencesModal';
import { 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  FileText, 
  Shield, 
  Trash2,
  LogOut,
  Brain,
  Palette,
  ChevronRight
} from 'lucide-react';

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

export const ProfilePanel = ({ isVisible, onClose, navigate }: ProfilePanelProps) => {
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

  const profileItems: ProfileItem[] = [
    // Account Section
    {
      id: 'current-plan',
      title: 'Current Plan: Pro',
      section: 'account',
      action: () => navigate('/plans')
    },
    {
      id: 'billing',
      title: 'Billing & Payment',
      section: 'account',
      action: () => navigate('/billing')
    },
    
    // Preferences Section
    {
      id: 'bio-profile',
      title: 'Bio & Profile',
      section: 'preferences',
      action: () => setBioModalOpen(true)
    },
    {
      id: 'personal-preferences',
      title: 'Personal Preferences',
      section: 'preferences',
      action: () => setPreferencesModalOpen(true)
    },
    {
      id: 'memory-guide',
      title: 'Memory Guide',
      section: 'preferences',
      action: () => navigate('/memory-guide')
    },
    
    // About Section
    {
      id: 'help',
      title: 'Help & Support',
      section: 'about',
      action: () => console.log('Help & Support clicked')
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      section: 'about',
      action: () => console.log('Privacy Policy clicked')
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      section: 'about',
      action: () => console.log('Terms of Service clicked')
    },
    
    // Danger Zone
    {
      id: 'logout',
      title: 'Sign Out',
      section: 'danger',
      action: () => console.log('Sign Out clicked')
    },
    {
      id: 'delete-account',
      title: 'Delete Account',
      section: 'danger',
      action: () => console.log('Delete Account clicked')
    }
  ];

  const getSectionColor = (section: string): string => {
    switch (section) {
      case 'account':
        return 'bg-pastel-violet hover:bg-pastel-violet-hover text-sidebar-text-violet';
      case 'preferences':
        return 'bg-pastel-lavender hover:bg-pastel-lavender-hover text-sidebar-text-violet';
      case 'about':
        return 'bg-pastel-magenta hover:bg-pastel-magenta-hover text-sidebar-text-dark';
      case 'danger':
        return 'bg-red-50 hover:bg-red-100 text-red-700';
      default:
        return 'bg-gray-50 hover:bg-gray-100 text-gray-700';
    }
  };

  const getSectionTitle = (section: string): string => {
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

  const getItemIcon = (itemId: string) => {
    switch (itemId) {
      case 'bio-profile':
        return User;
      case 'personal-preferences':
        return Palette;
      case 'memory-guide':
        return Brain;
      case 'current-plan':
      case 'billing':
        return CreditCard;
      case 'help':
        return HelpCircle;
      case 'privacy':
        return Shield;
      case 'terms':
        return FileText;
      case 'delete-account':
        return Trash2;
      case 'logout':
        return LogOut;
      default:
        return Settings;
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
              {items.map((item) => {
                const Icon = getItemIcon(item.id);
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full h-auto p-3 mb-1 justify-start text-left transition-colors border-l-4 ${getSectionColor(item.section)}`}
                    onClick={item.action}
                  >
                    <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {item.title}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0 opacity-60" />
                  </Button>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Modals */}
      <BioModal 
        isOpen={bioModalOpen} 
        onClose={() => setBioModalOpen(false)} 
      />
      <PersonalPreferencesModal 
        isOpen={preferencesModalOpen} 
        onClose={() => setPreferencesModalOpen(false)} 
      />
    </div>
  );
};