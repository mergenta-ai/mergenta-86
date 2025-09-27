import React, { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import ChatInput from "@/components/ChatInput";
import WorkflowTabs from "@/components/WorkflowTabs";
import MergentaSidebar from "@/components/MergentaSidebar";
import MobileNavigation from "@/components/MobileNavigation";

import { useToast } from "@/hooks/use-toast";
import { useIsMobile, useIsDesktop } from "@/hooks/use-mobile";
import { chatService } from "@/services/chatService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  // Height of ChatInput's textarea (px). Used to set bottom padding so last message is visible.
  const [chatInputHeight, setChatInputHeight] = useState<number>(0);

  const handlePromptGenerated = (prompt: string) => {
    setGeneratedPrompt(prompt);
  };

  const simulateAIResponse = (userMessage: string): string => {
    const responses = [
      "I understand your question about " + userMessage.toLowerCase() + ". Let me help you with that.",
      "That's an interesting point. Based on what you've asked, I can provide some insights.",
      "Thank you for your question. Here's what I think about " + userMessage.toLowerCase() + ".",
      "I appreciate you reaching out. Let me share some thoughts on this topic.",
      "Great question! I'd be happy to help you explore this further."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleAddToChat = async (message: string, response: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setGeneratedPrompt("");

    try {
      const response = await chatService.handleDirectMessage(message);

      if (response.error) {
        toast({
          title: "Error",
          description: response.message || "Failed to get response. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);

      if (response.quotaRemaining !== undefined) {
        console.log(`Quota remaining: ${response.quotaRemaining}`);
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Layout notes:
   * - We preserve original conditional placement of ChatInput visually.
   * - There is only one ChatInput instance in the DOM, but it is positioned to match the original UI.
   * - The chat area receives padding-bottom = chatInputHeight + 12 to keep last message visible.
   */

  return (
    <div className="min-h-screen w-full">
      {!isDesktop && <MobileNavigation />}

      {isDesktop && <MergentaSidebar />}

      <div
        className={`min-h-screen flex flex-col relative transition-all duration-300 ${
          isDesktop ? "ml-20" : "ml-0"
        }`}
      >
        {/* Shared header & workflow area */}
        {messages.length === 0 ? (
          <>
            <div className="p-6 lg:block md:hidden sm:hidden">
              <img
                src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png"
                alt="Mergenta Logo"
                className="h-26 w-auto md:h-34 lg:h-44 invisible"
              />
            </div>

            <Header />

            {/* Here the ChatInput visually appears in-flow (same look as before on Mac15") */}
            <div className="w-full">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                initialValue={generatedPrompt}
                lastResponse={messages[messages.length - 1]?.isUser === false ? messages[messages.length - 1]?.text : undefined}
                onHeightChange={(h) => setChatInputHeight(h)}
              />
            </div>

            <WorkflowTabs onAddToChat={handleAddToChat} onPromptGenerated={handlePromptGenerated} />

            <main className="flex-1 flex flex-col">
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                // ensure the chat area always has room for the input (last message visible)
                style={{ paddingBottom: `${chatInputHeight + 12}px` } as React.CSSProperties}
              />
            </main>
          </>
        ) : (
          <>
            <main className="flex-1 flex flex-col">
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                style={{ paddingBottom: `${chatInputHeight + 12}px` } as React.CSSProperties}
              />
            </main>

            {/* When messages exist, the ChatInput is visually fixed — same appearance as before */}
            <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
              <div className="w-full max-w-3xl">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  initialValue={generatedPrompt}
                  lastResponse={messages[messages.length - 1]?.isUser === false ? messages[messages.length - 1]?.text : undefined}
                  onHeightChange={(h) => setChatInputHeight(h)}
                />
                <p className="text-center text-sm text-gray-500 mt-2">
                  Mergenta can make mistakes. Verify information.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
