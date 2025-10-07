import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Array<{
    id: string;
    type: "google" | "rss";
    title: string;
    url: string;
    snippet: string;
  }>;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatInterface = ({ messages, isLoading }: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 min-h-0" style={{ paddingBottom: "120px" }}>
        <div className="max-w-3xl mx-auto py-6">
          {messages.length === 0 ? (
            <div className="text-center py-8">{/* Empty state - clean and minimal */}</div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                sources={message.sources}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
