import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SnapshotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sampleQueries = [
  "Should I launch a podcast?",
  "Is it the right time to switch careers?",
  "How do I expand my café to another city?",
  "Should I look for a co-founder for my startup?",
  "What if I move abroad for work?"
];

const generateMockSnapshot = (query: string) => {
  return {
    facts: [
      "Market research shows 80% of podcasts don't make it past episode 10",
      "Audio content consumption has grown 20% year-over-year",
      "Starting costs are relatively low ($200-500 for basic equipment)",
      "Audience building typically takes 6-12 months of consistent effort"
    ],
    opportunities: [
      "Growing demand for niche expertise and storytelling",
      "Multiple monetization paths: sponsorships, courses, consulting",
      "Platform algorithms favor consistent, quality content",
      "Networking and authority-building potential in your field"
    ],
    challenges: [
      "High competition with over 2 million active podcasts",
      "Consistent content creation requires significant time investment",
      "Audio editing and production skills needed",
      "Building an audience from zero requires patience and strategy"
    ],
    nextMoves: [
      "Define your unique angle and target audience clearly",
      "Create 3-5 pilot episodes to test format and content",
      "Invest in basic but quality recording equipment",
      "Develop a content calendar for your first 20 episodes"
    ]
  };
};

export function SnapshotModal({ open, onOpenChange }: SnapshotModalProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [snapshot, setSnapshot] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTiles, setShowTiles] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateSnapshot = async () => {
    if (!query.trim() || query.trim().length < 4) return;
    
    setIsGenerating(true);
    setShowTiles(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSnapshot = generateMockSnapshot(query);
    setSnapshot(newSnapshot);
    setIsGenerating(false);
    setHasGenerated(true);
    
    // Trigger staggered animation
    setTimeout(() => setShowTiles(true), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && query.trim().length >= 4 && !isGenerating) {
      e.preventDefault();
      handleGenerateSnapshot();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const copyAllSnapshot = () => {
    if (!snapshot) return;
    
    const content = `360° Snapshot for: "${query}"

FACTS & INSIGHTS:
${snapshot.facts.map((fact: string) => `• ${fact}`).join('\n')}

OPPORTUNITIES:
${snapshot.opportunities.map((opp: string) => `• ${opp}`).join('\n')}

CHALLENGES:
${snapshot.challenges.map((challenge: string) => `• ${challenge}`).join('\n')}

NEXT MOVES:
${snapshot.nextMoves.map((move: string) => `• ${move}`).join('\n')}`;
    
    navigator.clipboard.writeText(content);
  };

  const startAgain = () => {
    setQuery("");
    setSnapshot(null);
    setShowTiles(false);
    setHasGenerated(false);
  };

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSnapshot(null);
      setShowTiles(false);
      setShowSuggestions(false);
      setHasGenerated(false);
    }
  }, [open]);

  const tileData = snapshot ? [
    {
      title: "Facts & Insights",
      subtitle: "What's true and relevant in the background.",
      items: snapshot.facts,
      bgColor: "bg-[#E6DAFB]",
      index: 0
    },
    {
      title: "Opportunities", 
      subtitle: "Where the openings and upsides may be.",
      items: snapshot.opportunities,
      bgColor: "bg-[#FDECF5]",
      index: 1
    },
    {
      title: "Challenges",
      subtitle: "What hurdles and risks stand in the way.", 
      items: snapshot.challenges,
      bgColor: "bg-[#E6DAFB]",
      index: 2
    },
    {
      title: "Next Moves",
      subtitle: "Practical steps to take things forward.",
      items: snapshot.nextMoves,
      bgColor: "bg-[#FDECF5]",
      index: 3
    }
  ] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/55" onClick={() => onOpenChange(false)} />
        
        {/* Modal */}
        <div className="relative w-full max-w-[1100px] max-h-[82vh] bg-white rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-7 pb-5 z-10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#6C3EB6] mb-2">360° Snapshot</h2>
                <p className="text-sm text-[#4B3C72] max-w-2xl leading-relaxed">
                  360° Snapshot gives you a quick all-round view of your query — facts, opportunities, 
                  challenges, and next moves. The more you explain, the better is the response.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(82vh-140px)] p-7 pt-5">
            {/* Initial Input Section (only show if not generated yet) */}
            {!hasGenerated && (
              <div className="mb-8">
                <div className="relative">
                  <Textarea
                    placeholder="Enter your question or situation..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClick={() => setShowSuggestions(true)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[120px] text-base border-[#D8C7F9] placeholder:text-[#7E6DAE] focus-visible:ring-[#6C3EB6]"
                  />
                  
                  {showSuggestions && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowSuggestions(false)}
                      />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D8C7F9] rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                        <div className="p-3 border-b border-[#D8C7F9]">
                          <h4 className="text-sm font-medium text-[#6C3EB6]">Sample queries:</h4>
                        </div>
                        {sampleQueries.map((suggestion, idx) => (
                          <button
                            key={idx}
                            className="w-full text-left px-4 py-3 text-sm text-[#4B3C72] hover:bg-[#F8F6FF] transition-colors border-b border-[#D8C7F9]/50 last:border-0"
                            onClick={() => handleSuggestionSelect(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                <Button
                  onClick={handleGenerateSnapshot}
                  disabled={query.trim().length < 4 || isGenerating}
                  className="w-full mt-4 h-12 bg-[#6C3EB6] hover:bg-[#5B34A0] text-white rounded-[10px]"
                >
                  {isGenerating ? "Generating Snapshot..." : "Generate Snapshot"}
                </Button>
              </div>
            )}

            {/* Output Section */}
            {snapshot && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {tileData.map((tile, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition-all duration-[380ms] min-w-[240px] ${tile.bgColor} ${
                        showTiles 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-3'
                      }`}
                      style={{
                        animationDelay: showTiles ? `${tile.index * 180}ms` : '0ms',
                        transitionTimingFunction: 'cubic-bezier(0.2, 0.9, 0.3, 1)'
                      }}
                    >
                      <h3 className="text-lg font-bold text-[#6C3EB6] mb-2">
                        {tile.title}
                      </h3>
                      <p className="text-[13px] text-[#4B3C72] mb-4 leading-relaxed">
                        {tile.subtitle}
                      </p>
                      <ul className="space-y-2">
                        {tile.items.map((item: string, itemIdx: number) => (
                          <li key={itemIdx} className="text-sm text-[#333333] flex items-start leading-relaxed">
                            <span className="w-2 h-2 bg-[#6C3EB6] rounded-full mt-2 mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Follow-up Input Section (show after generation) */}
                {hasGenerated && (
                  <div className="mt-8 pt-6 border-t border-[#D8C7F9]">
                    <label className="block text-sm font-medium text-[#4B3C72] mb-3">
                      Ask a follow-up or enter a new query
                    </label>
                    <div className="relative">
                      <Textarea
                        placeholder="Enter your question or situation..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onClick={() => setShowSuggestions(true)}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[100px] text-base border-[#D8C7F9] placeholder:text-[#7E6DAE] focus-visible:ring-[#6C3EB6]"
                      />
                      
                      {showSuggestions && (
                        <>
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setShowSuggestions(false)}
                          />
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D8C7F9] rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                            <div className="p-3 border-b border-[#D8C7F9]">
                              <h4 className="text-sm font-medium text-[#6C3EB6]">Sample queries:</h4>
                            </div>
                            {sampleQueries.map((suggestion, idx) => (
                              <button
                                key={idx}
                                className="w-full text-left px-4 py-3 text-sm text-[#4B3C72] hover:bg-[#F8F6FF] transition-colors border-b border-[#D8C7F9]/50 last:border-0"
                                onClick={() => handleSuggestionSelect(suggestion)}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleGenerateSnapshot}
                      disabled={query.trim().length < 4 || isGenerating}
                      className="w-full mt-4 h-12 bg-[#6C3EB6] hover:bg-[#5B34A0] text-white rounded-[10px]"
                    >
                      {isGenerating ? "Generating Snapshot..." : "Generate Snapshot"}
                    </Button>
                  </div>
                )}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#D8C7F9]">
                  <Button
                    onClick={copyAllSnapshot}
                    className="bg-[#6C3EB6] hover:bg-[#5B34A0] text-white"
                  >
                    Copy All Snapshot
                  </Button>
                  <Button
                    onClick={startAgain}
                    variant="outline"
                    className="border-[#B79CF6] text-[#6C3EB6] hover:bg-[#F8F6FF]"
                  >
                    Start Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}