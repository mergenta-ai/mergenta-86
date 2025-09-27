import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  // optional style prop so parent can pass dynamic paddingBottom (e.g. input height + 12px)
  style?: React.CSSProperties;
}

const ChatInterface = ({ messages, isLoading, style }: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If parent passed a style with paddingBottom, use it; otherwise keep your existing classes/paddings
  const usesDynamicPadding = !!(style && (style.paddingBottom !== undefined));
  const paddingClasses = usesDynamicPadding ? "" : "pb-[120px] md:pb-[100px]";

  return (
    <div className="flex flex-col h-full" role="log" aria-live="polite">
      {/* Chat Messages */}
      <div
        className={`flex-1 overflow-y-auto px-4 md:px-6 ${paddingClasses}`}
        style={{
          ...(style || {}),
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="max-w-4xl mx-auto py-6">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              {/* Empty state - clean and minimal */}
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))
          )}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className="mt-4">
              <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
