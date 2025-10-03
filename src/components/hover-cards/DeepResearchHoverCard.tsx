import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface DeepResearchHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const DeepResearchHoverCard = ({ children, onPromptGenerated }: DeepResearchHoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [researchTopic, setResearchTopic] = useState("");
  const [researchScope, setResearchScope] = useState("");
  const [keyQuestions, setKeyQuestions] = useState("");

  const handleGeneratePrompt = async () => {
    const formData = {
      researchTopic,
      researchScope,
      keyQuestions
    };

    const { data, error } = await supabase.functions.invoke('prompt-engine-consolidated', {
      body: { contentType: 'deep_research', formData }
    });

    if (error) {
      console.error('Error generating prompt:', error);
      return;
    }

    if (data?.prompt && onPromptGenerated) {
      onPromptGenerated(data.prompt);
      setIsOpen(false);
      // Reset form
      setResearchTopic("");
      setResearchScope("");
      setKeyQuestions("");
    }
  };

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-96 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        side="left"
        align="start"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-blue-700">Deep Research</h3>
            <p className="text-sm text-gray-600">Comprehensive research with multiple sources and citations</p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="researchTopic" className="text-sm font-medium text-gray-700">
                Research Topic *
              </Label>
              <Input
                id="researchTopic"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                placeholder="What do you want to research?"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="researchScope" className="text-sm font-medium text-gray-700">
                Scope & Focus (Optional)
              </Label>
              <Textarea
                id="researchScope"
                value={researchScope}
                onChange={(e) => setResearchScope(e.target.value)}
                placeholder="Define the boundaries and focus areas..."
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="keyQuestions" className="text-sm font-medium text-gray-700">
                Key Research Questions (Optional)
              </Label>
              <Textarea
                id="keyQuestions"
                value={keyQuestions}
                onChange={(e) => setKeyQuestions(e.target.value)}
                placeholder="What specific questions should be answered?"
                className="mt-1 min-h-[60px]"
              />
            </div>
          </div>

          <Button
            onClick={handleGeneratePrompt}
            disabled={!researchTopic.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Research
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default DeepResearchHoverCard;
