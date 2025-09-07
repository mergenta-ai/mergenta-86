import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { X, Eye, User, Users, Lightbulb, AlertCircle, Crown, Globe, Heart, Zap, Wrench, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// Custom DialogContent without automatic close button
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

import { Button } from "@/components/ui/button";
import ChatInput from "@/components/ChatInput";

interface POVLabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToChat?: (message: string, response: string) => void;
}

interface PersonaTile {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  results: string[];
}

const POVLabModal = ({ open, onOpenChange, onAddToChat }: POVLabModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPersistedResults, setHasPersistedResults] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState<PersonaTile[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load persisted data on mount
  useEffect(() => {
    const persistedData = localStorage.getItem('povLabModalData');
    if (persistedData) {
      try {
        const { searchValue: persistedSearchValue, selectedTiles: persistedTiles, timestamp } = JSON.parse(persistedData);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (Date.now() - timestamp < oneHour) {
          setSearchValue(persistedSearchValue);
          setSelectedTiles(persistedTiles);
          setShowResults(true);
          setHasPersistedResults(true);
        } else {
          localStorage.removeItem('povLabModalData');
        }
      } catch (error) {
        localStorage.removeItem('povLabModalData');
      }
    }
  }, []);

  // Save to localStorage when results are shown
  useEffect(() => {
    if (showResults && searchValue && selectedTiles.length > 0) {
      const dataToSave = {
        searchValue,
        selectedTiles,
        timestamp: Date.now()
      };
      localStorage.setItem('povLabModalData', JSON.stringify(dataToSave));
    }
  }, [showResults, searchValue, selectedTiles]);

  const dropdownOptions = [
    "If I launch this now, what will people notice first?",
    "What one thing makes this seem trustworthy or fake?",
    "What first feeling does the name or title give?",
    "If I call this premium, where might it feel wrong?",
    "What one objection will make people lose interest?",
    "If people talked about this in private, what tone would they use?",
    "What feature should I add to make it more appealing?",
    "What feature should I add to make it more attractive?"
  ];

  const allPersonaTiles: PersonaTile[] = [
    {
      title: "Customer",
      subtitle: "The end-user who lives with your product or idea.",
      icon: User,
      results: [
        "This looks promising but I need to see results first",
        "The price point seems reasonable for what's offered",
        "I wonder if this will actually solve my daily problem",
        "The interface feels intuitive and easy to navigate",
        "I'd recommend this if it delivers on its promises"
      ]
    },
    {
      title: "Colleague",
      subtitle: "A peer beside you, sharing day-to-day reality.",
      icon: Users,
      results: [
        "This could streamline our workflow significantly",
        "Implementation might face resistance from the team",
        "The learning curve looks manageable for most users",
        "Budget approval could be challenging this quarter",
        "We should pilot this with a small group first"
      ]
    },
    {
      title: "Expert",
      subtitle: "A guide who brings domain knowledge and experience.",
      icon: Eye,
      results: [
        "The technical architecture appears sound and scalable",
        "Market timing aligns well with current industry trends",
        "Consider compliance requirements in regulated sectors",
        "The competitive landscape presents both risks and opportunities",
        "Long-term sustainability depends on continuous innovation"
      ]
    },
    {
      title: "Critic",
      subtitle: "A skeptic who questions your assumptions and points out flaws.",
      icon: AlertCircle,
      results: [
        "The value proposition isn't clearly differentiated",
        "Customer acquisition costs may be underestimated",
        "Security concerns haven't been adequately addressed",
        "The business model has potential scalability issues",
        "Market research seems limited and possibly biased"
      ]
    },
    {
      title: "Decision-maker",
      subtitle: "An authority who controls approval, investment, or support.",
      icon: Crown,
      results: [
        "ROI projections need more conservative estimates",
        "Risk mitigation strategies require further development",
        "Resource allocation must align with strategic priorities",
        "Stakeholder buy-in is essential for successful execution",
        "Performance metrics should be clearly defined upfront"
      ]
    },
    {
      title: "Community",
      subtitle: "The wider group or society that feels the ripple effects.",
      icon: Globe,
      results: [
        "Environmental impact should be carefully considered",
        "Local economic effects could be significant",
        "Social equity concerns need to be addressed",
        "Cultural sensitivity is important for broader acceptance",
        "Long-term community benefits outweigh short-term disruption"
      ]
    },
    {
      title: "Family & Friend",
      subtitle: "Those close to you, offering personal concern or encouragement.",
      icon: Heart,
      results: [
        "I'm proud of your ambition and vision",
        "Make sure you're not overextending yourself",
        "This could be the breakthrough you've been working toward",
        "Consider the impact on your work-life balance",
        "We'll support you no matter what you decide"
      ]
    },
    {
      title: "Innovative Thinker",
      subtitle: "The forward-looking mind imagining bold possibilities.",
      icon: Lightbulb,
      results: [
        "This could be the foundation for something much bigger",
        "Integration with emerging technologies shows promise",
        "The potential for disrupting traditional models is high",
        "Future iterations could expand into adjacent markets",
        "This positions you well for the next wave of innovation"
      ]
    },
    {
      title: "Practical View",
      subtitle: "The grounded doer who cuts through to what works now.",
      icon: Wrench,
      results: [
        "Focus on the core features that deliver immediate value",
        "The implementation timeline seems realistic and achievable",
        "Start with proven methods before trying experimental approaches",
        "Resource requirements are within reasonable limits",
        "Quick wins will build momentum for larger initiatives"
      ]
    }
  ];

  const selectRelevantTiles = (query: string): PersonaTile[] => {
    // Simple logic to select 3 most relevant tiles
    // In a real implementation, this would use AI/ML to determine relevance
    const shuffled = [...allPersonaTiles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const handleSearchSubmit = async (message: string) => {
    setSearchValue(message);
    setShowDropdown(false);
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const relevantTiles = selectRelevantTiles(message);
    setSelectedTiles(relevantTiles);
    setIsLoading(false);
    setShowResults(true);
  };

  const handleDropdownSelect = (option: string) => {
    setSearchValue(option);
    setShowDropdown(false);
  };

  const handleSearchFocus = () => {
    // Only show dropdown if search is empty and no results are showing
    if (!showResults && !searchValue.trim()) {
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
    const response = `**POV Lab Analysis for: "${searchValue}"**

${selectedTiles.map(tile => `
**${tile.title}**
${tile.subtitle}
${tile.results.map(r => `• ${r}`).join('\n')}
`).join('\n')}`;

    // Add to main chat and close modal
    onAddToChat?.(searchValue, response);
    resetModal();
    onOpenChange(false);
    
    // Handle the new message
    console.log('Continue search:', message);
  };

  const resetModal = () => {
    setSearchValue("");
    setShowDropdown(false);
    setShowResults(false);
    setIsLoading(false);
    setHasPersistedResults(false);
    setSelectedTiles([]);
    localStorage.removeItem('povLabModalData');
  };

  const goBackToSearch = () => {
    setShowResults(false);
    // Don't reset search value to preserve the query
  };

  const goForwardToResults = () => {
    if (searchValue.trim() && selectedTiles.length > 0) {
      setShowResults(true);
    }
  };

  // Reset modal when it opens/closes, but preserve results if they exist
  useEffect(() => {
    if (!open && !hasPersistedResults) {
      resetModal();
    }
  }, [open, hasPersistedResults]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-gradient-to-br from-mergenta-deep-violet/80 via-mergenta-violet/70 to-mergenta-magenta/60 backdrop-blur-lg" />
      <CustomDialogContent className="max-w-[1210px] max-h-[86vh] w-[105vw] h-[100vh] p-0 overflow-hidden bg-gradient-to-br from-pastel-lavender via-mergenta-light-violet to-pastel-magenta border-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-6 top-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
        >
          <X className="h-5 w-5 text-mergenta-dark-grey" />
        </button>

        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header Section - First page only */}
          {!showResults && (
            <div className="flex-shrink-0 text-center pt-16 pb-6 px-8 relative">
              {/* Forward arrow in top left corner */}
              {searchValue.trim() && (
                <button
                  onClick={goForwardToResults}
                  className="absolute top-8 left-8 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
                >
                  <ArrowRight className="h-5 w-5 text-mergenta-dark-grey" />
                </button>
              )}
              <div className="flex items-center justify-center mb-8">
                <Users className="h-12 w-12 text-mergenta-violet" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-mergenta-deep-violet mb-3">
                <div>POV</div>
                <div>Lab</div>
              </h1>
              <p className="text-base md:text-lg text-mergenta-dark-grey max-w-4xl mx-auto leading-relaxed">
                See your query through three points of view — each with its own voice.
              </p>
            </div>
          )}

          {/* Header Section - Results page only */}
          {showResults && (
            <div className="flex-shrink-0 px-8 pt-8 pb-20">
              <div className="flex items-center justify-between">
                <button
                  onClick={goBackToSearch}
                  className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
                >
                  <ArrowLeft className="h-5 w-5 text-mergenta-dark-grey" />
                </button>
                <div className="flex items-center justify-center">
                  <Users className="h-8 w-8 text-mergenta-violet" />
                </div>
                <div className="w-9 h-9"></div> {/* Spacer for alignment */}
              </div>
            </div>
          )}

          {/* Search Section */}
          {!showResults && (
            <div className="flex-shrink-0 px-8 mb-8 mt-16">
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

          {/* Results Section */}
          {showResults && (
            <div className="flex-1 px-8 pb-8">
              {/* Result Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
                {selectedTiles.map((tile, idx) => (
                  <div
                    key={idx}
                    className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 animate-in slide-in-from-bottom-4 flex flex-col"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="mb-4 text-left flex items-center">
                      <tile.icon className="h-6 w-6 text-mergenta-violet mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-mergenta-deep-violet mb-1">
                          {tile.title}
                        </h3>
                        <p className="text-sm text-mergenta-dark-grey/80">
                          {tile.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 flex-1">
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
              <div className="max-w-3xl mx-auto mt-20">
                <div className="mb-6">
                  <p className="text-center text-mergenta-dark-grey font-medium">
                    Continue the conversation
                  </p>
                </div>
                <div className="mb-8">
                  <ChatInput 
                    onSendMessage={handleContinueSearch} 
                    isLoading={isLoading}
                    placeholder="Ask a follow-up or explore a different perspective…"
                  />
                </div>

                {/* Action Buttons Below Search Bar */}
                <div className="flex justify-center gap-12 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const response = `**POV Lab Analysis for: "${searchValue}"**

${selectedTiles.map(tile => `
**${tile.title}**
${tile.subtitle}
${tile.results.map(r => `• ${r}`).join('\n')}
`).join('\n')}`;
                      navigator.clipboard.writeText(response);
                    }}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Copy All Analysis
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetModal();
                    }}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Start Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !showResults && (
            <div className="flex-1 flex items-center justify-center px-8 pb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <Users className="h-8 w-8 text-mergenta-violet" />
                </div>
                <p className="text-lg text-mergenta-dark-grey">
                  Analyzing from different perspectives...
                </p>
              </div>
            </div>
          )}
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export { POVLabModal };