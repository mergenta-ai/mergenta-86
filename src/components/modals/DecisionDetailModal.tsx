import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Search, RotateCcw } from "lucide-react";
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

interface DecisionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardType: string;
  onSearch: (query: string) => void;
}

const detailedContent: Record<string, { title: string; subtitle: string; details: string[] }> = {
  'options-matrix': {
    title: 'Options Matrix',
    subtitle: 'Compare choices across key factors',
    details: [
      'Start by listing all viable options in the first column of your matrix. Don\'t limit yourself initially - include even seemingly unlikely choices to ensure comprehensive coverage.',
      'Identify 5-7 key criteria that matter most for this decision. These might include cost, time, risk level, alignment with goals, impact on others, or long-term consequences.',
      'Create a scoring system (1-10 or 1-5) and rate each option against each criterion. Be as objective as possible, using data where available rather than gut feelings.',
      'Assign importance weights to each criterion based on your priorities. Not all factors are equally important - some may be deal-breakers while others are nice-to-haves.',
      'Calculate weighted scores by multiplying each rating by its criterion weight, then sum for total scores. The highest-scoring option provides a data-driven starting point for your decision.'
    ]
  },
  'trade-off-analysis': {
    title: 'Trade-off Analysis',
    subtitle: 'See gains versus hidden costs',
    details: [
      'For each option, create a comprehensive list of what you gain. Include immediate benefits, long-term advantages, skill development, relationship impacts, and personal satisfaction.',
      'Document what you sacrifice or give up with each choice. Consider financial costs, time investment, missed opportunities, relationship strain, and personal stress or discomfort.',
      'Examine opportunity costs - what other valuable options become unavailable if you choose this path? Sometimes the cost isn\'t money but other possibilities you close off.',
      'Distinguish between short-term and long-term trade-offs. Some options require significant upfront sacrifice for long-term gain, while others offer immediate gratification but future costs.',
      'Evaluate whether the trade-offs align with your core values and life priorities. A technically optimal choice may feel wrong if it conflicts with what matters most to you.'
    ]
  },
  'bias-detective': {
    title: 'Bias Detective',
    subtitle: 'Spot assumptions and blind spots',
    details: [
      'Examine your immediate emotional response to each option. Our gut reactions, while valuable, can be influenced by recent experiences, mood, or irrelevant factors that shouldn\'t drive major decisions.',
      'Notice if you\'re seeking information that supports your preferred choice while avoiding or dismissing contradictory evidence. This confirmation bias can lead to poor decisions based on incomplete analysis.',
      'List assumptions you\'re making about outcomes, other people\'s reactions, or future circumstances. Test these assumptions by asking "What if this assumption is wrong?" or "What evidence supports this belief?"',
      'Actively seek out perspectives from people who might disagree with your initial thinking. Ask trusted advisors to play devil\'s advocate or find someone who chose differently in a similar situation.',
      'Use structured questioning to challenge your reasoning: "What would I advise a friend in this situation?" "What would I think about this in 10 years?" "What am I afraid of, and is that fear rational?"'
    ]
  },
  'risk-compass': {
    title: 'Risk Compass',
    subtitle: 'Map risks by impact and chance',
    details: [
      'Brainstorm potential risks for each option, including financial losses, relationship damage, career setbacks, health impacts, reputation issues, and missed opportunities.',
      'Estimate the probability of each risk occurring using percentages or categories (low/medium/high). Base estimates on historical data, expert opinions, or similar situations when possible.',
      'Assess the potential impact if each risk materializes. Consider both immediate consequences and long-term effects on your goals, relationships, and well-being.',
      'Create contingency plans for high-impact risks, especially those with moderate to high probability. Having backup plans reduces anxiety and improves your ability to handle setbacks.',
      'Honestly evaluate your risk tolerance. Some people thrive with uncertainty while others need security. Choose options that match your comfort level rather than forcing yourself into unsuitable risk profiles.'
    ]
  },
  'decision-journal': {
    title: 'Decision Journal',
    subtitle: 'Record reasoning for future clarity',
    details: [
      'Document your complete thought process, including the options considered, criteria used, information sources consulted, and key insights that influenced your thinking.',
      'Record the specific information and assumptions you used to make the decision. Include relevant data, expert opinions, personal experiences, and advice from others.',
      'Write down your predictions about outcomes, timelines, and potential challenges. Be specific about what you expect to happen and when, so you can later evaluate accuracy.',
      'Set specific review dates (3 months, 1 year, etc.) to evaluate how the decision played out. Regular reviews help you learn from both successful and unsuccessful choices.',
      'Analyze patterns in your decision-making over time. Look for recurring biases, areas where your predictions are consistently off, and decision-making approaches that work well for you.'
    ]
  },
  'prioritisation-ladder': {
    title: 'Prioritisation Ladder',
    subtitle: 'Rank what matters most first',
    details: [
      'List all factors that could influence this decision, including practical considerations (cost, time, convenience) and personal values (autonomy, security, growth, relationships).',
      'Rank these factors from most to least important using pairwise comparisons. For each pair, ask "If I could only optimize for one of these, which would I choose?"',
      'Assign numerical weights to reflect the relative importance of different priority levels. Your top priority might be worth 10 points, while lower priorities get 3-5 points.',
      'Ensure your highest priorities receive proportional attention in your analysis. Don\'t let minor considerations overshadow major ones just because they\'re easier to quantify.',
      'Use your priority ranking to break ties between similar options. When choices seem equally good, let your clearly defined priorities guide the final decision.'
    ]
  }
};

export const DecisionDetailModal = ({ 
  open, 
  onOpenChange, 
  cardType, 
  onSearch 
}: DecisionDetailModalProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const content = detailedContent[cardType];

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

  if (!content) return null;

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
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
        >
          <X className="h-5 w-5 text-mergenta-dark-grey" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-12 pb-8">
          <h1 className="text-4xl font-bold text-mergenta-dark-grey mb-4">{content.title}</h1>
          <p className="text-lg text-mergenta-dark-grey/80 max-w-2xl text-center">
            {content.subtitle}
          </p>
        </div>

        {/* Content area */}
        <div className="flex-1 px-12 pb-12 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mergenta-dark-grey/60 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for specific guidance..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 rounded-xl h-12 text-mergenta-dark-grey placeholder:text-mergenta-dark-grey/60"
                />
              </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-6">
              {content.details.map((detail, index) => (
                <div 
                  key={index}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-mergenta-dark-grey leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Search Again Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSearch}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium py-2 px-6 rounded-xl"
              >
                <RotateCcw className="h-4 w-4" />
                Search Again
              </Button>
            </div>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};