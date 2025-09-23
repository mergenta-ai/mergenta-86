import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer } from 'vaul';
import { Button } from './ui/button';
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

interface TouchFriendlyWorkflowTabsProps {
  onAddToChat?: (message: string, response: string) => void;
  onPromptGenerated?: (prompt: string) => void;
}

const TouchFriendlyWorkflowTabs: React.FC<TouchFriendlyWorkflowTabsProps> = ({ onAddToChat, onPromptGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  // Modal states
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [povLabModalOpen, setPovLabModalOpen] = useState(false);
  const [powerPlaybookModalOpen, setPowerPlaybookModalOpen] = useState(false);
  const [futurePathwaysModalOpen, setFuturePathwaysModalOpen] = useState(false);
  const [realityCheckModalOpen, setRealityCheckModalOpen] = useState(false);
  const [roleplayHubModalOpen, setRoleplayHubModalOpen] = useState(false);
  const [protoRunModalOpen, setProtoRunModalOpen] = useState(false);

  const categories = [
    {
      id: 'beautiful-writing',
      title: 'Beautiful Writing',
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
      description: 'Coming soon - Deep analytical thinking tools'
    },
    {
      id: 'deep-research',
      title: 'Deep Research',
      description: 'Coming soon - Advanced research capabilities'
    },
    {
      id: 'power-playbook',
      title: 'Power Playbook',
      isModal: true,
      action: () => setPowerPlaybookModalOpen(true)
    },
    {
      id: 'experience-studio',
      title: 'Experience Studio',
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

  const renderWorkflowItem = (item: any) => {
    if (item.isModal && item.action) {
      return (
        <Button 
          key={item.id}
          variant="outline" 
          className="w-full h-12 justify-start text-left font-medium mb-2"
          onClick={() => {
            item.action();
            setIsOpen(false);
          }}
        >
          {item.title}
          <ChevronRight className="ml-auto h-4 w-4" />
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
                  }}
                >
                  Start {item.title}
                </Button>
              </div>
            </Component>
          }
        >
          <Button 
            variant="outline" 
            className="w-full h-12 justify-start text-left font-medium mb-2"
          >
            {item.title}
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </MobileHoverCardWrapper>
      );
    }

    return null;
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Workflow Navigation - Prominent placement */}
        <div className="flex justify-center w-full px-4 mt-3">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full max-w-md h-12 bg-primary hover:bg-primary/90 shadow-lg font-medium text-lg"
          >
            Explore Workflows
            <ChevronUp className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Workflow Drawer */}
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[90%] mt-24 fixed bottom-0 left-0 right-0">
              <div className="p-4 bg-white rounded-t-[20px] flex-1 overflow-y-auto">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-6" />
                <h2 className="text-2xl font-bold mb-6 text-center">All Workflows</h2>
                
                {categories.map((category) => (
                  <div key={category.id} className="mb-4">
                    {/* Category Header */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="flex-1 justify-start p-0 h-auto"
                        onClick={() => {
                          if (category.isModal && category.action) {
                            category.action();
                            setIsOpen(false);
                          } else if (category.items || category.groups) {
                            toggleCategory(category.id);
                          }
                        }}
                      >
                        <h3 className="text-lg font-semibold text-primary py-3">
                          {category.title}
                        </h3>
                        {(category.items || category.groups) && (
                          <div className="ml-auto">
                            {expandedCategories.has(category.id) ? 
                              <ChevronDown className="h-5 w-5" /> : 
                              <ChevronRight className="h-5 w-5" />
                            }
                          </div>
                        )}
                      </Button>
                    </div>

                    {/* Category Description for disabled categories */}
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-3 px-3">
                        {category.description}
                      </p>
                    )}

                    {/* Category Content */}
                    {expandedCategories.has(category.id) && (
                      <div className="pl-4 border-l-2 border-primary/20">
                        {/* Direct items */}
                        {category.items && (
                          <div className="space-y-2 mb-3">
                            {category.items.map((item) => renderWorkflowItem(item))}
                          </div>
                        )}

                        {/* Groups (for Easy Draft) */}
                        {category.groups && (
                          <div className="space-y-3">
                            {category.groups.map((group) => (
                              <div key={group.id}>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start p-0 h-auto mb-2"
                                  onClick={() => toggleGroup(group.id)}
                                >
                                  <h4 className="text-md font-medium text-secondary-foreground py-2">
                                    {group.title}
                                  </h4>
                                  <div className="ml-auto">
                                    {expandedGroups.has(group.id) ? 
                                      <ChevronDown className="h-4 w-4" /> : 
                                      <ChevronRight className="h-4 w-4" />
                                    }
                                  </div>
                                </Button>
                                
                                {expandedGroups.has(group.id) && (
                                  <div className="pl-4 space-y-2">
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
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>

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
  }

  // Desktop version - return null as original WorkflowTabs will handle
  return null;
};

export default TouchFriendlyWorkflowTabs;