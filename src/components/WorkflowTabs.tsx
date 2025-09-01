import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import EssayHoverCard from "./EssayHoverCard";
import StoryHoverCard from "./StoryHoverCard";
import FlashFictionHoverCard from "./FlashFictionHoverCard";

const WorkflowTabs = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { text: "Beautiful\nWriting", id: "beautiful-writing" },
    { text: "Easy\nDraft", id: "easy-draft" },
    { text: "Think\nHard", id: "think-hard" },
    { text: "Deep\nResearch", id: "deep-research" },
    { text: "Task\nAssistant", id: "task-assistant" },
    { text: "Power\nPlaybook", id: "power-playbook" },
    { text: "Experience\nHub", id: "experience-hub" }
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
    { text: "Summarise and compare", tooltip: "Condense text into clear, concise takeaways." },
    { text: "Think like a mentor", tooltip: "Advice with a mentor's voice — guiding, supportive and practical." },
    { text: "Be a devil's advocate", tooltip: "Challenge assumptions — counterpoints and tough questions." },
    { text: "Give life advice", tooltip: "Personal guidance — thoughtful, empathetic and realistic." }
  ];

  const easyDraftGroups = [
    {
      title: "Personal Letters",
      tooltip: "Letters for personal and emotional expressions",
      items: ["Love letter", "Apology letter", "Thank you letter", "Condolence letter"]
    },
    {
      title: "Social Letters", 
      tooltip: "Letters for social, celebratory and community occasions",
      items: ["Invitation letter", "Congratulatory letter", "Welcome letter", "Farewell letter"]
    },
    {
      title: "Formal Letters",
      tooltip: "Letters for professional, general and official purposes", 
      items: ["Complaint letter", "Recommendation letter", "Request letter", "General letter"]
    },
    {
      title: "Institutional Letters",
      tooltip: "Letters commonly required in workplace and organisational contexts",
      items: ["Leave application", "Permission letter", "Appreciation letter", "Experience certificate request", "Salary certificate request"]
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
    }, 200);
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
    }, 200);
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
                  onMouseEnter={() => handleTabHover(tab.id)}
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
                {activeTab === tab.id && !["think-hard", "deep-research"].includes(tab.id) && (
                  <div 
                    className="absolute top-full mt-2 w-[100px] bg-[#F8F5FE] rounded-lg shadow-md border border-[#E5D9F2] z-50"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {activeTab === "beautiful-writing" && (
                      <div className="py-2">
                        {beautifulWritingItems.map((item, idx) => {
                          if (item.text === "Essay") {
                            return (
                              <EssayHoverCard key={idx}>
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
                              <StoryHoverCard key={idx}>
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
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                  onMouseEnter={() => handleGroupHover(group.title)}
                                  onMouseLeave={handleGroupLeave}
                                >
                                  <span>{group.title}</span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
                                <p>{group.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                            {expandedGroups.has(group.title) && (
                              <div 
                                className="absolute left-full top-0 ml-1 bg-[#F8F5FE] rounded-lg shadow-md border border-[#E5D9F2] z-50 w-48"
                                onMouseEnter={() => handleSubmenuEnter(group.title)}
                                onMouseLeave={handleSubmenuLeave}
                              >
                                <div className="py-2">
                                  {group.items.map((item, itemIdx) => (
                                    <button
                                      key={itemIdx}
                                      className="w-full text-left px-4 py-2 text-sm text-[#666] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                                      onClick={() => console.log(`Selected: ${item}`)}
                                    >
                                      {item}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab === "task-assistant" && (
                      <div className="py-2">
                        {taskAssistantItems.map((item, idx) => (
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
                        ))}
                      </div>
                    )}
                    {activeTab === "power-playbook" && (
                      <div className="p-4 text-sm text-[#6F42C1]">
                        Coming soon
                      </div>
                    )}
                    {activeTab === "experience-hub" && (
                      <div className="py-2">
                        {[
                          "Educator experience", "Startup experience", "Writer experience", 
                          "Marketing experience", "Astrology experience", "Elder experience", "Traveller experience", "Parenting experience"
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            className="w-full text-left px-4 py-3 text-sm text-[#444] hover:bg-[#EDE0F7] hover:text-[#6F42C1] transition-colors leading-tight whitespace-normal"
                            onClick={() => console.log(`Selected: ${item}`)}
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
    </TooltipProvider>
  );
};

export default WorkflowTabs;