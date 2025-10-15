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
import { ImageGenerationModal } from "./modals/ImageGenerationModal";

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
  const [imageGenModalOpen, setImageGenModalOpen] = useState(false);
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveTab(tabId);
  };

  const handleTabLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveTab(null);
      timeoutRef.current = null;
    }, 800);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleDropdownLeave = () => {
    setActiveTab(null);
  };

  const handleGroupHover = (groupTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setExpandedGroups(new Set([groupTitle]));
  };

  const handleGroupLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setExpandedGroups(new Set());
      timeoutRef.current = null;
    }, 800);
  };

  const handleSubmenuEnter = (groupTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setExpandedGroups(new Set([groupTitle]));
  };

  const handleSubmenuLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setExpandedGroups(new Set());
      timeoutRef.current = null;
    }, 800);
  };

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
          <div className="flex justify-center gap-2 relative overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
               style={{ 
                 WebkitOverflowScrolling: 'touch',
                 scrollbarWidth: 'none',
                 msOverflowStyle: 'none',
                 paddingBottom: '400px',
                 marginBottom: '-400px'
               }}>
            {tabs.map((tab, index) => (
              <div key={index} className="relative snap-center flex-shrink-0">
                <button
                  onMouseEnter={() => handleTabHover(tab.id)}
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
                    focus:outline-none
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
                
                {/* Dropdown */}
                {activeTab === tab.id && !["power-playbook", "think-hard", "deep-research"].includes(tab.id) && (
                  <div 
                    className="absolute top-full w-[min(92vw,380px)] sm:w-80 max-h-[60vh] overflow-y-auto overscroll-contain bg-[#F8F5FE] rounded-lg shadow-lg border border-[#E5D9F2] z-[100]"
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
                               <FlashFictionHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
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
                               <ScriptHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
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
                               <BlogHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
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
                               <PoetryHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
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
                               <SpeechHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
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
                                className={`absolute left-full ${groupIdx >= 2 ? 'bottom-0' : 'top-0'} bg-[#F8F5FE] rounded-lg shadow-lg border border-[#E5D9F2] z-[100] w-[min(92vw,360px)] sm:w-60 max-h-[60vh] overflow-y-auto overscroll-contain`}
                                onMouseEnter={() => handleSubmenuEnter(group.title)}
                                onMouseLeave={handleSubmenuLeave}
                              >
                                <div className="py-2">
                                   {group.items.map((item, itemIdx) => {
                                      if (item === "Love letter") {
                                        return (
                                          <LoveLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </LoveLetterHoverCard>
                                        );
                                      }
                                      if (item === "Apology letter") {
                                        return (
                                          <ApologyLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </ApologyLetterHoverCard>
                                        );
                                      }
                                      if (item === "Thank you letter") {
                                        return (
                                          <ThankYouLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </ThankYouLetterHoverCard>
                                        );
                                      }
                                      if (item === "Condolence letter") {
                                        return (
                                          <CondolenceLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </CondolenceLetterHoverCard>
                                        );
                                      }
                                      if (item === "Invitation letter") {
                                        return (
                                          <InvitationLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </InvitationLetterHoverCard>
                                        );
                                      }
                                      if (item === "Congratulatory letter") {
                                        return (
                                          <CongratulatoryLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </CongratulatoryLetterHoverCard>
                                        );
                                      }
                                      if (item === "Welcome letter") {
                                        return (
                                          <WelcomeLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </WelcomeLetterHoverCard>
                                        );
                                      }
                                      if (item === "Farewell letter") {
                                        return (
                                          <FarewellLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </FarewellLetterHoverCard>
                                        );
                                      }
                                      if (item === "Leave application") {
                                        return (
                                          <LeaveApplicationHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </LeaveApplicationHoverCard>
                                        );
                                      }
                                      if (item === "Permission letter") {
                                        return (
                                          <PermissionLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </PermissionLetterHoverCard>
                                        );
                                      }
                                      if (item === "Appreciation letter") {
                                        return (
                                          <AppreciationLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </AppreciationLetterHoverCard>
                                        );
                                      }
                                      if (item === "Appointment request letter") {
                                        return (
                                          <AppointmentRequestHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </AppointmentRequestHoverCard>
                                        );
                                      }
                                      if (item === "Publication request letter") {
                                        return (
                                          <PublicationRequestHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </PublicationRequestHoverCard>
                                        );
                                      }
                                      if (item === "Complaint letter") {
                                        return (
                                          <ComplaintLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </ComplaintLetterHoverCard>
                                        );
                                      }
                                      if (item === "Recommendation letter") {
                                        return (
                                          <RecommendationLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </RecommendationLetterHoverCard>
                                        );
                                      }
                                      if (item === "Request letter") {
                                        return (
                                          <RequestLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </RequestLetterHoverCard>
                                        );
                                      }
                                      if (item === "General letter") {
                                        return (
                                          <GeneralLetterHoverCard key={itemIdx} onPromptGenerated={onPromptGenerated}>
                                            <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                              {item}
                                            </button>
                                          </GeneralLetterHoverCard>
                                        );
                                      }
                                      return null;
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
                              <BrainstormHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
                                <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                  {item.text}
                                </button>
                              </BrainstormHoverCard>
                            );
                          }
                          if (item.text === "Scenario Planning") {
                            return (
                              <ScenarioHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
                                <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                  {item.text}
                                </button>
                              </ScenarioHoverCard>
                            );
                          }
                          if (item.text === "Think like a mentor") {
                            return (
                              <MentorHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
                                <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                  {item.text}
                                </button>
                              </MentorHoverCard>
                            );
                          }
                          if (item.text === "Be a devil's advocate") {
                            return (
                              <DevilsAdvocateHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
                                <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                  {item.text}
                                </button>
                              </DevilsAdvocateHoverCard>
                            );
                          }
                          if (item.text === "Astro Lens") {
                            return (
                              <AstroLensHoverCard key={idx} onPromptGenerated={onPromptGenerated}>
                                <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
                                  {item.text}
                                </button>
                              </AstroLensHoverCard>
                            );
                          }
                          return (
                            <Tooltip key={idx}>
                              <TooltipTrigger asChild>
                                <button className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal">
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
      
      <ImageGenerationModal 
        isOpen={imageGenModalOpen}
        onClose={() => setImageGenModalOpen(false)}
      />
    </TooltipProvider>
  );
};

export default WorkflowTabs;
