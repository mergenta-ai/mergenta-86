import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import ChatInput from "@/components/ChatInput";
import WorkflowTabs from "@/components/WorkflowTabs";
import MergentaSidebar from "@/components/MergentaSidebar";
import MobileNavigation from "@/components/MobileNavigation";
import TouchFriendlyWorkflowTabs from "@/components/TouchFriendlyWorkflowTabs";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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

  const handleAddToChat = (message: string, response: string) => {
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: simulateAIResponse(message),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
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

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Desktop Sidebar */}
      <MergentaSidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-20 ml-0 flex flex-col h-screen">
        {/* Logo (top-left) - Hidden on mobile - Only show when no messages */}
        {messages.length === 0 && (
          <div className="p-6 lg:block md:hidden sm:hidden flex-shrink-0">
            <img 
              src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png" 
              alt="Mergenta Logo" 
              className="h-10 w-auto"
            />
          </div>
        )}

        {/* Header section - Only show when no messages */}
        {messages.length === 0 && (
          <div className="flex-shrink-0">
            <Header />
          </div>
        )}

        {/* Workflow tabs - Desktop - Only show when no messages */}
        {messages.length === 0 && !isMobile && (
          <div className="flex-shrink-0">
            <WorkflowTabs onAddToChat={handleAddToChat} onPromptGenerated={handlePromptGenerated} />
          </div>
        )}

        {/* Chat messages - Takes remaining space when messages exist */}
        {messages.length > 0 && (
          <main className="flex-1 flex flex-col overflow-hidden min-h-0">
            <ChatInterface messages={messages} isLoading={isLoading} />
          </main>
        )}

        {/* ChatInput container - Centered when no messages, fixed at bottom when messages exist */}
        {messages.length === 0 ? (
          /* Centered ChatInput for empty state */
          <div className="flex-1 flex items-center justify-center pb-20">
            <div className="w-full max-w-3xl px-4">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                initialValue={generatedPrompt}
              />
            </div>
          </div>
        ) : (
          /* Fixed ChatInput at bottom for chat state */
          <div className="flex-shrink-0 pb-4 px-4">
            <div className="max-w-4xl mx-auto">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                initialValue={generatedPrompt}
              />
              {/* Disclaimer - Only show when messages exist */}
              <div className="text-center mt-3 mb-2">
                <p className="text-xs text-muted-foreground">
                  AI can make mistakes. Check important info.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Touch-Friendly Workflow Tabs - Mobile - Only show when no messages */}
      {messages.length === 0 && isMobile && <TouchFriendlyWorkflowTabs onAddToChat={handleAddToChat} onPromptGenerated={handlePromptGenerated} />}
    </div>
  );
};

export default Index;