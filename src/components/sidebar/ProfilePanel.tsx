import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BioModal } from '@/components/modals/BioModal';
import { PersonalPreferencesModal } from '@/components/modals/PersonalPreferencesModal';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { DeleteAccountModal } from '@/components/modals/DeleteAccountModal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Settings, 
  CreditCard, 
  Trash2,
  LogOut,
  Brain,
  Palette,
  ChevronRight,
  Info,
  Building
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
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      id: 'bio',
      title: 'Bio',
      section: 'preferences',
      action: () => setBioModalOpen(true)
    },
    {
      id: 'profile',
      title: 'Profile',
      section: 'preferences',
      action: () => setProfileModalOpen(true)
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
      id: 'about-mergenta',
      title: 'About Mergenta',
      section: 'about',
      action: () => console.log('About Mergenta clicked')
    },
    {
      id: 'inside-mergenta',
      title: 'Inside Mergenta',
      section: 'about',
      action: () => console.log('Inside Mergenta clicked')
    },
    
    // Danger Zone
    {
      id: 'logout',
      title: 'Sign Out',
      section: 'danger',
      action: handleSignOut
    },
    {
      id: 'delete-account',
      title: 'Delete Account',
      section: 'danger',
      action: () => setDeleteAccountModalOpen(true)
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
      case 'bio':
        return User;
      case 'profile':
        return User;
      case 'personal-preferences':
        return Palette;
      case 'memory-guide':
        return Brain;
      case 'current-plan':
      case 'billing':
        return CreditCard;
      case 'about-mergenta':
        return Info;
      case 'inside-mergenta':
        return Building;
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
                    className="w-full h-12 px-4 py-3 mb-1 justify-start text-left rounded-lg hover:bg-purple-light transition-colors duration-200"
                    onClick={item.action}
                  >
                    <Icon className="h-4 w-4 mr-3 flex-shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0 text-primary opacity-60" />
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
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
      <PersonalPreferencesModal 
        isOpen={preferencesModalOpen} 
        onClose={() => setPreferencesModalOpen(false)} 
      />
      <DeleteAccountModal 
        isOpen={deleteAccountModalOpen} 
        onClose={() => setDeleteAccountModalOpen(false)} 
      />
    </div>
  );
};