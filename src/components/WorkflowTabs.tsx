import { useState, useEffect, useRef } from "react";
import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import EssayHoverCard from "./hover-cards/EssayHoverCard";
import StoryHoverCard from "./hover-cards/StoryHoverCard";
import FlashFictionHoverCard from "./hover-cards/FlashFictionHoverCard";
import ScriptHoverCard from "./hover-cards/ScriptHoverCard";
import BlogHoverCard from "./hover-cards/BlogHoverCard";
import PoetryHoverCard from "./hover-cards/PoetryHoverCard";
import SpeechHoverCard from "./hover-cards/SpeechHoverCard";
import BrainstormHoverCard from "./hover-cards/BrainstormHoverCard";
import ScenarioHoverCard from "./hover-cards/ScenarioHoverCard";
import MentorHoverCard from "./hover-cards/MentorHoverCard";
import DevilsAdvocateHoverCard from "./hover-cards/DevilsAdvocateHoverCard";
import AstroLensHoverCard from "./hover-cards/AstroLensHoverCard";
import LoveLetterHoverCard from "./hover-cards/LoveLetterHoverCard";
import ApologyLetterHoverCard from "./hover-cards/ApologyLetterHoverCard";
import ThankYouLetterHoverCard from "./hover-cards/ThankYouLetterHoverCard";
import CondolenceLetterHoverCard from "./hover-cards/CondolenceLetterHoverCard";
import InvitationLetterHoverCard from "./hover-cards/InvitationLetterHoverCard";
import CongratulatoryLetterHoverCard from "./hover-cards/CongratulatoryLetterHoverCard";
import WelcomeLetterHoverCard from "./hover-cards/WelcomeLetterHoverCard";
import FarewellLetterHoverCard from "./hover-cards/FarewellLetterHoverCard";
import ComplaintLetterHoverCard from "./hover-cards/ComplaintLetterHoverCard";
import RecommendationLetterHoverCard from "./hover-cards/RecommendationLetterHoverCard";
import RequestLetterHoverCard from "./hover-cards/RequestLetterHoverCard";
import GeneralLetterHoverCard from "./hover-cards/GeneralLetterHoverCard";
import LeaveApplicationHoverCard from "./hover-cards/LeaveApplicationHoverCard";
import PermissionLetterHoverCard from "./hover-cards/PermissionLetterHoverCard";
import AppreciationLetterHoverCard from "./hover-cards/AppreciationLetterHoverCard";
import AppointmentRequestHoverCard from "./hover-cards/AppointmentRequestHoverCard";
import PublicationRequestHoverCard from "./hover-cards/PublicationRequestHoverCard";
import { SnapshotModal } from "./modals/SnapshotModal";
import { POVLabModal } from "./modals/POVLabModal";
import { PowerPlaybookModal } from "./modals/PowerPlaybookModal";
import { FuturePathwaysModal } from "./modals/FuturePathwaysModal";
import RealityCheckModal from "./modals/RealityCheckModal";
import RoleplayHubModal from "./modals/RoleplayHubModal";
import { ProtoRunModal } from "./modals/ProtoRunModal";

const WorkflowTabs = ({ onAddToChat, onPromptGenerated }: { 
  onAddToChat?: (message: string, response: string) => void;
  onPromptGenerated?: (prompt: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [povLabModalOpen, setPovLabModalOpen] = useState(false);
  const [powerPlaybookModalOpen, setPowerPlaybookModalOpen] = useState(false);
  const [futurePathwaysModalOpen, setFuturePathwaysModalOpen] = useState(false);
  const [realityCheckModalOpen, setRealityCheckModalOpen] = useState(false);
  const [roleplayHubModalOpen, setRoleplayHubModalOpen] = useState(false);
  const [protoRunModalOpen, setProtoRunModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { text: "Beautiful\nWriting", id: "beautiful-writing" },
    { text: "Easy\nDraft", id: "easy-draft" },
    { text: "Think\nHard", id: "think-hard" },
    { text: "Deep\nResearch", id: "deep-research" },
    { text: "Task\nAssistant", id: "task-assistant" },
    { text: "Power\nPlaybook", id: "power-playbook" },
    { text: "Experience\nStudio", id: "experience-studio" }
  ];

  const beautifulWritingItems = [
    { text: "Essay", tooltip: "Structured, formal writing — balanced arguments and clarity." },
    { text: "Story", tooltip: "Longer narrative with characters, plot and detail." },
    { text: "Flash Fiction" },
    { text: "Script", tooltip: "Dialogue-driven format for plays, films or skits." },
    { text: "Blog", tooltip: "Conversational, engaging style for online readers." },
    { text: "Poetry", tooltip: "Creative expression with rhythm, imagery and emotion." },
    { text: "Speech", tooltip: "Persuasive or inspirational text meant to be spoken." }
  ];

  const taskAssistantItems = [
    { text: "Brainstorm with me", tooltip: "Generate fresh ideas fast — creative, bold and varied." },
    { text: "Scenario Planning", tooltip: "Anticipate futures — map risks, opportunities and strategies." },
    { text: "Think like a mentor" },
    { text: "Be a devil's advocate" },
    { text: "Astro Lens" }
  ];

  const easyDraftGroups = [
    {
      title: "Personal Letters",
      items: ["Love letter", "Apology letter", "Thank you letter", "Condolence letter"]
    },
    {
      title: "Social Letters", 
      items: ["Invitation letter", "Congratulatory letter", "Welcome letter", "Farewell letter"]
    },
    {
      title: "Institutional Letters",
      items: ["Leave application", "Permission letter", "Appreciation letter", "Appointment request letter", "Publication request letter"]
    },
    {
      title: "Formal Letters",
      items: ["Complaint letter", "Recommendation letter", "Request letter", "General letter"]
    }
  ];

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTabHover = (tabId: string) => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveTab(tabId);
  };

  const handleTabLeave = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Delay clearing the active tab to allow moving to submenu
    timeoutRef.current = setTimeout(() => {
      setActiveTab(null);
      timeoutRef.current = null;
    }, 800);
  };

  const handleDropdownEnter = () => {
    // Clear any pending timeout when entering dropdown
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleDropdownLeave = () => {
    // Clear dropdown immediately when leaving it
    setActiveTab(null);
  };

  const handleGroupHover = (groupTitle: string) => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setExpandedGroups(new Set([groupTitle]));
  };

  const handleGroupLeave = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Delay clearing the expanded groups to allow moving to submenu
    timeoutRef.current = setTimeout(() => {
      setExpandedGroups(new Set());
      timeoutRef.current = null;
    }, 800);
  };

  const handleSubmenuEnter = (groupTitle: string) => {
    // Clear any pending timeout when entering submenu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setExpandedGroups(new Set([groupTitle]));
  };

  const handleSubmenuLeave = () => {
    // Clear submenu immediately when leaving it
    setExpandedGroups(new Set());
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex justify-center w-full px-4 mt-5" ref={containerRef}>
        <div className="w-full max-w-5xl">
          <div className="flex justify-center gap-2 relative">
            {tabs.map((tab, index) => (
              <div key={index} className="relative">
                <button
                  onMouseEnter={() => {
                    if (tab.id !== "power-playbook") {
                      handleTabHover(tab.id);
                    }
                  }}
                  onClick={() => {
                    if (tab.id === "power-playbook") {
                      setPowerPlaybookModalOpen(true);
                    }
                  }}
                  onMouseLeave={handleTabLeave}
                  style={{ backgroundColor: activeTab === tab.id ? '#C7A8EA' : '#F3EAFE' }}
                  className={`
                    w-[100px] py-2 rounded-xl font-inter font-medium text-sm tracking-tight text-center
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2
                    flex items-center justify-center
                    leading-tight
                    hover:shadow-md
                    ${activeTab === tab.id
                      ? 'text-[#6F42C1]' 
                      : 'text-[#444] hover:bg-[#DCC8F2]'
                    }
                  `}
                >
                  <span className="whitespace-pre-line">{tab.text}</span>
                </button>
                
                {/* Dropdown - only for certain tabs */}
                {activeTab === tab.id && !["think-hard", "deep-research", "power-playbook"].includes(tab.id) && (
                  <div 
                    className="absolute top-full w-[100px] bg-[#F8F5FE] rounded-lg shadow-md border border-[#E5D9F2] z-50"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {activeTab === "beautiful-writing" && (
                      <div className="py-2">
                        {beautifulWritingItems.map((item, idx) => {
                          if (item.text === "Essay") {
                            return (
                              <EssayHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </EssayHoverCard>
                            );
                          }

                          if (item.text === "Story") {
                            return (
                              <StoryHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </StoryHoverCard>
                            );
                          }

                          if (item.text === "Flash Fiction") {
                            return (
                              <FlashFictionHoverCard key={idx}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </FlashFictionHoverCard>
                            );
                          }

                          if (item.text === "Script") {
                            return (
                              <ScriptHoverCard key={idx}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </ScriptHoverCard>
                            );
                          }

                          if (item.text === "Blog") {
                            return (
                              <BlogHoverCard key={idx}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </BlogHoverCard>
                            );
                          }

                          if (item.text === "Poetry") {
                            return (
                              <PoetryHoverCard key={idx}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </PoetryHoverCard>
                            );
                          }

                          if (item.text === "Speech") {
                            return (
                              <SpeechHoverCard key={idx}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </SpeechHoverCard>
                            );
                          }
                          
                          return (
                            <Tooltip key={idx}>
                              <TooltipTrigger asChild>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
                                <p>{item.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    )}
                    {activeTab === "easy-draft" && (
                      <div className="py-2">
                        {easyDraftGroups.map((group, groupIdx) => (
                          <div key={groupIdx} className="relative">
                            <button
                              className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-pastel-rose-lilac hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                              onMouseEnter={() => handleGroupHover(group.title)}
                              onMouseLeave={handleGroupLeave}
                            >
                              <span>{group.title}</span>
                            </button>
                            {expandedGroups.has(group.title) && (
                              <div 
                                className="absolute left-full top-0 bg-[#F8F5FE] rounded-lg shadow-md border border-[#E5D9F2] z-50 w-48"
                                onMouseEnter={() => handleSubmenuEnter(group.title)}
                                onMouseLeave={handleSubmenuLeave}
                              >
                                <div className="py-2">
                                   {group.items.map((item, itemIdx) => {
                                     const getHoverCard = (item: string, content: React.ReactNode) => {
                                        const hoverCards: { [key: string]: React.ComponentType<any> } = {
                                          "Love letter": LoveLetterHoverCard,
                                          "Apology letter": ApologyLetterHoverCard,
                                          "Thank you letter": ThankYouLetterHoverCard,
                                          "Condolence letter": CondolenceLetterHoverCard,
                                          "Invitation letter": InvitationLetterHoverCard,
                                          "Congratulatory letter": CongratulatoryLetterHoverCard,
                                          "Welcome letter": WelcomeLetterHoverCard,
                                          "Farewell letter": FarewellLetterHoverCard,
                                          "Complaint letter": ComplaintLetterHoverCard,
                                          "Recommendation letter": RecommendationLetterHoverCard,
                                          "Request letter": RequestLetterHoverCard,
                                          "General letter": GeneralLetterHoverCard,
                                          "Leave application": LeaveApplicationHoverCard,
                                          "Permission letter": PermissionLetterHoverCard,
                                          "Appreciation letter": AppreciationLetterHoverCard,
                                          "Appointment request letter": AppointmentRequestHoverCard,
                                          "Publication request letter": PublicationRequestHoverCard,
                                        };
                                       
                                       const HoverCard = hoverCards[item];
                                       return HoverCard ? React.createElement(HoverCard, { key: itemIdx, children: content }) : content;
                                     };

                                      const displayText = item === "Appointment request letter" 
                                        ? "Appointment request\nletter"
                                        : item === "Publication request letter"
                                        ? "Publication request\nletter" 
                                        : item;

                                     return getHoverCard(
                                        item,
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm text-[#666] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-pre-line"
                                          onClick={() => console.log(`Selected: ${item}`)}
                                        >
                                          {displayText}
                                        </button>
                                      );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab === "task-assistant" && (
                      <div className="py-2">
                        {taskAssistantItems.map((item, idx) => {
                          if (item.text === "Brainstorm with me") {
                            return (
                              <BrainstormHoverCard key={idx}>
                                <button
                                         className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-pastel-lavender-hover hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </BrainstormHoverCard>
                            );
                          }

                          if (item.text === "Scenario Planning") {
                            return (
                              <ScenarioHoverCard key={idx}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </ScenarioHoverCard>
                            );
                          }

                          if (item.text === "Think like a mentor") {
                            return (
                              <MentorHoverCard key={idx}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </MentorHoverCard>
                            );
                          }

                          if (item.text === "Be a devil's advocate") {
                            return (
                              <DevilsAdvocateHoverCard key={idx}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </DevilsAdvocateHoverCard>
                            );
                          }

                          if (item.text === "Astro Lens") {
                            return (
                              <AstroLensHoverCard key={idx}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  <div className="leading-tight">
                                    <div>Astro</div>
                                    <div>Lens</div>
                                  </div>
                                </button>
                              </AstroLensHoverCard>
                            );
                          }

                          return (
                            <Tooltip key={idx}>
                              <TooltipTrigger asChild>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onClick={() => console.log(`Selected: ${item.text}`)}
                                >
                                  {item.text}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p>{item.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    )}
                    {activeTab === "experience-studio" && (
                      <div className="py-2">
                        {[
                          "360° Snapshot", "POV Lab", "Future Pathways", 
                          "Roleplay Hub", "Reality Check", "Proto Run"
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                            onClick={() => {
                              if (item === "360° Snapshot") {
                                setSnapshotModalOpen(true);
                              } else if (item === "POV Lab") {
                                setPovLabModalOpen(true);
                              } else if (item === "Future Pathways") {
                                setFuturePathwaysModalOpen(true);
                              } else if (item === "Reality Check") {
                                setRealityCheckModalOpen(true);
                              } else if (item === "Roleplay Hub") {
                                setRoleplayHubModalOpen(true);
                              } else if (item === "Proto Run") {
                                setProtoRunModalOpen(true);
                              } else {
                                console.log(`Selected: ${item}`);
                              }
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
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
    </TooltipProvider>
  );
};

export default WorkflowTabs;