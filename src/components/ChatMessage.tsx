import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
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

const ChatMessage = ({ message, isUser, timestamp, sources }: ChatMessageProps) => {
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
        
        {/* Show sources if available */}
        {sources && sources.length > 0 && !isUser && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">Sources:</p>
            <div className="space-y-2">
              {sources.slice(0, 3).map((source, index) => (
                <div key={source.id} className="text-xs">
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    {index + 1}. {source.title}
                  </a>
                  {source.snippet && (
                    <p className="text-muted-foreground mt-1 line-clamp-2">
                      {source.snippet}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
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