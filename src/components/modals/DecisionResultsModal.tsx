import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Search, Copy, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Custom DialogContent without automatic close button
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

interface DecisionResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpandFurther: (cardType: string) => void;
  onSearch: (query: string) => void;
  onCopyAll: () => void;
  onStartAgain: () => void;
}

const decisionCards = [
  {
    id: 'options-matrix',
    title: 'Options Matrix',
    subtitle: 'Compare choices across key factors',
    bullets: [
      'List all available options and alternatives',
      'Identify the most important decision criteria',
      'Score each option against each criterion',
      'Weight criteria by importance to your goals',
      'Calculate total scores to reveal best choices'
    ]
  },
  {
    id: 'trade-off-analysis',
    title: 'Trade-off Analysis',
    subtitle: 'See gains versus hidden costs',
    bullets: [
      'Identify what you gain from each option',
      'Map out what you give up or sacrifice',
      'Consider opportunity costs and foregone benefits',
      'Evaluate short-term vs long-term trade-offs',
      'Assess if the trade-offs align with your values'
    ]
  },
  {
    id: 'bias-detective',
    title: 'Bias Detective',
    subtitle: 'Spot assumptions and blind spots',
    bullets: [
      'Question your initial gut reaction and preferences',
      'Look for confirmation bias in information gathering',
      'Challenge assumptions you\'re taking for granted',
      'Seek diverse perspectives and contrary opinions',
      'Test your reasoning with devil\'s advocate questions'
    ]
  },
  {
    id: 'risk-compass',
    title: 'Risk Compass',
    subtitle: 'Map risks by impact and chance',
    bullets: [
      'Identify potential risks for each option',
      'Assess probability of each risk occurring',
      'Evaluate potential impact if risks materialize',
      'Develop contingency plans for high-impact risks',
      'Consider your risk tolerance and comfort level'
    ]
  },
  {
    id: 'decision-journal',
    title: 'Decision Journal',
    subtitle: 'Record reasoning for future clarity',
    bullets: [
      'Document your thought process and reasoning',
      'Record the information you used to decide',
      'Note your predictions and expected outcomes',
      'Set review dates to evaluate decision results',
      'Learn from both successful and poor decisions'
    ]
  },
  {
    id: 'prioritisation-ladder',
    title: 'Prioritisation Ladder',
    subtitle: 'Rank what matters most first',
    bullets: [
      'Identify all factors important to this decision',
      'Rank factors from most to least important',
      'Assign relative weights to each priority level',
      'Ensure your top priorities get proper attention',
      'Use priorities to break ties between close options'
    ]
  }
];

export const DecisionResultsModal = ({ 
  open, 
  onOpenChange, 
  onExpandFurther, 
  onSearch, 
  onCopyAll, 
  onStartAgain 
}: DecisionResultsModalProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent 
        className="fixed inset-0 w-screen h-screen max-w-none max-h-none m-0 p-0 rounded-none border-none z-[100]"
        style={{ 
          backgroundColor: '#F3E1F3',
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          width: '100vw', 
          height: '100vh',
          transform: 'none'
        }}
      >
        {/* Navigation and Close buttons */}
        <button
          onClick={onStartAgain}
          className="absolute top-6 left-6 z-50 p-2 rounded-full bg-white hover:bg-white/80 transition-colors shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 text-black" />
        </button>
        
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
        >
          <X className="h-5 w-5 text-mergenta-dark-grey" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-12 pb-8">
          <h1 className="text-4xl font-bold text-mergenta-dark-grey mb-4">Decision Making Playbook</h1>
        </div>

        {/* Content area */}
        <div className="flex-1 px-12 pb-12 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decisionCards.map((card, index) => (
                <div 
                  key={card.id}
                  className="bg-[F3D1FA] text-mergenta-dark-grey rounded-2xl p-6 shadow-md transform transition-transform duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-mergenta-dark-grey mb-2">{card.title}</h3>
                      <p className="text-mergenta-dark-grey/70 text-sm">{card.subtitle}</p>
                    </div>
                    
                    <ul className="space-y-2">
                      {card.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-sm text-mergenta-dark-grey/80 flex items-start">
                          <span className="text-purple-600 mr-2 mt-1 flex-shrink-0">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => onExpandFurther(card.id)}
                      variant="outline"
                      className="w-full bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet font-medium py-2 rounded-lg transition-all duration-300"
                    >
                      Expand Further
                    </Button>
                  </div>
                </div>
              ))}
            </div>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button
                onClick={onCopyAll}
                variant="outline"
                className="flex items-center gap-2 bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
              >
                <Copy className="h-4 w-4" />
                Copy All Suggestions
              </Button>
              <Button
                onClick={onStartAgain}
                variant="outline"
                className="flex items-center gap-2 bg-mergenta-deep-violet/80 border-mergenta-deep-violet text-white hover:bg-mergenta-deep-violet"
              >
                <RotateCcw className="h-4 w-4" />
                Start Again
              </Button>
            </div>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};