import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-elegant transition-all duration-300",
        isUser 
          ? "bg-gradient-primary text-primary-foreground ml-4" 
          : "bg-message-ai text-foreground mr-4 border border-border"
      )}>
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        <span className={cn(
          "text-xs mt-2 block opacity-70",
          isUser ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;