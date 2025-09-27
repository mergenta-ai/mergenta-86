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
    <div className="w-full mb-4">
      <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
        <div className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200",
          isUser 
            ? "bg-blue-100 text-blue-900 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800/30" 
            : "bg-gray-50 text-gray-900 border border-gray-200 dark:bg-gray-900/50 dark:text-gray-100 dark:border-gray-800"
        )}>
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        
          {/* Show sources if available */}
          {sources && sources.length > 0 && !isUser && (
            <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Sources:</p>
              <div className="space-y-2">
                {sources.slice(0, 3).map((source, index) => (
                  <div key={source.id} className="text-xs">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium"
                    >
                      {index + 1}. {source.title}
                    </a>
                    {source.snippet && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
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
            isUser ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"
          )}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;