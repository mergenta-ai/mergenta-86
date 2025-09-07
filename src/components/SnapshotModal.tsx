import { useState, useRef, useEffect } from "react";
import { X, Eye, Target, AlertTriangle, TrendingUp, ChevronDown, Menu, Pencil, MessageSquare, FileText, Heart, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ChatInput from "@/components/ChatInput";
import WorkflowTabs from "@/components/WorkflowTabs";

interface SnapshotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToChat?: (message: string, response: string) => void;
}

interface ResultTile {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  results: string[];
}

const SnapshotModal = ({ open, onOpenChange, onAddToChat }: SnapshotModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const dropdownOptions = [
    "Should I launch a podcast?",
    "Is it the right time to switch careers?",
    "How do I expand my café to another city?",
    "Should I look for a co-founder for my startup?",
    "What if I move abroad for work?"
  ];

  const resultTiles: ResultTile[] = [
    {
      title: "Facts & Insights",
      subtitle: "What is true and relevant in the background?",
      icon: Eye,
      results: [
        "Current market conditions support your initiative",
        "Industry trends align with your proposed direction",
        "Available resources meet baseline requirements",
        "Regulatory environment is favorable",
        "Technology infrastructure is mature enough"
      ]
    },
    {
      title: "Opportunities",
      subtitle: "Where the openings and upsides may be?",
      icon: Target,
      results: [
        "Untapped market segment with high potential",
        "Partnership opportunities with key players",
        "Government incentives available this quarter",
        "Competitive landscape has gaps to exploit",
        "Consumer demand is growing rapidly"
      ]
    },
    {
      title: "Challenges",
      subtitle: "What hurdles and risks stand in the way?",
      icon: AlertTriangle,
      results: [
        "Initial capital requirements are substantial",
        "Market competition is intensifying",
        "Regulatory compliance complexity",
        "Skills gap in required expertise",
        "Time constraints may impact execution"
      ]
    },
    {
      title: "Next Moves",
      subtitle: "Practical steps to take things forward.",
      icon: TrendingUp,
      results: [
        "Conduct detailed market research within 2 weeks",
        "Develop minimum viable product prototype",
        "Secure initial funding or investment",
        "Build strategic partnerships early",
        "Create timeline with measurable milestones"
      ]
    }
  ];

  const handleSearchSubmit = async (message: string) => {
    setSearchValue(message);
    setShowDropdown(false);
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setShowResults(true);
  };

  const handleDropdownSelect = (option: string) => {
    setSearchValue(option);
    setShowDropdown(false);
    // Don't auto-submit, let user press send button
  };

  const handleSearchFocus = () => {
    if (!showResults) {
      setShowDropdown(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContinueSearch = (message: string) => {
    // Create response string from current results
    const response = `**360° Snapshot Analysis for: "${searchValue}"**

**Facts & Insights**
What is true and relevant in the background?
${resultTiles[0].results.map(r => `• ${r}`).join('\n')}

**Opportunities** 
Where the openings and upsides may be?
${resultTiles[1].results.map(r => `• ${r}`).join('\n')}

**Challenges**
What hurdles and risks stand in the way?
${resultTiles[2].results.map(r => `• ${r}`).join('\n')}

**Next Moves**
Practical steps to take things forward.
${resultTiles[3].results.map(r => `• ${r}`).join('\n')}`;

    // Add to main chat and close modal
    onAddToChat?.(searchValue, response);
    resetModal();
    onOpenChange(false);
    
    // Handle the new message
    // This would go to main chat system
    console.log('Continue search:', message);
  };

  const resetModal = () => {
    setSearchValue("");
    setShowDropdown(false);
    setShowResults(false);
    setIsLoading(false);
  };

  // Reset modal when it opens/closes
  useEffect(() => {
    if (!open) {
      resetModal();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-gradient-to-br from-mergenta-deep-violet/60 via-mergenta-violet/50 to-mergenta-magenta/45 backdrop-blur-md" />
      <DialogContent className="max-w-[1210px] max-h-[86vh] w-[105vw] h-[100vh] p-0 overflow-hidden bg-gradient-to-br from-pastel-lavender via-mergenta-light-violet to-pastel-magenta border-0">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-6 top-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
        >
          <X className="h-5 w-5 text-mergenta-dark-grey" />
        </button>

        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header Section */}
          <div className="flex-shrink-0 text-center pt-8 pb-6 px-8">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
                <Eye className="h-12 w-12 text-mergenta-violet" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-mergenta-deep-violet mb-3">
              360° Snapshot
            </h1>
            <p className="text-base md:text-lg text-mergenta-dark-grey max-w-4xl mx-auto leading-relaxed">
              360° Snapshot gives you a quick all-round view of your query — facts, opportunities, 
              challenges and next moves. The more you explain, the better is the response.
            </p>
          </div>

          {/* Search Section */}
          {!showResults && (
            <div className="flex-shrink-0 px-8 mb-4">
              <div className="max-w-3xl mx-auto relative" ref={searchRef}>
                <div onClick={handleSearchFocus} className="cursor-text">
                  <ChatInput 
                    onSendMessage={handleSearchSubmit} 
                    isLoading={isLoading}
                    initialValue={searchValue}
                  />
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-elegant border border-white/20 z-40 overflow-hidden">
                    <div className="p-2">
                      <div className="flex items-center justify-between px-4 py-3 text-sm text-mergenta-dark-grey border-b border-gray-100">
                        <span className="font-medium">Suggested queries</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      {dropdownOptions.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDropdownSelect(option)}
                          className="w-full text-left px-4 py-3 text-sm text-mergenta-dark-grey hover:bg-pastel-lavender hover:text-mergenta-violet transition-colors rounded-lg mx-1 my-1"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Workflow Tabs */}
          {!showResults && (
            <div className="flex-shrink-0 px-8 mb-8">
              <WorkflowTabs onAddToChat={onAddToChat} />
            </div>
          )}

          {/* Results Section */}
          {showResults && (
            <div className="flex-1 px-8 pb-8">
              {/* Result Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto">
                {resultTiles.map((tile, idx) => (
                  <div
                    key={idx}
                    className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-soft hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 animate-in slide-in-from-bottom-4 flex flex-col h-80"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center mb-3">
                      <tile.icon className="h-5 w-5 text-mergenta-violet mr-3" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-mergenta-deep-violet">
                          {tile.title}
                        </h3>
                        <p className="text-sm text-mergenta-dark-grey/80">
                          {tile.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 flex-1 overflow-y-auto">
                      {tile.results.map((result, resultIdx) => (
                        <li
                          key={resultIdx}
                          className="flex items-start text-sm text-mergenta-dark-grey"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-mergenta-violet mt-1.5 mr-2 flex-shrink-0" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Search Bar Below Results */}
              <div className="max-w-3xl mx-auto">
                <div className="mb-4">
                  <p className="text-center text-mergenta-dark-grey font-medium">
                    Continue the conversation
                  </p>
                </div>
                <ChatInput 
                  onSendMessage={handleContinueSearch} 
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !showResults && (
            <div className="flex-1 flex items-center justify-center px-8 pb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <Eye className="h-8 w-8 text-mergenta-violet" />
                </div>
                <p className="text-lg text-mergenta-dark-grey">
                  Analyzing your query from all angles...
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SnapshotModal };