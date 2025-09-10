import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { X, Zap, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
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

interface ProtoRunModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToChat?: (message: string, response: string) => void;
}

interface PlaybackData {
  title: string;
  subtitle: string;
  beats: string[];
}

const ProtoRunModal = ({ open, onOpenChange, onAddToChat }: ProtoRunModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [showSprint, setShowSprint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDropdownPair, setCurrentDropdownPair] = useState(0);
  const [selectedPlaybackType, setSelectedPlaybackType] = useState<number>(0);
  const [sprintTitle, setSprintTitle] = useState("");
  const [sprintDescription, setSprintDescription] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Rotate dropdown options every 3 seconds
  useEffect(() => {
    if (showDropdown) {
      const interval = setInterval(() => {
        setCurrentDropdownPair(prev => (prev + 1) % 7); // 14 options / 2 = 7 pairs
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showDropdown]);

  const allDropdownOptions = [
    "Validating a subscription idea: I want to create a monthly home-workout subscription priced at $10. I already have a library of recorded sessions and a small online following. My goal is to see if people are willing to pay for structured access and community support. Show me possible pathways to test this before I scale further.",
    "Adding a second revenue stream: We run a small café and want to add a second source of income by supplying ready-to-go snack boxes to local offices. Our daily footfall is steady but margins are thin, so we want to test if catering for professionals could open up new growth. Give me simulations of how this could unfold.",
    "Launching an online course: I want to turn my knowledge of business writing into a short online course for young professionals. I have presentation material ready and some contacts through LinkedIn. My aim is to package this into a paid product and test whether people will register. Show me ways I can approach this in stages.",
    "Growing community engagement: I manage an online community around mindful living and yoga, but engagement is low. We post tips and articles but participation is limited. I want to experiment with new formats like live sessions, challenges or short videos. Help me explore how to test these and see what resonates most.",
    "Building a B2B pilot: We are a team of five specialising in software, design, content, sales and finance, and we want to pilot our SaaS tool for small businesses in new markets. At the moment, we have freelancers using it individually. The next step is testing partnerships with co-working spaces or agencies. Show me ways this could be tested quickly.",
    "Refining pricing: I want to put a fair price on my mindfulness app, which is currently free. Options include a flat monthly fee, a freemium model or charging per session. I want to understand which model users are most open to without losing engagement. Help me simulate different approaches and test them.",
    "Expanding into a new market: My coffee brand has loyal customers in Melbourne and I want to try selling in Sydney. I don't have a full distribution setup yet, just one part-time salesperson and shipping from my base. I want to explore how I can test this new market in lightweight ways before committing fully.",
    "Experimenting with content formats: I run a podcast that has grown steadily with long-form interviews, but I am not sure if that's the best format to grow faster. I am considering shorter clips, newsletters or live Q&As. I want to explore different content styles and test which one has the strongest pull for new listeners.",
    "Testing a corporate pilot: My brother wants to start an ed-tech programme that teaches coding to teenagers. He already has some material and teachers available. The question is whether schools will be open to a structured pilot programme. Show us ways this can be approached with a few schools and tested quickly.",
    "Expanding to a new city: We want to explore whether our artisanal chocolate brand, currently popular in Chicago, could gain traction in New York. We have limited distribution capacity and a modest marketing budget. Show us ways to test this move step by step before scaling operations.",
    "Trying a social commerce idea: We want to create a peer-to-peer marketplace for sharing creative work and selling digital products. We already have a group of 300 people connected online. The next step is to see if people will actually buy from one another when offered the chance. Help us simulate how this could be tested in stages.",
    "Exploring a tech hub: We are considering introducing our productivity app to startup teams in San Francisco. Right now, only freelancers use it. Show us how we can test adoption in small startup circles before expanding more broadly.",
    "Testing a book concept: I want to explore whether my idea for a practical guide on creative problem-solving has genuine appeal. I have drafted a few sample chapters and a table of contents. Show me pathways to test early interest, refine the positioning and move toward a pilot launch.",
    "Launching a food concept: I want to test whether a plant-based food truck could work in Portland. I have a few signature recipes and enough savings to buy second-hand equipment. My aim is to see if locals respond well to the concept before I invest further."
  ];

  // Get current pair of dropdown options
  const getCurrentDropdownOptions = () => {
    const startIndex = currentDropdownPair * 2;
    const options = allDropdownOptions.slice(startIndex, startIndex + 2);
    // If we don't have 2 options (at the end), just return what we have
    return options.length === 0 ? [allDropdownOptions[0]] : options;
  };

  const playbackData: PlaybackData[] = [
    {
      title: "Seed Playbook",
      subtitle: "Surface early signals with minimal effort",
      beats: [
        "Define your core assumption",
        "Identify your target audience",
        "Create a minimal test scenario",
        "Set up measurement criteria",
        "Launch your first signal test",
        "Collect initial feedback",
        "Analyze early patterns",
        "Document key learnings"
      ]
    },
    {
      title: "Grow Playbook", 
      subtitle: "Refine your idea through small trials",
      beats: [
        "Build on validated assumptions",
        "Design controlled experiments",
        "Expand your test audience",
        "Refine your value proposition",
        "Test different variations",
        "Gather deeper insights",
        "Iterate on your approach",
        "Prepare for scale validation"
      ]
    },
    {
      title: "Scale Playbook",
      subtitle: "Expand impact across new audiences",
      beats: [
        "Validate scalability factors",
        "Design expansion framework",
        "Test in new market segments",
        "Build sustainable processes",
        "Measure impact metrics",
        "Optimize for growth",
        "Document success patterns",
        "Plan next phase rollout"
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
    setShowPlayback(true);
  };

  const handleDropdownSelect = (option: string) => {
    setSearchValue(option);
    setShowDropdown(false);
  };

  const handleSearchFocus = () => {
    if (!showPlayback && !showSprint) {
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

  const handleLaunchSprint = (playbackIndex: number) => {
    setSelectedPlaybackType(playbackIndex);
    const playbook = playbackData[playbackIndex];
    setSprintTitle(`${playbook.title} Sprint`);
    setSprintDescription(`A focused experiment based on your ${playbook.title.toLowerCase()} approach. This sprint will help you test key assumptions and gather actionable insights to move your idea forward with confidence.`);
    setShowSprint(true);
  };

  const handleSprintSearch = (message: string) => {
    // Handle sprint search
    console.log('Sprint search:', message);
  };

  const resetModal = () => {
    setSearchValue("");
    setShowDropdown(false);
    setShowPlayback(false);
    setShowSprint(false);
    setIsLoading(false);
    setCurrentDropdownPair(0);
    setSelectedPlaybackType(0);
    setSprintTitle("");
    setSprintDescription("");
  };

  const goBackToSearch = () => {
    if (showSprint) {
      setShowSprint(false);
    } else if (showPlayback) {
      setShowPlayback(false);
    }
  };

  const goBackToPlayback = () => {
    setShowSprint(false);
  };

  useEffect(() => {
    if (!open) {
      resetModal();
    }
  }, [open]);

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
          {/* First Page - Search Interface */}
          {!showPlayback && !showSprint && (
            <>
              {/* Header Section */}
              <div className="flex-shrink-0 text-center pt-16 pb-6 px-8 relative">
                <div className="flex items-center justify-center mb-8">
                  <Zap className="h-12 w-12 text-mergenta-violet" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-mergenta-deep-violet mb-3">
                  Proto Run
                </h1>
                <p className="text-base md:text-lg text-mergenta-dark-grey max-w-4xl mx-auto leading-relaxed">
                  See it. Run it. Test it. Evolve it.
                </p>
              </div>

              {/* Search Section */}
              <div className="flex-shrink-0 px-8 mb-8 mt-16">
                <div className="max-w-3xl mx-auto relative" ref={searchRef}>
                  <ChatInput 
                    onSendMessage={handleSearchSubmit} 
                    isLoading={isLoading}
                    initialValue={searchValue}
                    onFocus={handleSearchFocus}
                    placeholder="Describe your idea or concept to prototype..."
                  />

                  {/* Watermarked Dropdown Menu with rotating options */}
                  {showDropdown && (
                    <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-md rounded-xl shadow-elegant border border-white/20 z-40 overflow-hidden">
                      <div className="p-2">
                        <div className="flex items-center justify-between px-4 py-3 text-sm text-mergenta-dark-grey/60 border-b border-gray-100">
                          <span className="font-medium opacity-70">Proto Run Ideas</span>
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        </div>
                        {getCurrentDropdownOptions().map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleDropdownSelect(option)}
                            className="w-full text-left px-4 py-3 text-sm text-mergenta-dark-grey/80 hover:bg-pastel-lavender/50 hover:text-mergenta-violet transition-colors rounded-lg mx-1 my-1 animate-in fade-in-50 opacity-90 hover:opacity-100"
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

              {/* Loading State */}
              {isLoading && (
                <div className="flex-1 flex items-center justify-center px-8 pb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto animate-pulse">
                      <Zap className="h-8 w-8 text-mergenta-violet" />
                    </div>
                    <p className="text-lg text-mergenta-dark-grey">
                      Generating your proto run playbook...
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Second Page - Playback Selection */}
          {showPlayback && !showSprint && (
            <>
              {/* Header Section */}
              <div className="flex-shrink-0 px-8 pt-8 pb-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={goBackToSearch}
                    className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
                  >
                    <ArrowLeft className="h-5 w-5 text-mergenta-dark-grey" />
                  </button>
                  <div className="flex items-center justify-center">
                    <Zap className="h-8 w-8 text-mergenta-violet" />
                  </div>
                  <div className="w-9 h-9"></div>
                </div>
                <div className="text-center mt-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-mergenta-deep-violet mb-3">
                    Playback
                  </h1>
                  <p className="text-base text-mergenta-dark-grey max-w-4xl mx-auto leading-relaxed">
                    A Playback is a flow of beats that lets you rehearse your idea step by step. Each path leads to a Sprint, where imagination moves into action.
                  </p>
                </div>
              </div>

              {/* Playback Tiles */}
              <div className="flex-1 px-8 pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20 max-w-6xl mx-auto">
                  {playbackData.map((playback, idx) => (
                    <div
                      key={idx}
                      className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 animate-in slide-in-from-bottom-4 flex flex-col min-h-[500px] relative"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-mergenta-deep-violet mb-2">
                          {idx + 1}. {playback.title}
                        </h3>
                        <p className="text-sm text-mergenta-dark-grey/80">
                          {playback.subtitle}
                        </p>
                      </div>
                      
                      <div className="flex-1 mb-4">
                        <ul className="space-y-2">
                          {playback.beats.map((beat, beatIdx) => (
                            <li
                              key={beatIdx}
                              className="flex items-start text-sm text-mergenta-dark-grey"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-mergenta-violet mt-1.5 mr-2 flex-shrink-0" />
                              <span>{beat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        onClick={() => handleLaunchSprint(idx)}
                        className="w-full bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet mt-auto"
                      >
                        Launch Sprint
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-12">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Copy playback beats logic
                      const allBeats = playbackData.map(p => 
                        `**${p.title}** - ${p.subtitle}\n${p.beats.map(b => `• ${b}`).join('\n')}`
                      ).join('\n\n');
                      navigator.clipboard.writeText(allBeats);
                    }}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Copy Playback Beats
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetModal}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Start Again
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Third Page - Sprint Interface */}
          {showSprint && (
            <>
              {/* Header Section */}
              <div className="flex-shrink-0 px-8 pt-8 pb-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={goBackToPlayback}
                    className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
                  >
                    <ArrowLeft className="h-5 w-5 text-mergenta-dark-grey" />
                  </button>
                  <div className="flex items-center justify-center">
                    <Zap className="h-8 w-8 text-mergenta-violet" />
                  </div>
                  <div className="w-9 h-9"></div>
                </div>
                <div className="text-center mt-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-mergenta-deep-violet mb-3">
                    Run Your Sprint
                  </h1>
                  <p className="text-base text-mergenta-dark-grey max-w-4xl mx-auto leading-relaxed">
                    A Sprint is a short, focused experiment you can run in a very limited span of time. It helps you test one key assumption with a clear, measurable outcome, turning ideas into action quickly.
                  </p>
                </div>
              </div>

              {/* Sprint Details Tile */}
              <div className="flex-shrink-0 px-8 mb-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
                    <h3 className="text-lg font-semibold text-mergenta-deep-violet mb-3">
                      {sprintTitle}
                    </h3>
                    <p className="text-sm text-mergenta-dark-grey leading-relaxed">
                      {sprintDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Section */}
              <div className="flex-shrink-0 px-8 mb-8">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-4">
                    <p className="text-center text-mergenta-dark-grey font-medium">
                      Customize your sprint or ask questions
                    </p>
                  </div>
                  <ChatInput 
                    onSendMessage={handleSprintSearch} 
                    placeholder="Refine your sprint or ask for specific guidance..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 px-8 pb-8">
                <div className="flex justify-center gap-12">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const sprintText = `**${sprintTitle}**\n\n${sprintDescription}`;
                      navigator.clipboard.writeText(sprintText);
                    }}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Copy My Sprint
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetModal}
                    className="bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
                  >
                    Start Again
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export { ProtoRunModal };