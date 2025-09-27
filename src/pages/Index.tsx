import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import ChatInputNew from "@/components/ChatInputNew";
import WorkflowTabs from "@/components/WorkflowTabs";
import AppLayout from "@/components/layout/AppLayout";

import { useToast } from "@/hooks/use-toast";
import { chatService } from "@/services/chatService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { toast } = useToast();

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
    // For workflow cards, we get a response directly, so just add both messages
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
    setGeneratedPrompt(""); // Clear the prompt after sending

    try {
      // Use the new chat service with LLM routing
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
      
      // Show quota info if provided
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

  const lastResponse = messages[messages.length - 1]?.isUser === false 
    ? messages[messages.length - 1]?.text 
    : undefined;

  return (
    <AppLayout>
      {messages.length === 0 ? (
        <>
          {/* Default State - No Messages */}
          {/* Logo (top-left) - Hidden on mobile */}
          <div className="p-6 lg:block md:hidden sm:hidden">
            <img 
              src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png" 
              alt="Mergenta Logo" 
              className="h-26 w-auto md:h-34 lg:h-44 invisible" 
            />
          </div>

          {/* Header section */}
          <Header />

          {/* Input bar - Single source of truth */}
          <ChatInputNew 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            initialValue={generatedPrompt}
            lastResponse={lastResponse}
          />

          {/* Workflow tabs - All devices */}
          <WorkflowTabs onAddToChat={handleAddToChat} onPromptGenerated={handlePromptGenerated} />

          {/* Chat messages */}
          <main className="flex-1 flex flex-col">
            <ChatInterface messages={messages} isLoading={isLoading} />
          </main>
        </>
      ) : (
        <>
          {/* Chat State - Messages Exist */}
          {/* Chat messages take full space */}
          <main className="flex-1 flex flex-col pb-32">
            <ChatInterface messages={messages} isLoading={isLoading} />
          </main>

          {/* Fixed bottom search bar */}
          <div className="fixed bottom-4 left-0 right-0 z-overlay flex justify-center px-4">
            <div className="w-full max-w-3xl">
              <ChatInputNew 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                initialValue={generatedPrompt}
                lastResponse={lastResponse}
              />
              {/* Disclaimer */}
              <p className="text-center text-sm text-text-secondary mt-2">
                Mergenta can make mistakes. Verify information.
              </p>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Index;