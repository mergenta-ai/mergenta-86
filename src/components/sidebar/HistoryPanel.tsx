import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { MoreHorizontal, Edit, Share, Archive, Trash2, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  onSelectConversation?: (conversationId: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isVisible, onClose, onSelectConversation }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isVisible) {
      loadHistory();
    }
  }, [isVisible]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user');
        setHistoryItems([]);
        return;
      }

      // Fetch conversations with their first message
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          workflow_type
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (convError) {
        console.error('Error loading conversations:', convError);
        throw convError;
      }

      if (!conversations || conversations.length === 0) {
        setHistoryItems([]);
        return;
      }

      // Get first message for each conversation
      const conversationsWithMessages = await Promise.all(
        conversations.map(async (conv) => {
          const { data: firstMessage } = await supabase
            .from('messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .eq('is_user', true)
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

          const preview = firstMessage?.content || conv.title || 'Untitled conversation';
          const createdDate = new Date(conv.created_at);
          const updatedDate = new Date(conv.updated_at);

          return {
            id: conv.id,
            preview: preview,
            timestamp: getRelativeTime(updatedDate),
            createdOn: createdDate.toLocaleDateString('en-GB'),
            lastModified: updatedDate.toLocaleDateString('en-GB')
          };
        })
      );

      setHistoryItems(conversationsWithMessages);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load chat history');
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  };
  
  const handleAction = async (action: string, itemId: string) => {
    console.log(`Clicked ${action} for item:`, itemId);
    
    if (action === 'delete') {
      try {
        const { error } = await supabase
          .from('conversations')
          .delete()
          .eq('id', itemId);

        if (error) throw error;

        toast.success('Conversation deleted');
        loadHistory();
      } catch (error) {
        console.error('Error deleting conversation:', error);
        toast.error('Failed to delete conversation');
      }
    }
    
    setOpenDropdown(null);
  };

  const handleConversationClick = (itemId: string) => {
    if (onSelectConversation) {
      onSelectConversation(itemId);
    }
  };

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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-8 px-4 text-muted-foreground text-sm">
              No chat history yet. Start a conversation to see it here!
            </div>
          ) : (
            historyItems.map((item) => {
              const shortTitle = item.preview.split(' ').slice(0, 4).join(' ');
              
              return (
                <div
                  key={item.id}
                  className="group relative mx-1 mb-1 rounded-lg hover:bg-purple-light/60 transition-colors duration-200 cursor-pointer"
                  style={{ height: 'var(--height-list-item)' }}
                  onClick={() => handleConversationClick(item.id)}
                >
                  <div className="flex items-center justify-between px-4 py-3 h-full">
                    <span className="text-sm text-foreground flex-1 min-w-0 truncate pr-2">
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
                          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Button clicked for item:', item.id);
                            setOpenDropdown(openDropdown === item.id ? null : item.id);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4 text-primary" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-40 p-1 z-[9999] bg-white" 
                        align="end"
                        side="bottom"
                        sideOffset={5}
                      >
                        <div className="space-y-1">
                          <button 
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 hover:text-red-600 cursor-pointer min-h-[44px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('delete', item.id);
                            }}
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
            })
          )}
        </div>
      </ScrollArea>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-200 bg-gradient-to-b from-purple-50 to-purple-100">
        <Button 
          variant="outline" 
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-200"
          onClick={loadHistory}
        >
          Refresh History
        </Button>
      </div>
    </div>
  );
};

export default HistoryPanel;