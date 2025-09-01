import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  preview: string;
  timestamp: string;
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
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      preview: 'Explain the benefits of using Tailwind CSS for modern web development',
      timestamp: '1 day ago'
    },
    {
      id: '3',
      preview: 'Best practices for state management in React applications',
      timestamp: '3 days ago'
    },
    {
      id: '4',
      preview: 'How to implement authentication in a web app',
      timestamp: '1 week ago'
    },
    {
      id: '5',
      preview: 'Database design principles and normalization techniques',
      timestamp: '2 weeks ago'
    },
    {
      id: '6',
      preview: 'Advanced CSS Grid layouts and responsive design patterns',
      timestamp: '2 weeks ago'
    },
    {
      id: '7',
      preview: 'JavaScript async/await vs promises performance comparison',
      timestamp: '3 weeks ago'
    },
    {
      id: '8',
      preview: 'API design best practices for RESTful services',
      timestamp: '3 weeks ago'
    },
    {
      id: '9',
      preview: 'Modern deployment strategies with Docker and Kubernetes',
      timestamp: '1 month ago'
    },
    {
      id: '10',
      preview: 'Security considerations for web applications',
      timestamp: '1 month ago'
    },
    {
      id: '11',
      preview: 'Progressive Web Apps implementation guide',
      timestamp: '1 month ago'
    },
    {
      id: '12',
      preview: 'GraphQL vs REST API comparison and use cases',
      timestamp: '2 months ago'
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
      
      <ScrollArea className="h-[calc(100%-140px)]">
        <div className="p-2">
          {historyItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full h-auto p-3 mb-2 justify-start text-left hover:bg-pastel-lavender-hover/50 transition-colors"
            >
              <div className="flex-1 min-w-0 text-center">
                <p className="text-sm text-sidebar-text-dark mb-1 break-words leading-relaxed">
                  {item.preview}
                </p>
                <p className="text-xs text-sidebar-text-violet">
                  {item.timestamp}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-sidebar-text-violet ml-2 flex-shrink-0" />
            </Button>
          ))}
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