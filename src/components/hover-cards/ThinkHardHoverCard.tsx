import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface ThinkHardHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const ThinkHardHoverCard = ({ children, onPromptGenerated }: ThinkHardHoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [specificQuestions, setSpecificQuestions] = useState("");

  const handleGeneratePrompt = async () => {
    const formData = {
      topic,
      context,
      specificQuestions
    };

    const { data, error } = await supabase.functions.invoke('prompt-engine-consolidated', {
      body: { contentType: 'think_hard', formData }
    });

    if (error) {
      console.error('Error generating prompt:', error);
      return;
    }

    if (data?.prompt && onPromptGenerated) {
      onPromptGenerated(data.prompt);
      setIsOpen(false);
      // Reset form
      setTopic("");
      setContext("");
      setSpecificQuestions("");
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
            <h3 className="font-semibold text-lg text-purple-700">Think Hard</h3>
            <p className="text-sm text-gray-600">Deep analytical reasoning with research-backed insights</p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                Topic or Question *
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to think deeply about?"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="context" className="text-sm font-medium text-gray-700">
                Context (Optional)
              </Label>
              <Textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Provide background information..."
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="questions" className="text-sm font-medium text-gray-700">
                Specific Questions (Optional)
              </Label>
              <Textarea
                id="questions"
                value={specificQuestions}
                onChange={(e) => setSpecificQuestions(e.target.value)}
                placeholder="Any specific aspects to explore?"
                className="mt-1 min-h-[60px]"
              />
            </div>
          </div>

          <Button
            onClick={handleGeneratePrompt}
            disabled={!topic.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Generate Analysis
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ThinkHardHoverCard;
