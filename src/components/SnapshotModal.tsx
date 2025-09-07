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

  const handleGenerateSnapshot = async () => {
    if (!query.trim()) return;
    
    setIsGenerating(true);
    setShowTiles(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSnapshot = generateMockSnapshot(query);
    setSnapshot(newSnapshot);
    setIsGenerating(false);
    
    // Trigger staggered animation
    setTimeout(() => setShowTiles(true), 100);
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
  };

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSnapshot(null);
      setShowTiles(false);
      setShowSuggestions(false);
    }
  }, [open]);

  const tileData = snapshot ? [
    {
      title: "Facts & Insights",
      subtitle: "What's true and relevant in the background.",
      items: snapshot.facts,
      bgColor: "bg-[#E6DAFB]"
    },
    {
      title: "Opportunities", 
      subtitle: "Where the openings and upsides may be.",
      items: snapshot.opportunities,
      bgColor: "bg-[#FDECF5]"
    },
    {
      title: "Challenges",
      subtitle: "What hurdles and risks stand in the way.", 
      items: snapshot.challenges,
      bgColor: "bg-[#E6DAFB]"
    },
    {
      title: "Next Moves",
      subtitle: "Practical steps to take things forward.",
      items: snapshot.nextMoves,
      bgColor: "bg-[#FDECF5]"
    }
  ] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-6 pb-4">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">360° Snapshot</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
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
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 pt-0">
          {/* Input Section */}
          <div className="mb-8">
            <div className="relative">
              <Textarea
                placeholder="Enter your question or situation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={() => setShowSuggestions(true)}
                className="min-h-[120px] text-base"
                onFocus={() => setShowSuggestions(true)}
              />
              
              {showSuggestions && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSuggestions(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                    <div className="p-3 border-b">
                      <h4 className="text-sm font-medium text-foreground">Sample queries:</h4>
                    </div>
                    {sampleQueries.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border/50 last:border-0"
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
              disabled={!query.trim() || isGenerating}
              className="w-full mt-4 bg-[#6C3EB6] hover:bg-[#5B34A0] text-white"
              size="lg"
            >
              {isGenerating ? "Generating Snapshot..." : "Generate Snapshot"}
            </Button>
          </div>

          {/* Output Section */}
          {snapshot && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tileData.map((tile, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl shadow-sm transition-all duration-500 ${tile.bgColor} ${
                      showTiles 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{
                      animationDelay: showTiles ? `${idx * 200}ms` : '0ms'
                    }}
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {tile.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tile.subtitle}
                    </p>
                    <ul className="space-y-2">
                      {tile.items.map((item: string, itemIdx: number) => (
                        <li key={itemIdx} className="text-sm text-foreground flex items-start">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={copyAllSnapshot}
                  className="bg-[#6C3EB6] hover:bg-[#5B34A0] text-white"
                >
                  Copy All Snapshot
                </Button>
                <Button
                  onClick={startAgain}
                  variant="outline"
                >
                  Start Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}