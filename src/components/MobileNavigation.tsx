import React, { useState } from 'react';
import { Menu, X, Clock, FileText, Crown, HelpCircle, User, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import HistoryPanel from './sidebar/HistoryPanel';
import PoliciesPanel from './sidebar/PoliciesPanel';
import HelpPanel from './sidebar/HelpPanel';
import { ProfilePanel } from './sidebar/ProfilePanel';
import PlansPanel from './sidebar/PlansPanel';
import MobileHoverCardWrapper from './MobileHoverCardWrapper';

// Beautiful Writing hover cards
import EssayHoverCard from './hover-cards/EssayHoverCard';
import StoryHoverCard from './hover-cards/StoryHoverCard';
import FlashFictionHoverCard from './hover-cards/FlashFictionHoverCard';
import ScriptHoverCard from './hover-cards/ScriptHoverCard';
import BlogHoverCard from './hover-cards/BlogHoverCard';
import PoetryHoverCard from './hover-cards/PoetryHoverCard';
import SpeechHoverCard from './hover-cards/SpeechHoverCard';

// Task Assistant hover cards
import BrainstormHoverCard from './hover-cards/BrainstormHoverCard';
import ScenarioHoverCard from './hover-cards/ScenarioHoverCard';
import MentorHoverCard from './hover-cards/MentorHoverCard';
import DevilsAdvocateHoverCard from './hover-cards/DevilsAdvocateHoverCard';
import AstroLensHoverCard from './hover-cards/AstroLensHoverCard';

// Easy Draft letter hover cards
import LoveLetterHoverCard from './hover-cards/LoveLetterHoverCard';
import ApologyLetterHoverCard from './hover-cards/ApologyLetterHoverCard';
import ThankYouLetterHoverCard from './hover-cards/ThankYouLetterHoverCard';
import CondolenceLetterHoverCard from './hover-cards/CondolenceLetterHoverCard';
import InvitationLetterHoverCard from './hover-cards/InvitationLetterHoverCard';
import CongratulatoryLetterHoverCard from './hover-cards/CongratulatoryLetterHoverCard';
import WelcomeLetterHoverCard from './hover-cards/WelcomeLetterHoverCard';
import FarewellLetterHoverCard from './hover-cards/FarewellLetterHoverCard';
import LeaveApplicationHoverCard from './hover-cards/LeaveApplicationHoverCard';
import PermissionLetterHoverCard from './hover-cards/PermissionLetterHoverCard';
import AppreciationLetterHoverCard from './hover-cards/AppreciationLetterHoverCard';
import AppointmentRequestHoverCard from './hover-cards/AppointmentRequestHoverCard';
import PublicationRequestHoverCard from './hover-cards/PublicationRequestHoverCard';
import ComplaintLetterHoverCard from './hover-cards/ComplaintLetterHoverCard';
import RecommendationLetterHoverCard from './hover-cards/RecommendationLetterHoverCard';
import RequestLetterHoverCard from './hover-cards/RequestLetterHoverCard';
import GeneralLetterHoverCard from './hover-cards/GeneralLetterHoverCard';

// Modals
import { SnapshotModal } from './modals/SnapshotModal';
import { POVLabModal } from './modals/POVLabModal';
import { PowerPlaybookModal } from './modals/PowerPlaybookModal';
import { FuturePathwaysModal } from './modals/FuturePathwaysModal';
import RealityCheckModal from './modals/RealityCheckModal';
import RoleplayHubModal from './modals/RoleplayHubModal';
import { ProtoRunModal } from './modals/ProtoRunModal';

interface MobileNavigationProps {
  onAddToChat?: (message: string, response: string) => void;
  onPromptGenerated?: (prompt: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ onAddToChat, onPromptGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Modal states
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [povLabModalOpen, setPovLabModalOpen] = useState(false);
  const [powerPlaybookModalOpen, setPowerPlaybookModalOpen] = useState(false);
  const [futurePathwaysModalOpen, setFuturePathwaysModalOpen] = useState(false);
  const [realityCheckModalOpen, setRealityCheckModalOpen] = useState(false);
  const [roleplayHubModalOpen, setRoleplayHubModalOpen] = useState(false);
  const [protoRunModalOpen, setProtoRunModalOpen] = useState(false);

  // Workflow categories data
  const workflowCategories = [
    {
      id: 'beautiful-writing',
      title: 'Beautiful Writing',
      icon: '✍️',
      items: [
        { id: 'essay', title: 'Essay', component: EssayHoverCard },
        { id: 'story', title: 'Story', component: StoryHoverCard },
        { id: 'flash-fiction', title: 'Flash Fiction', component: FlashFictionHoverCard },
        { id: 'script', title: 'Script', component: ScriptHoverCard },
        { id: 'blog', title: 'Blog', component: BlogHoverCard },
        { id: 'poetry', title: 'Poetry', component: PoetryHoverCard },
        { id: 'speech', title: 'Speech', component: SpeechHoverCard },
      ]
    },
    {
      id: 'easy-draft',
      title: 'Easy Draft',
      icon: '📝',
      groups: [
        {
          id: 'personal-letters',
          title: 'Personal Letters',
          items: [
            { id: 'love-letter', title: 'Love Letter', component: LoveLetterHoverCard },
            { id: 'apology-letter', title: 'Apology Letter', component: ApologyLetterHoverCard },
            { id: 'thank-you-letter', title: 'Thank You Letter', component: ThankYouLetterHoverCard },
            { id: 'condolence-letter', title: 'Condolence Letter', component: CondolenceLetterHoverCard },
          ]
        },
        {
          id: 'social-letters',
          title: 'Social Letters',
          items: [
            { id: 'invitation-letter', title: 'Invitation Letter', component: InvitationLetterHoverCard },
            { id: 'congratulatory-letter', title: 'Congratulatory Letter', component: CongratulatoryLetterHoverCard },
            { id: 'welcome-letter', title: 'Welcome Letter', component: WelcomeLetterHoverCard },
            { id: 'farewell-letter', title: 'Farewell Letter', component: FarewellLetterHoverCard },
          ]
        },
        {
          id: 'institutional-letters',
          title: 'Institutional Letters',
          items: [
            { id: 'leave-application', title: 'Leave Application', component: LeaveApplicationHoverCard },
            { id: 'permission-letter', title: 'Permission Letter', component: PermissionLetterHoverCard },
            { id: 'appreciation-letter', title: 'Appreciation Letter', component: AppreciationLetterHoverCard },
            { id: 'appointment-request', title: 'Appointment Request', component: AppointmentRequestHoverCard },
            { id: 'publication-request', title: 'Publication Request', component: PublicationRequestHoverCard },
          ]
        },
        {
          id: 'formal-letters',
          title: 'Formal Letters',
          items: [
            { id: 'complaint-letter', title: 'Complaint Letter', component: ComplaintLetterHoverCard },
            { id: 'recommendation-letter', title: 'Recommendation Letter', component: RecommendationLetterHoverCard },
            { id: 'request-letter', title: 'Request Letter', component: RequestLetterHoverCard },
            { id: 'general-letter', title: 'General Letter', component: GeneralLetterHoverCard },
          ]
        }
      ]
    },
    {
      id: 'task-assistant',
      title: 'Task Assistant',
      icon: '🤖',
      items: [
        { id: 'brainstorm', title: 'Brainstorm with me', component: BrainstormHoverCard },
        { id: 'scenario-planning', title: 'Scenario Planning', component: ScenarioHoverCard },
        { id: 'mentor', title: 'Think like a mentor', component: MentorHoverCard },
        { id: 'devils-advocate', title: "Be a devil's advocate", component: DevilsAdvocateHoverCard },
        { id: 'astro-lens', title: 'Astro Lens', component: AstroLensHoverCard },
      ]
    },
    {
      id: 'think-hard',
      title: 'Think Hard',
      icon: '🧠',
      description: 'Coming soon - Deep analytical thinking tools'
    },
    {
      id: 'deep-research',
      title: 'Deep Research',
      icon: '🔍',
      description: 'Coming soon - Advanced research capabilities'
    },
    {
      id: 'power-playbook',
      title: 'Power Playbook',
      icon: '📚',
      isModal: true,
      action: () => setPowerPlaybookModalOpen(true)
    },
    {
      id: 'experience-studio',
      title: 'Experience Studio',
      icon: '🎭',
      items: [
        { id: 'snapshot', title: 'Snapshot', isModal: true, action: () => setSnapshotModalOpen(true) },
        { id: 'pov-lab', title: 'POV Lab', isModal: true, action: () => setPovLabModalOpen(true) },
        { id: 'future-pathways', title: 'Future Pathways', isModal: true, action: () => setFuturePathwaysModalOpen(true) },
        { id: 'reality-check', title: 'Reality Check', isModal: true, action: () => setRealityCheckModalOpen(true) },
        { id: 'roleplay-hub', title: 'Roleplay Hub', isModal: true, action: () => setRoleplayHubModalOpen(true) },
        { id: 'proto-run', title: 'Proto Run', isModal: true, action: () => setProtoRunModalOpen(true) },
      ]
    },
  ];

  // Sidebar menu items
  const sidebarMenuItems = [
    { id: 'history', icon: Clock, label: 'History', color: 'text-primary' },
    { id: 'policies', icon: FileText, label: 'Policies', color: 'text-primary' },
    { id: 'plans', icon: Crown, label: 'Plans', color: 'text-primary' },
    { id: 'help', icon: HelpCircle, label: 'Help', color: 'text-primary' },
    { id: 'profile', icon: User, label: 'Profile', color: 'text-primary' },
  ];

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleItemClick = (itemId: string) => {
    setActivePanel(itemId);
    setIsOpen(false);
  };

  const renderWorkflowItem = (item: any) => {
    if (item.isModal && item.action) {
      return (
        <Button 
          key={item.id}
          variant="ghost" 
          className="w-full h-auto justify-start text-left font-medium p-3 hover:bg-muted/50 rounded-lg"
          onClick={() => {
            item.action();
            setIsOpen(false);
          }}
        >
          <span className="flex-1">{item.title}</span>
          <ChevronRight className="h-4 w-4 opacity-50" />
        </Button>
      );
    }

    if (item.component) {
      const Component = item.component;
      return (
        <MobileHoverCardWrapper
          key={item.id}
          title={item.title}
          content={
            <Component onPromptGenerated={onPromptGenerated}>
              <div className="p-4">
                <Button 
                  className="w-full h-12 text-lg font-medium"
                  onClick={() => {
                    console.log(`Selected: ${item.title}`);
                    if (onAddToChat) {
                      onAddToChat(`Start ${item.title}`, `Starting ${item.title} workflow...`);
                    }
                    setIsOpen(false);
                  }}
                >
                  Start {item.title}
                </Button>
              </div>
            </Component>
          }
        >
          <Button 
            variant="ghost" 
            className="w-full h-auto justify-start text-left font-medium p-3 hover:bg-muted/50 rounded-lg"
          >
            <span className="flex-1">{item.title}</span>
            <ChevronRight className="h-4 w-4 opacity-50" />
          </Button>
        </MobileHoverCardWrapper>
      );
    }

    return null;
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
                {/* Workflow Categories Section */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    Workflows
                  </h2>
                  
                  <div className="space-y-2">
                    {workflowCategories.map((category) => (
                      <div key={category.id} className="space-y-1">
                        {/* Category Header */}
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 hover:bg-primary/10 rounded-lg"
                          onClick={() => {
                            if (category.isModal && category.action) {
                              category.action();
                              setIsOpen(false);
                            } else if (category.items || category.groups) {
                              toggleCategory(category.id);
                            }
                          }}
                        >
                          <span className="text-lg mr-3">{category.icon}</span>
                          <span className="flex-1 text-left font-medium">{category.title}</span>
                          {(category.items || category.groups) && (
                            <div className="ml-auto">
                              {expandedCategories.has(category.id) ? 
                                <ChevronDown className="h-4 w-4 opacity-50" /> : 
                                <ChevronRight className="h-4 w-4 opacity-50" />
                              }
                            </div>
                          )}
                        </Button>

                        {/* Category Description for disabled categories */}
                        {category.description && !expandedCategories.has(category.id) && (
                          <p className="text-xs text-muted-foreground pl-12 pb-1">
                            {category.description}
                          </p>
                        )}

                        {/* Category Content */}
                        {expandedCategories.has(category.id) && (
                          <div className="pl-6 space-y-1 border-l-2 border-primary/20 ml-6">
                            {/* Direct items */}
                            {category.items && (
                              <div className="space-y-1">
                                {category.items.map((item) => renderWorkflowItem(item))}
                              </div>
                            )}

                            {/* Groups (for Easy Draft) */}
                            {category.groups && (
                              <div className="space-y-2">
                                {category.groups.map((group) => (
                                  <div key={group.id}>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start h-auto p-2 hover:bg-muted/50 rounded-md"
                                      onClick={() => toggleGroup(group.id)}
                                    >
                                      <span className="flex-1 text-left text-sm font-medium text-muted-foreground">
                                        {group.title}
                                      </span>
                                      <div className="ml-auto">
                                        {expandedGroups.has(group.id) ? 
                                          <ChevronDown className="h-3 w-3 opacity-50" /> : 
                                          <ChevronRight className="h-3 w-3 opacity-50" />
                                        }
                                      </div>
                                    </Button>
                                    
                                    {expandedGroups.has(group.id) && (
                                      <div className="pl-4 space-y-1 mt-1">
                                        {group.items.map((item) => renderWorkflowItem(item))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Menu Section */}
                <div className="p-4 border-t bg-muted/20">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <span>⚙️</span>
                    Menu
                  </h3>
                  
                  <div className="space-y-1">
                    {sidebarMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          onClick={() => handleItemClick(item.id)}
                          className="w-full justify-start h-auto p-3 hover:bg-primary/10 rounded-lg"
                        >
                          <Icon className={`h-4 w-4 mr-3 ${item.color}`} />
                          <span className="font-medium">{item.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Panel Modal */}
      {activePanel && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute top-0 right-0 left-0 bottom-0 bg-white overflow-y-auto">
            <div className="p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActivePanel(null)}
                className="absolute top-4 right-4 z-10"
              >
                <X className="h-6 w-6" />
              </Button>
              {renderPanel()}
            </div>
          </div>
        </div>
      )}

      {/* All Modals */}
      <SnapshotModal 
        open={snapshotModalOpen} 
        onOpenChange={setSnapshotModalOpen}
        onAddToChat={onAddToChat}
      />
      <POVLabModal 
        open={povLabModalOpen} 
        onOpenChange={setPovLabModalOpen}
        onAddToChat={onAddToChat}
      />
      <PowerPlaybookModal 
        open={powerPlaybookModalOpen} 
        onOpenChange={setPowerPlaybookModalOpen}
        onAddToChat={onAddToChat}
      />
      <FuturePathwaysModal 
        open={futurePathwaysModalOpen} 
        onOpenChange={setFuturePathwaysModalOpen}
        onAddToChat={onAddToChat}
      />
      <RealityCheckModal 
        open={realityCheckModalOpen} 
        onOpenChange={setRealityCheckModalOpen}
        onAddToChat={onAddToChat}
      />
      <RoleplayHubModal 
        open={roleplayHubModalOpen} 
        onOpenChange={setRoleplayHubModalOpen}
        onAddToChat={onAddToChat}
      />
      <ProtoRunModal 
        open={protoRunModalOpen} 
        onOpenChange={setProtoRunModalOpen}
        onAddToChat={onAddToChat}
      />
    </>
  );
};

export default MobileNavigation;