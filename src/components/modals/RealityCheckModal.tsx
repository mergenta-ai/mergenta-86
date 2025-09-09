import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { X, Target, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

interface RealityCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToChat?: (message: string, response: string) => void;
}

interface RealityTile {
  title: string;
  subtitle: string;
  content: string;
  insight: string;
  percentage: number;
  revealed: boolean;
}

const RealityCheckModal = ({ open, onOpenChange, onAddToChat }: RealityCheckModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPersistedResults, setHasPersistedResults] = useState(false);
  const [currentDropdownPair, setCurrentDropdownPair] = useState(0);
  const [tiles, setTiles] = useState<RealityTile[]>([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  const initialTiles: RealityTile[] = [
    {
      title: "Feasibility",
      subtitle: "Can this plan work?",
      content: "Based on your current resources, skills, and market conditions, this plan shows moderate feasibility. Key factors supporting success include your existing foundation and clear timeline. However, resource constraints and skill gaps may require additional attention. Market research suggests 68% probability of achieving core objectives within the proposed timeframe.",
      insight: "Your plan has solid groundwork but needs strategic resource allocation to bridge the gap between ambition and reality.",
      percentage: 15,
      revealed: false
    },
    {
      title: "Evidence", 
      subtitle: "Facts backing the claim",
      content: "Current market data shows growing demand in your sector with 23% year-over-year growth. Your preliminary testing with 200 users yielded promising engagement metrics. Historical data from similar ventures indicates 72% achieve initial milestones when proper validation is conducted. Industry reports confirm market timing aligns with your launch window.",
      insight: "The numbers support your hypothesis, but deeper validation will strengthen your position significantly.",
      percentage: 20,
      revealed: false
    },
    {
      title: "Risks",
      subtitle: "Challenges that may arise", 
      content: "Primary risks include competition intensifying within 6-12 months, potential regulatory changes affecting your sector, and resource burnout during scaling phase. External factors like economic shifts could impact funding availability. Internal risks include team scaling challenges and maintaining quality during rapid growth phases.",
      insight: "Most risks are manageable with proper contingency planning, but timing will be crucial for mitigation strategies.",
      percentage: 25,
      revealed: false
    },
    {
      title: "Alignment",
      subtitle: "Fit with goals/needs",
      content: "This path strongly aligns with your stated objectives and personal values. Skills required match 78% of your current expertise. Financial goals are realistic given projected returns. Timeline fits your life circumstances and long-term vision. However, work-life balance may require adjustment during peak execution phases.",
      insight: "Strong strategic fit exists, but personal bandwidth optimization will determine sustainable success.",
      percentage: 20,
      revealed: false
    },
    {
      title: "Sustainability",
      subtitle: "Will it last long?",
      content: "Long-term viability depends on market evolution and your adaptation capacity. Revenue model shows potential for recurring income streams. Skills developed will remain relevant for 5-7 years minimum. However, continuous innovation and market monitoring will be essential for sustained competitive advantage beyond year three.",
      insight: "Built for endurance if you maintain agility and commit to continuous learning and adaptation.",
      percentage: 20,
      revealed: false
    }
  ];

  // Initialize tiles on mount
  useEffect(() => {
    setTiles(initialTiles);
  }, []);

  // Load persisted data on mount
  useEffect(() => {
    const persistedData = localStorage.getItem('realityCheckModalData');
    if (persistedData) {
      try {
        const { searchValue: persistedSearchValue, timestamp, tiles: persistedTiles, progress } = JSON.parse(persistedData);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (Date.now() - timestamp < oneHour) {
          setSearchValue(persistedSearchValue);
          setShowResults(true);
          setHasPersistedResults(true);
          if (persistedTiles) {
            setTiles(persistedTiles);
            setTotalProgress(progress || 0);
          }
        } else {
          localStorage.removeItem('realityCheckModalData');
        }
      } catch (error) {
        localStorage.removeItem('realityCheckModalData');
      }
    }
  }, []);

  // Save to localStorage when results are shown
  useEffect(() => {
    if (showResults && searchValue) {
      const dataToSave = {
        searchValue,
        tiles,
        progress: totalProgress,
        timestamp: Date.now()
      };
      localStorage.setItem('realityCheckModalData', JSON.stringify(dataToSave));
    }
  }, [showResults, searchValue, tiles, totalProgress]);

  // Rotate dropdown options every 3 seconds
  useEffect(() => {
    if (showDropdown) {
      const interval = setInterval(() => {
        setCurrentDropdownPair(prev => (prev + 1) % 8); // 8 options total, show one at a time
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showDropdown]);

  const allDropdownOptions = [
    "If I switch to a plant-based diet now, I expect I might be able to lose around 20 pounds in six months and feel healthier overall. I have tried reducing meat before and felt a little more energetic, but I am unsure if that effect will continue long term. I don't know if I will be able to stick to the routine when eating out or travelling. I have read about possible vitamin deficiencies and I am worried I might face health risks instead of benefits. Groceries and supplements could also cost more than I expect. While I want to believe the results will be positive, I am doubtful if weight loss and better health will really happen as smoothly as I imagine. I want to check how realistic this change actually is.",
    "If I enrol in an online MBA programme now, I think I can complete it in about 18 months while continuing with my full-time job. I have managed shorter certifications before, but I don't know if a full MBA workload will overwhelm me this time. I believe the degree could give me an edge at work, but I am not certain if it really guarantees a promotion. The fees are high and though I have saved $12,000, I am unsure if that will cover everything or if more hidden costs will arise. I am also doubtful whether online MBAs are valued the same as traditional ones. The pressure of balancing study, work and personal life could become a problem. In summary, I don't know if this decision will turn out to be worth the effort and money.",
    "If I launch my e-commerce store now, I believe I might be able to reach $50,000 in sales within the first year. I tested the idea with about 200 people and although half of them showed interest, I don't know if that's enough proof for real market demand. The initial setup and marketing costs will eat into my $20,000 savings and I am not sure if that will be sufficient. Competition seems low at first glance, but I don't know if bigger players might enter the space quickly. I also have doubts about whether I can manage logistics, customer support and scaling on my own. Investors might or might not find the idea attractive once I start. Overall, I am uncertain whether this plan will really work out the way I expect.",
    "If I apply for residency abroad this year, I assume I could settle within the next 12 months. I have done some preparation, like passing the required language test, but I am unsure if that's enough to succeed in the process. I have saved about $25,000, but I don't know if that will actually cover all living costs and unexpected expenses. Friends who live there say it's manageable, but I worry their experience may not match mine. I am doubtful about how quickly I can find stable employment in a new country. Cultural differences and adapting to a new lifestyle could also become bigger hurdles than I expect. In the end, I am not sure whether this move will be as smooth or successful as I imagine.",
    "If I dedicate two hours daily, I think I can finish writing my first novel in about eight months. I have already written 50 pages, but I don't know if I can maintain the same pace consistently. I am also uncertain if my story is strong enough to attract readers or publishers. Editing, design and publishing costs could go up to $5,000 and I am not sure if investing that money will bring any return. Even if I finish the book, I doubt how much visibility it will get among so many titles already in the market. Writing discipline is another question—I have failed to stick to routines before. All things considered, I am not sure if this dream is achievable in the way I picture it.",
    "If I start waking up two hours earlier each day, I think I can master a new skill in six months. I have tried waking up early before, but I couldn't sustain it for more than a few weeks. I am not sure if I will be disciplined enough to stick with the routine consistently this time. Even if I manage the schedule, I don't know if two extra hours will truly result in meaningful progress on the skill. There is also the possibility of feeling more tired or less productive during the day. Without accountability, I might slip back into old habits. Taken together, I am uncertain whether this plan will work out as I imagine.",
    "If I restructure my team into smaller groups, I expect productivity might improve over the next three months. I tried this on a small project once, but I don't know if it will work across the whole team. Some members may resist the change and I am not certain if morale will go up or down. I also worry about communication gaps or conflicts increasing when people are split up. I don't know if I have enough management skills to handle these new dynamics effectively. There is also a risk leadership won't support the experiment if results aren't quick. On the whole, I am doubtful whether this approach will really deliver the improvements I hope for.",
    "If I quit my IT job now, I can definitely build a mobile app that reaches 50,000 users in six months. I have already developed a prototype and tested it with 120 users, where 40% said they would use it regularly. With my personal savings of $15,000, I believe I can sustain myself without income for about 10 months, so I don't expect financial risks. I also think investors will show interest within the first few months, since my pitch deck highlights a projected 200% ROI in two years. Because I am hardworking and determined, I feel success is almost guaranteed and the business can scale for at least three years. Per se, I don't see much that can go wrong with this plan."
  ];

  // Get current single dropdown option
  const getCurrentDropdownOption = () => {
    return allDropdownOptions[currentDropdownPair];
  };

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

  const handleTileReveal = (index: number) => {
    if (!tiles[index].revealed) {
      const newTiles = [...tiles];
      newTiles[index].revealed = true;
      setTiles(newTiles);
      
      // Update progress
      const newProgress = totalProgress + newTiles[index].percentage;
      setTotalProgress(newProgress);
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
    const revealedTiles = tiles.filter(tile => tile.revealed);
    const response = `**Reality Check Analysis for: "${searchValue}"**

${revealedTiles.map(tile => 
  `**${tile.title}**
${tile.subtitle}
${tile.insight}`
).join('\n\n')}

**Reality Meter: ${totalProgress}%**
Based on ${revealedTiles.length} factors analyzed.`;

    // Add to main chat and close modal
    onAddToChat?.(message, response);
    resetModal();
    onOpenChange(false);
  };

  const resetModal = () => {
    setSearchValue("");
    setShowDropdown(false);
    setShowResults(false);
    setIsLoading(false);
    setHasPersistedResults(false);
    setCurrentDropdownPair(0);
    setTiles(initialTiles);
    setTotalProgress(0);
    localStorage.removeItem('realityCheckModalData');
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

  const handleSaveMyTruth = () => {
    const revealedTiles = tiles.filter(tile => tile.revealed);
    const truthSummary = `**My Reality Check Truth for: "${searchValue}"**

${revealedTiles.map(tile => 
  `**${tile.title}**: ${tile.insight}`
).join('\n\n')}

**Overall Reality Score: ${totalProgress}%**`;

    // Save to global history
    const historyEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'reality-check',
      query: searchValue,
      results: truthSummary,
      progress: totalProgress
    };
    
    const existingHistory = JSON.parse(localStorage.getItem('globalHistory') || '[]');
    existingHistory.push(historyEntry);
    localStorage.setItem('globalHistory', JSON.stringify(existingHistory));
    
    resetModal();
    onOpenChange(false);
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

        <div className="flex flex-col h-full">{/* Remove overflow-y-auto */}
          {/* Loading State - Transition from search to results */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center px-8 pb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <Target className="h-8 w-8 text-mergenta-violet" />
                </div>
                <p className="text-lg text-mergenta-dark-grey animate-pulse">
                  Taking you to the reality analysis room...
                </p>
              </div>
            </div>
          )}

          {/* Header Section - First page only */}
          {!showResults && !isLoading && (
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
                <Target className="h-12 w-12 text-mergenta-violet" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-mergenta-deep-violet mb-3">
                Reality Check
              </h1>
              <p className="text-base md:text-lg text-mergenta-dark-grey max-w-4xl mx-auto leading-relaxed">
                Test your assumptions against real-world feasibility
              </p>
            </div>
          )}

          {/* Header Section - Results page only */}
          {showResults && !isLoading && (
            <div className="flex-shrink-0 px-8 pt-8 pb-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={goBackToSearch}
                  className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
                >
                  <ArrowLeft className="h-5 w-5 text-mergenta-dark-grey" />
                </button>
                <div className="flex items-center justify-center">
                  <Target className="h-8 w-8 text-mergenta-violet" />
                </div>
                <div className="w-9 h-9"></div> {/* Spacer for alignment */}
              </div>
            </div>
          )}

          {/* Search Section - First page */}
          {!showResults && !isLoading && (
            <div className="flex-shrink-0 px-8 mb-8 mt-16">
              <div className="max-w-3xl mx-auto relative" ref={searchRef}>
                <ChatInput 
                  onSendMessage={handleSearchSubmit} 
                  isLoading={isLoading}
                  initialValue={searchValue}
                  onFocus={handleSearchFocus}
                />

                {/* Dropdown Menu with single rotating option */}
                {showDropdown && (
                  <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-md rounded-xl shadow-elegant border border-white/20 z-40 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={() => handleDropdownSelect(getCurrentDropdownOption())}
                        className="w-full text-left px-4 py-3 text-sm text-mergenta-dark-grey/70 hover:bg-pastel-lavender hover:text-mergenta-violet transition-colors rounded-lg mx-1 my-1 animate-in fade-in-50"
                      >
                        <div>{getCurrentDropdownOption()}</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results Section */}
          {showResults && !isLoading && (
            <div className="flex-1 px-8 pb-8">
              {/* Reality Meter */}
              <div className="max-w-4xl mx-auto mb-4">
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-3 shadow-soft">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-md font-semibold text-mergenta-deep-violet">
                      Reality Meter
                    </h3>
                    <p className="text-md font-normal text-black">
                      {totalProgress}% Reality Score
                    </p>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={totalProgress} 
                      className="h-[4px] bg-white/50 [&>div]:bg-gradient-to-r [&>div]:from-mergenta-light-violet [&>div]:to-mergenta-magenta [&>div]:transition-all [&>div]:duration-1000 [&>div]:shadow-glow"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Reality Tiles — Side by side layout */}
              <div className="max-w-6xl mx-auto mb-6">
                <div className="grid grid-cols-5 gap-4">
                  {tiles.map((tile, idx) => (
                    <div
                      key={idx}
                      className={`h-[350px] transition-all duration-700 cursor-pointer ${
                        tile.revealed ? 'filter-none' : 'blur-sm opacity-70'
                      }`}
                      onClick={() => handleTileReveal(idx)}
                      onMouseEnter={() => !tile.revealed && handleTileReveal(idx)}
                    >
                      <div
                        className={`h-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-soft hover:shadow-elegant transition-all duration-300 flex flex-col ${
                          tile.revealed ? 'border-2 border-mergenta-violet/30' : ''
                        }`}
                      >
                        <div className="mb-2">
                          <h3 className="text-lg font-semibold text-mergenta-deep-violet mb-1">
                            {tile.title}
                          </h3>
                          <p className="text-xs text-mergenta-dark-grey/80">
                            {tile.subtitle}
                          </p>
                        </div>

                        {tile.revealed && (
                          <div className="flex-1 overflow-hidden">
                            <div className="overflow-hidden">
                              <p className="text-xs text-mergenta-violet leading-relaxed text-justify">
                                {tile.content} This comprehensive analysis reveals deeper insights into the feasibility and strategic implications of your plan. Key considerations include market dynamics, resource allocation efficiency, competitive positioning, and long-term sustainability factors that could significantly impact your success trajectory. {tile.insight} Additional evaluation shows potential optimization opportunities and risk mitigation strategies that warrant careful consideration during implementation phases.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Bar Below Results */}
              <div className="max-w-3xl mx-auto mt-12">
                <div className="mb-6">
                  <p className="text-center text-mergenta-dark-grey font-medium">
                    Continue with deeper reality exploration
                  </p>
                </div>
                <div className="mb-8">
                  <ChatInput 
                    onSendMessage={handleContinueSearch}
                    placeholder="Dive deeper into your reality assumptions..."
                  />
                </div>
              </div>

                {/* Action Buttons Below Search Bar */}
                <div className="flex justify-center gap-12 mt-8">
                  <Button
                    variant="outline"
                    onClick={handleSaveMyTruth}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Save My Truth
                  </Button>
                  <Button
                    variant="outline" 
                    onClick={resetModal}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Run Again
                  </Button>
                </div>
            </div>
          )}
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export { RealityCheckModal };
export default RealityCheckModal;