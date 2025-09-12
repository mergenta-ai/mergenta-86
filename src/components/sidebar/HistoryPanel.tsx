import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { MoreHorizontal, Edit, Share, Archive, Trash2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const handleAction = (action: string, itemId: string) => {
    console.log(`Clicked ${action} for item:`, itemId);
    setOpenDropdown(null);
  };
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
        <div className="px-2 py-1">
          {historyItems.map((item) => {
            const shortTitle = item.preview.split(' ').slice(0, 4).join(' ');
            
            return (
              <div
                key={item.id}
                className="group relative mx-1 mb-0.5 rounded-lg hover:bg-purple-200/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-sm text-sidebar-text-dark flex-1 min-w-0 truncate pr-2">
                    {shortTitle}
                  </span>
                  
                  <Popover 
                    open={openDropdown === item.id} 
                    onOpenChange={(open) => {
                      console.log('Popover open change:', open, item.id);
                      setOpenDropdown(open ? item.id : null);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button 
                        className="h-6 w-6 flex items-center justify-center rounded hover:bg-purple-300/50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Button clicked for item:', item.id);
                          setOpenDropdown(openDropdown === item.id ? null : item.id);
                        }}
                      >
                        <MoreHorizontal className="h-3.5 w-3.5 text-sidebar-text-violet" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-40 p-1 z-[9999]" 
                      align="end"
                      side="right"
                      sideOffset={5}
                    >
                      <div className="space-y-1">
                        <button 
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          onClick={() => handleAction('rename', item.id)}
                        >
                          <Edit className="h-4 w-4" />
                          Rename
                        </button>
                        <button 
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          onClick={() => handleAction('share', item.id)}
                        >
                          <Share className="h-4 w-4" />
                          Share
                        </button>
                        <button 
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          onClick={() => handleAction('archive', item.id)}
                        >
                          <Archive className="h-4 w-4" />
                          Archive
                        </button>
                        <button 
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded text-red-600 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          onClick={() => handleAction('delete', item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            );
          })}
        </div>
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