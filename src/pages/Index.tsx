import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import ChatInput from "@/components/ChatInput";
import WorkflowTabs from "@/components/WorkflowTabs";
import MergentaSidebar from "@/components/MergentaSidebar";
import MobileNavigation from "@/components/MobileNavigation";
import ModelDisplay from "@/components/ModelDisplay";

import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { chatService } from "@/services/chatService";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Array<{
    id: string;
    type: 'google' | 'rss';
    title: string;
    url: string;
    snippet: string;
  }>;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Default");
  const [turnCount, setTurnCount] = useState(0);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handlePromptGenerated = (prompt: string) => {
    setGeneratedPrompt(prompt);
    // Reset model to Default when workflow cards are used
    setSelectedModel("Default");
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create or get conversation
      let conversationId = currentConversationId;
      if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            title: message.slice(0, 50),
            workflow_type: 'workflow'
          })
          .select()
          .single();

        if (convError) {
          console.error('Error creating conversation:', convError);
          throw convError;
        }
        conversationId = newConv.id;
        setCurrentConversationId(conversationId);
      }

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

      // Save to database
      await supabase.from('messages').insert([
        {
          conversation_id: conversationId,
          user_id: user.id,
          content: message,
          is_user: true
        },
        {
          conversation_id: conversationId,
          user_id: user.id,
          content: response,
          is_user: false
        }
      ]);

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      setMessages(prev => [...prev, userMessage, aiMessage]);
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to chat.",
          variant: "destructive",
        });
        return;
      }

      // Create or get conversation
      let conversationId = currentConversationId;
      if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            title: message.slice(0, 50),
            workflow_type: null
          })
          .select()
          .single();

        if (convError) {
          console.error('Error creating conversation:', convError);
          throw convError;
        }
        conversationId = newConv.id;
        setCurrentConversationId(conversationId);
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      };

      // Save user message to database
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        user_id: user.id,
        content: message,
        is_user: true
      });

      setMessages(prev => [...prev, userMessage]);
      setTurnCount(prev => prev + 1);
      setIsLoading(true);
      setGeneratedPrompt(""); // Clear the prompt after sending

      console.log('Sending message:', message);
      
      // Use the new chat service with LLM routing
      const modelToUse = selectedModel !== "Default" ? selectedModel : undefined;
      const isFollowUp = messages.length > 0;
      const response = await chatService.handleDirectMessage(message, modelToUse, isFollowUp);
      
      console.log('Chat response received:', response);
      
      if (response.error) {
        console.error('Chat service error:', response.error, response.message);
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
        sources: response.sources, // Include sources with snippets
      };

      // Save AI response to database
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        user_id: user.id,
        content: response.response,
        is_user: false,
        metadata: response.sources ? { sources: response.sources } : null
      });

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      setMessages(prev => [...prev, aiResponse]);
      
      // Show quota info and sources info
      if (response.quotaRemaining !== undefined) {
        console.log(`Quota remaining: ${response.quotaRemaining}`);
      }
      
      if (response.sources && response.sources.length > 0) {
        console.log(`Found ${response.sources.length} sources with snippets`);
      }
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
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
    <div className="min-h-screen flex">
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Desktop Sidebar */}
      <MergentaSidebar />
      
      {/* Model Display - Fixed Top Right Corner */}
      <div className="fixed top-4 right-4 z-50 lg:right-6">
        <ModelDisplay 
          selectedModel={selectedModel}
          onClick={() => {
            // Optional: Could trigger model dropdown when clicked
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-20 ml-0 flex flex-col relative">
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

            {/* Input bar */}
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              initialValue={generatedPrompt}
              lastResponse={messages[messages.length - 1]?.isUser === false ? messages[messages.length - 1]?.text : undefined}
              onModelSelect={handleModelSelect}
            />

            {/* Workflow tabs - All devices */}
            <WorkflowTabs onAddToChat={handleAddToChat} onPromptGenerated={handlePromptGenerated} />

            {/* Chat messages */}
            <main className="flex-1 flex flex-col">
              <ChatInterface messages={messages} isLoading={isLoading} turnCount={turnCount} />
            </main>
          </>
        ) : (
          <>
            {/* Chat State - Messages Exist */}
            {/* Chat messages take full space */}
            <main className="flex-1 flex flex-col">
              <ChatInterface messages={messages} isLoading={isLoading} turnCount={turnCount} />
            </main>

            {/* Fixed bottom search bar */}
            <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 shadow-lg">
              <div className="w-full max-w-3xl">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  isLoading={isLoading} 
                  initialValue={generatedPrompt}
                  lastResponse={messages[messages.length - 1]?.isUser === false ? messages[messages.length - 1]?.text : undefined}
                  onModelSelect={handleModelSelect}
                />
                {/* Disclaimer */}
                <p className="text-center text-sm text-muted-foreground mt-2">
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