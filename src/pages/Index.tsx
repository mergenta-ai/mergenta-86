import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import ChatInput from "@/components/ChatInput";
import WorkflowTabs from "@/components/WorkflowTabs";
import MergentaSidebar from "@/components/MergentaSidebar";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

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
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5FF] via-[#FFF0F8] to-white flex">
      {/* Sidebar */}
      <MergentaSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-20 flex flex-col">
        {/* Logo (top-left) */}
        <div className="p-6">
          <img 
            src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png" 
            alt="Mergenta Logo" 
            className="h-26 w-auto md:h-34 lg:h-44" 
          />
        </div>

        {/* Header section */}
        <Header />

        {/* Input bar */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

        {/* Workflow tabs */}
        <WorkflowTabs />

        {/* Chat messages */}
        <main className="flex-1 flex flex-col">
          <ChatInterface messages={messages} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default Index;