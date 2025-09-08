import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { MoreHorizontal } from 'lucide-react';

interface HistoryItem {
  id: string;
  preview: string;
  timestamp: string;
  createdOn: string;
  lastModified: string;
}

interface HistoryPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isVisible, onClose }) => {
  // Mock data - replace with actual chat history
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      preview: 'How to create a React component with TypeScript?',
      timestamp: '2 hours ago',
      createdOn: '06/01/25',
      lastModified: '06/01/25'
    },
    {
      id: '2',
      preview: 'Explain the benefits of using Tailwind CSS for modern web development',
      timestamp: '1 day ago',
      createdOn: '05/01/25',
      lastModified: '05/01/25'
    },
    {
      id: '3',
      preview: 'Best practices for state management in React applications',
      timestamp: '3 days ago',
      createdOn: '03/01/25',
      lastModified: '04/01/25'
    },
    {
      id: '4',
      preview: 'How to implement authentication in a web app',
      timestamp: '1 week ago',
      createdOn: '30/12/24',
      lastModified: '30/12/24'
    },
    {
      id: '5',
      preview: 'Database design principles and normalization techniques',
      timestamp: '2 weeks ago',
      createdOn: '23/12/24',
      lastModified: '25/12/24'
    },
    {
      id: '6',
      preview: 'Advanced CSS Grid layouts and responsive design patterns',
      timestamp: '2 weeks ago',
      createdOn: '22/12/24',
      lastModified: '22/12/24'
    },
    {
      id: '7',
      preview: 'JavaScript async/await vs promises performance comparison',
      timestamp: '3 weeks ago',
      createdOn: '16/12/24',
      lastModified: '18/12/24'
    },
    {
      id: '8',
      preview: 'API design best practices for RESTful services',
      timestamp: '3 weeks ago',
      createdOn: '15/12/24',
      lastModified: '15/12/24'
    },
    {
      id: '9',
      preview: 'Modern deployment strategies with Docker and Kubernetes',
      timestamp: '1 month ago',
      createdOn: '06/12/24',
      lastModified: '08/12/24'
    },
    {
      id: '10',
      preview: 'Security considerations for web applications',
      timestamp: '1 month ago',
      createdOn: '05/12/24',
      lastModified: '05/12/24'
    },
    {
      id: '11',
      preview: 'Progressive Web Apps implementation guide',
      timestamp: '1 month ago',
      createdOn: '03/12/24',
      lastModified: '04/12/24'
    },
    {
      id: '12',
      preview: 'GraphQL vs REST API comparison and use cases',
      timestamp: '2 months ago',
      createdOn: '06/11/24',
      lastModified: '07/11/24'
    },
  ];

  return (
    <div 
      className={`fixed left-20 top-0 h-full w-80 bg-gradient-to-b from-purple-50 to-purple-100 border-r border-purple-200 z-30 transform transition-transform duration-300 ease-in-out shadow-lg ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-purple-200">
        <h2 className="text-lg font-semibold text-purple-800 text-center">Chat History</h2>
      </div>
      
      <ScrollArea className="h-[calc(100%-140px)] pr-3">
        <TooltipProvider>
          <div className="p-3">
            {historyItems.map((item) => {
              const shortTitle = item.preview.split(' ').slice(0, 4).join(' ');
              
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full h-auto px-3 py-2 mb-1 justify-between text-left hover:bg-pastel-lavender-hover/50 transition-colors group"
                    >
                      <span className="text-sm text-sidebar-text-dark text-left flex-1 min-w-0">
                        {shortTitle}
                      </span>
                      <MoreHorizontal className="h-3 w-3 text-sidebar-text-violet ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white border border-gray-200 shadow-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-900">{item.preview}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </ScrollArea>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-200 bg-gradient-to-b from-purple-50 to-purple-100">
        <Button 
          variant="outline" 
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-200"
          onClick={() => console.log('View all chats')}
        >
          View all chats
        </Button>
      </div>
    </div>
  );
};

export default HistoryPanel;