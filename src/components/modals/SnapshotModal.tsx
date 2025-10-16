import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { X, Eye, Target, AlertTriangle, TrendingUp, ChevronDown, Menu, Pencil, MessageSquare, FileText, Heart, Mail, ArrowLeft, ArrowRight } from "lucide-react";
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
  const [hasPersistedResults, setHasPersistedResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load persisted data on mount
  useEffect(() => {
    const persistedData = localStorage.getItem('snapshotModalData');
    if (persistedData) {
      try {
        const { searchValue: persistedSearchValue, timestamp } = JSON.parse(persistedData);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (Date.now() - timestamp < oneHour) {
          setSearchValue(persistedSearchValue);
          setShowResults(true);
          setHasPersistedResults(true);
        } else {
          localStorage.removeItem('snapshotModalData');
        }
      } catch (error) {
        localStorage.removeItem('snapshotModalData');
      }
    }
  }, []);

  // Save to localStorage when results are shown
  useEffect(() => {
    if (showResults && searchValue) {
      const dataToSave = {
        searchValue,
        timestamp: Date.now()
      };
      localStorage.setItem('snapshotModalData', JSON.stringify(dataToSave));
    }
  }, [showResults, searchValue]);

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
  };

  const handleSearchFocus = () => {
    // Show dropdown when focused if no results are showing
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
    setHasPersistedResults(false);
    localStorage.removeItem('snapshotModalData');
  };

  const goBackToSearch = () => {
    setShowResults(false);
    // Don't reset search value to preserve the query
  };

  const goForwardToResults = () => {
    if (searchValue.trim()) {
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
      <CustomDialogContent className="w-full max-w-[95vw] lg:max-w-6xl h-auto max-h-[90vh] p-0 overflow-auto bg-gradient-to-br from-pastel-lavender via-mergenta-light-violet to-pastel-magenta border-0" onOpenAutoFocus={(e) => e.preventDefault()}>
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
                <Eye className="h-12 w-12 text-mergenta-violet" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-mergenta-deep-violet mb-3">
                360° Snapshot
              </h1>
              <p className="text-base md:text-lg text-mergenta-dark-grey max-w-4xl mx-auto leading-relaxed">
                360° Snapshot gives you a quick all-round view of your query — facts, opportunities, 
                challenges and next moves. The more you explain, the better is the response.
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
                  <Eye className="h-8 w-8 text-mergenta-violet" />
                </div>
                <div className="w-9 h-9"></div> {/* Spacer for alignment */}
              </div>
            </div>
          )}

          {/* Search Section */}
          {!showResults && (
            <div className="flex-shrink-0 px-8 mb-8 mt-16">
              <div className="max-w-3xl mx-auto relative" ref={searchRef}>
                <ChatInput 
                  onSendMessage={handleSearchSubmit} 
                  isLoading={isLoading}
                  initialValue={searchValue}
                  onFocus={handleSearchFocus}
                />

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 max-w-6xl mx-auto">
                 {resultTiles.map((tile, idx) => (
                  <div
                    key={idx}
                    className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-soft hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 animate-in slide-in-from-bottom-4 flex flex-col"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="mb-3 text-left">
                      <h3 className="text-lg font-semibold text-mergenta-deep-violet mb-1">
                        {tile.title}
                      </h3>
                      <p className="text-sm text-mergenta-dark-grey/80">
                        {tile.subtitle}
                      </p>
                    </div>
                    
                    <ul className="space-y-2 flex-1">
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
              <div className="max-w-3xl mx-auto mt-8">
                <div className="mb-6">
                  <p className="text-center text-mergenta-dark-grey font-medium">
                    Continue the conversation
                  </p>
                </div>
                <div className="mb-8">
                  <ChatInput 
                    onSendMessage={handleContinueSearch} 
                    isLoading={isLoading}
                    placeholder="Ask a follow-up or start a new snapshot…"
                  />
                </div>

                {/* Action Buttons Below Search Bar */}
                <div className="flex justify-center gap-12 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => {
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
                      navigator.clipboard.writeText(response);
                    }}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Copy All Snapshot
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
                  <Eye className="h-8 w-8 text-mergenta-violet" />
                </div>
                <p className="text-lg text-mergenta-dark-grey">
                  Analyzing your query from all angles...
                </p>
              </div>
            </div>
          )}
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export { SnapshotModal };