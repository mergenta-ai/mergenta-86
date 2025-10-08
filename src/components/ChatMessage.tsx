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
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 text-left",
          isUser 
            ? "bg-blue-100 text-blue-900 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800/30" 
            : "bg-white border border-gray-100"
        )}>
          <div className="text-base prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                // Main Title - H1
                h1: ({ children }) => (
                  <h1 className="text-lg font-semibold mb-3" style={{ color: '#000000' }}>
                    {children}
                  </h1>
                ),
                
                // Section Headings - H2
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold mb-3" style={{ color: '#000000' }}>
                    {children}
                  </h2>
                ),
                
                // Sub-headings - H3
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#000000' }}>
                    {children}
                  </h3>
                ),
                
                // Paragraphs - body text styling
                p: ({ children }) => {
                  const content = String(children);
                  // Check if it's a summary line
                  if (content.toLowerCase().includes('in summary:')) {
                    return (
                      <p className="mt-3 leading-relaxed font-medium italic text-base" style={{ color: '#000000' }}>
                        {children}
                      </p>
                    );
                  }
                  // Regular body text
                  return (
                    <p className="mb-2 last:mb-0 leading-relaxed font-normal text-base" style={{ color: '#333333' }}>
                      {children}
                    </p>
                  );
                },
                
                // Bold text - outer bullet titles
                strong: ({ children }) => (
                  <strong className="font-medium leading-relaxed" style={{ color: '#222222' }}>
                    {children}
                  </strong>
                ),
                
                // Unordered lists - outer bullets
                ul: ({ children, node }) => {
                  // Check if this is a nested list (has parent li)
                  const isNested = node?.position?.start.column && node.position.start.column > 1;
                  return (
                    <ul 
                      className={`my-2 space-y-2 list-disc ${isNested ? 'ml-8' : 'ml-4'}`}
                      style={{ color: isNested ? '#333333' : '#222222' }}
                    >
                      {children}
                    </ul>
                  );
                },
                
                // Ordered lists
                ol: ({ children, node }) => {
                  const isNested = node?.position?.start.column && node.position.start.column > 1;
                  return (
                    <ol 
                      className={`my-2 space-y-2 list-decimal ${isNested ? 'ml-8' : 'ml-4'}`}
                      style={{ color: isNested ? '#333333' : '#222222' }}
                    >
                      {children}
                    </ol>
                  );
                },
                
                // List items
                li: ({ children, node }) => {
                  // Check if this li contains a nested list
                  const hasNestedList = node?.children?.some(
                    (child: any) => child.type === 'list'
                  );
                  
                  return (
                    <li 
                      className={`mb-2 leading-relaxed text-base ${hasNestedList ? 'font-medium' : 'font-normal'}`}
                      style={{ color: hasNestedList ? '#222222' : '#333333' }}
                    >
                      {children}
                    </li>
                  );
                },
                
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