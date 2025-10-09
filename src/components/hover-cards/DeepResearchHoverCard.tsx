import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";

interface DeepResearchHoverCardProps {
  children: React.ReactNode;
  onPromptGenerated?: (prompt: string) => void;
}

const DeepResearchHoverCard = ({ children, onPromptGenerated }: DeepResearchHoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { draftData, saveDraft, clearDraft } = useDraftPersistence({ 
    cardId: 'deep_research',
    initialData: { researchTopic: '', researchScope: '', keyQuestions: '' }
  });

  const researchTopic = (draftData.researchTopic as string) || '';
  const researchScope = (draftData.researchScope as string) || '';
  const keyQuestions = (draftData.keyQuestions as string) || '';

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
        await clearDraft();
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
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-blue-700">Deep Research</h3>
              <p className="text-sm text-gray-600">Comprehensive research with multiple sources and citations</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-gray-200"
              onClick={clearDraft}
              title="Clear draft"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="researchTopic" className="text-sm font-medium text-gray-700">
                Research Topic *
              </Label>
              <Input
                id="researchTopic"
                value={researchTopic}
                onChange={(e) => saveDraft('researchTopic', e.target.value)}
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
                onChange={(e) => saveDraft('researchScope', e.target.value)}
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
                onChange={(e) => saveDraft('keyQuestions', e.target.value)}
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
