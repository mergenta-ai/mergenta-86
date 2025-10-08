import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

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
          <div className="text-sm md:text-base leading-loose prose prose-sm dark:prose-invert max-w-none prose-p:mb-4 prose-li:mb-2">
            <ReactMarkdown
              components={{
                // Paragraphs with generous spacing
                p: ({ children }) => (
                  <p className="mb-4 last:mb-0 leading-loose">{children}</p>
                ),
                
                // Bold headings with emphasis
                strong: ({ children }) => (
                  <strong className="font-bold text-blue-900 dark:text-blue-200 text-base">
                    {children}
                  </strong>
                ),
                
                // Unordered lists with proper spacing
                ul: ({ children }) => (
                  <ul className="my-4 ml-6 space-y-2 list-disc marker:text-blue-600 dark:marker:text-blue-400">
                    {children}
                  </ul>
                ),
                
                // Ordered lists with proper spacing
                ol: ({ children }) => (
                  <ol className="my-4 ml-6 space-y-2 list-decimal marker:text-blue-600 dark:marker:text-blue-400 marker:font-semibold">
                    {children}
                  </ol>
                ),
                
                // List items with breathing room
                li: ({ children }) => (
                  <li className="mb-2 pl-2 leading-loose">{children}</li>
                ),
                
                // Headings (## format)
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold mt-6 mb-3 text-blue-900 dark:text-blue-200">
                    {children}
                  </h2>
                ),
                
                h3: ({ children }) => (
                  <h3 className="text-base font-bold mt-4 mb-2 text-blue-800 dark:text-blue-300">
                    {children}
                  </h3>
                ),
                
                // Code blocks
                code: ({ node, inline, children, ...props }: any) => (
                  inline ? (
                    <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className="block p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm font-mono overflow-x-auto my-3">
                      {children}
                    </code>
                  )
                ),
                
                // Blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300">
                    {children}
                  </blockquote>
                ),
                
                // Horizontal rules
                hr: () => (
                  <hr className="my-6 border-t-2 border-gray-200 dark:border-gray-700" />
                ),
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        
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