import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { X, Compass, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ChatInput from "@/components/ChatInput";

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

interface FuturePathwaysModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToChat?: (message: string, response: string) => void;
}

interface ResultTile {
  title: string;
  subtitle: string;
  results: string[];
}

const FuturePathwaysModal = ({ open, onOpenChange, onAddToChat }: FuturePathwaysModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPersistedResults, setHasPersistedResults] = useState(false);
  const [currentDropdownPair, setCurrentDropdownPair] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load persisted data on mount
  useEffect(() => {
    const persistedData = localStorage.getItem('futurePathwaysModalData');
    if (persistedData) {
      try {
        const { searchValue: persistedSearchValue, timestamp } = JSON.parse(persistedData);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (Date.now() - timestamp < oneHour) {
          setSearchValue(persistedSearchValue);
          setShowResults(true);
          setHasPersistedResults(true);
        } else {
          localStorage.removeItem('futurePathwaysModalData');
        }
      } catch (error) {
        localStorage.removeItem('futurePathwaysModalData');
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
      localStorage.setItem('futurePathwaysModalData', JSON.stringify(dataToSave));
    }
  }, [showResults, searchValue]);

  // Rotate dropdown options every 3 seconds
  useEffect(() => {
    if (showDropdown) {
      const interval = setInterval(() => {
        setCurrentDropdownPair(prev => (prev + 1) % 5); // 10 options / 2 = 5 pairs
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showDropdown]);

  const allDropdownOptions = [
    "I am currently working in accounts at a mid-sized firm. Within the next two years, I want to move into sales because I enjoy client interaction and business development. I am unsure whether to pursue a specialised sales course, look for an internal transfer or apply directly to sales roles in another company.",
    "I am currently single and focusing on my career. In the next three years, I plan to marry and start a family. I am trying to balance professional growth with personal readiness and I am uncertain whether to settle in my current city, relocate closer to my family or move abroad for better opportunities.",
    "My startup has been running steadily for the last three years and is now generating consistent revenue. Over the next five years, I want to expand into at least two more cities. I am debating whether to raise external funding, grow organically from current profits or explore a joint venture with a regional partner.",
    "I have been working long hours and my health has suffered in terms of stress and weight gain. Over the next 12 months, I want to focus on improving fitness and reducing anxiety. I am considering joining a gym, hiring a personal trainer or following a structured online health programme.",
    "I have savings of around 25,000 dollars currently placed in low-risk deposits and I am now considering long-term wealth creation. Over the next 10 years, I want to build a strong and diversified investment portfolio. I am unsure whether to focus on equities, mutual funds, property or insurance products and I need clarity on the potential returns and risks of each option.",
    "I am currently living in a large city and feel overwhelmed by the pace of life. Within the next 2–3 years, I want to explore relocation for a more balanced lifestyle. I am weighing options such as moving to a smaller city, relocating abroad to a place like Sydney for work or staying where I am but shifting to hybrid or remote work arrangements.",
    "I feel strongly about contributing to sustainability and community development. Over the next 5–10 years, I want to make meaningful impact while balancing my professional career. I am considering pursuing a master's in public policy, joining an established non-profit organisation or starting a social enterprise of my own. I am uncertain whether I should gain more financial stability first before dedicating myself full-time to impact work.",
    "I am currently completing my graduate degree and need to plan my next step. Over the coming years, I want to consider pursuing a master's, enrolling in a professional certification or preparing for a research qualification like a PhD. I am uncertain whether gaining work experience first would strengthen my applications or if I should continue directly with further studies.",
    "I am working as a project manager but see technology reshaping my industry. In the next 2–3 years, I want to develop strong skills in areas such as AI, data analysis or automation. I am weighing options like structured online learning, an intensive bootcamp or enrolling in a postgraduate diploma. I am not sure whether employers will value formal qualifications more than practical, hands-on projects.",
    "I have always had an interest in writing and the arts but have pursued a career in business so far. Over the next 3–5 years, I want to explore whether I can develop this into a serious pursuit. I am considering publishing short stories, starting a creative blog or taking professional training in design and media. I am uncertain whether to treat this as a side passion, a parallel career or attempt a full shift into the creative field."
  ];

  // Get current pair of dropdown options
  const getCurrentDropdownOptions = () => {
    const startIndex = currentDropdownPair * 2;
    return allDropdownOptions.slice(startIndex, startIndex + 2);
  };

  const resultTiles: ResultTile[] = [
    {
      title: "Clear Skies",
      subtitle: "A favourable, best-case pathway.",
      results: [
        "Market conditions strongly favor your direction",
        "Resources align perfectly with your goals",
        "Network connections support your path",
        "Timing is optimal for this transition",
        "Skills gap is minimal and manageable"
      ]
    },
    {
      title: "Steady Course",
      subtitle: "The balanced, most likely pathway.",
      results: [
        "Gradual progress with predictable milestones",
        "Moderate resource requirements",
        "Standard challenges that can be managed",
        "Reasonable timeline for achievement",
        "Balanced risk-reward proposition"
      ]
    },
    {
      title: "Storm Ahead",
      subtitle: "Challenges and obstacles to expect.",
      results: [
        "Significant resource constraints ahead",
        "Market headwinds may slow progress",
        "Competition will intensify",
        "Skills development will be crucial",
        "Timeline may extend beyond expectations"
      ]
    },
    {
      title: "Unexpected Turn",
      subtitle: "An alternative, less-expected pathway.",
      results: [
        "Alternative route through partnership",
        "Technology disruption creates new path",
        "Regulatory changes open new opportunities",
        "Personal circumstances shift priorities",
        "Market pivot reveals better option"
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
    const response = `**Future Pathways Analysis for: "${searchValue}"**

**Clear Skies**
A favourable, best-case pathway.
${resultTiles[0].results.map(r => `• ${r}`).join('\n')}

**Steady Course** 
The balanced, most likely pathway.
${resultTiles[1].results.map(r => `• ${r}`).join('\n')}

**Storm Ahead**
Challenges and obstacles to expect.
${resultTiles[2].results.map(r => `• ${r}`).join('\n')}

**Unexpected Turn**
An alternative, less-expected pathway.
${resultTiles[3].results.map(r => `• ${r}`).join('\n')}`;

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
    setCurrentDropdownPair(0);
    localStorage.removeItem('futurePathwaysModalData');
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
                <Compass className="h-12 w-12 text-mergenta-violet" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-mergenta-deep-violet mb-3">
                Future Pathways
              </h1>
              <p className="text-base md:text-lg text-mergenta-dark-grey max-w-4xl mx-auto leading-relaxed">
                Explore where your choices can lead
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
                  <Compass className="h-8 w-8 text-mergenta-violet" />
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

                {/* Dropdown Menu with rotating options */}
                {showDropdown && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-elegant border border-white/20 z-40 overflow-hidden">
                    <div className="p-2">
                      <div className="flex items-center justify-between px-4 py-3 text-sm text-mergenta-dark-grey border-b border-gray-100">
                        <span className="font-medium">Suggested scenario themes</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      {getCurrentDropdownOptions().map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDropdownSelect(option)}
                          className="w-full text-left px-4 py-3 text-sm text-mergenta-dark-grey hover:bg-pastel-lavender hover:text-mergenta-violet transition-colors rounded-lg mx-1 my-1 animate-in fade-in-50"
                          style={{ animationDelay: `${idx * 100}ms` }}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-16 max-w-6xl mx-auto">
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
                    Continue exploring your pathways
                  </p>
                </div>
                <div className="mb-8">
                  <ChatInput 
                    onSendMessage={handleContinueSearch} 
                    isLoading={isLoading}
                    placeholder="Ask a follow-up or explore another pathway…"
                  />
                </div>

                {/* Action Buttons Below Search Bar */}
                <div className="flex justify-center gap-12 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const response = `**Future Pathways Analysis for: "${searchValue}"**

**Clear Skies**
A favourable, best-case pathway.
${resultTiles[0].results.map(r => `• ${r}`).join('\n')}

**Steady Course** 
The balanced, most likely pathway.
${resultTiles[1].results.map(r => `• ${r}`).join('\n')}

**Storm Ahead**
Challenges and obstacles to expect.
${resultTiles[2].results.map(r => `• ${r}`).join('\n')}

**Unexpected Turn**
An alternative, less-expected pathway.
${resultTiles[3].results.map(r => `• ${r}`).join('\n')}`;
                      navigator.clipboard.writeText(response);
                    }}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Copy All Scenarios
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetModal();
                    }}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Search Again
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
                  <Compass className="h-8 w-8 text-mergenta-violet" />
                </div>
                <p className="text-lg text-mergenta-dark-grey">
                  Mapping your future pathways...
                </p>
              </div>
            </div>
          )}
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export { FuturePathwaysModal };