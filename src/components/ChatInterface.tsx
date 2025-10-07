import { useRef, useEffect, useState } from "react";
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
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const thinkingMessages = [
    "Mergenta is thinking…",
    "Analysing your query thoughtfully…",
    "Generating insights — just a moment…",
    "Connecting ideas to craft the best response…",
    "Exploring the most relevant information…",
    "Evaluating context for an accurate answer…",
    "Piecing together key insights…",
    "Thinking through your question carefully…",
    "Synthesising knowledge across sources…",
    "Reflecting before responding…",
    "Gathering precise details for clarity…",
    "Composing your answer elegantly…",
    "Understanding intent before replying…",
    "Refining the response to ensure precision…"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      setCurrentMessageIndex(0);
      setFade(true);
      return;
    }

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % thinkingMessages.length);
        setFade(true);
      }, 300);
    }, 1500);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6">
      <div className={`max-w-3xl mx-auto py-6 ${messages.length > 0 ? "pb-40" : ""}`}>
          {messages.length === 0 ? (
            <div className="text-center py-8">{/* Empty state - clean and minimal */}</div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                  sources={message.sources}
                />
              ))}
              
              {/* Loading Indicator - appears instantly when processing */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                  <div className="relative w-16 h-16 mb-4">
                    <img 
                      src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png"
                      alt="Mergenta thinking"
                      className="w-full h-full object-contain animate-spin"
                      style={{ animationDuration: '2s' }}
                    />
                  </div>
                  <p 
                    className="text-sm text-muted-foreground transition-opacity duration-300"
                    style={{ opacity: fade ? 1 : 0 }}
                  >
                    {thinkingMessages[currentMessageIndex]}
                  </p>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
    </div>
  );
};

export default ChatInterface;
