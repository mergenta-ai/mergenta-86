import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { MoreHorizontal, FileText, Pencil, Archive, Trash2, Loader2, Download } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserPlan } from '@/hooks/useUserPlan';

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
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameItemId, setRenameItemId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const { planType } = useUserPlan();
  
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
    } else if (action === 'rename') {
      const item = historyItems.find(i => i.id === itemId);
      if (item) {
        setNewTitle(item.preview);
        setRenameItemId(itemId);
        setRenameDialogOpen(true);
      }
    } else if (action === 'archive') {
      toast.info('Archive feature coming soon');
    } else if (action === 'export') {
      await handleExport(itemId);
    }
    
    setOpenDropdown(null);
  };

  const handleRename = async () => {
    if (!renameItemId || !newTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title: newTitle.trim() })
        .eq('id', renameItemId);

      if (error) throw error;

      toast.success('Conversation renamed');
      setRenameDialogOpen(false);
      setRenameItemId(null);
      setNewTitle('');
      loadHistory();
    } catch (error) {
      console.error('Error renaming conversation:', error);
      toast.error('Failed to rename conversation');
    }
  };

  const handleExport = async (conversationId: string) => {
    try {
      // Fetch all messages for the conversation
      const { data: messages, error } = await supabase
        .from('messages')
        .select('content, is_user, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!messages || messages.length === 0) {
        toast.error('No messages to export');
        return;
      }

      // Format messages as text
      let exportText = '';
      messages.forEach((msg) => {
        const sender = msg.is_user ? 'You' : 'Assistant';
        const timestamp = new Date(msg.created_at).toLocaleString();
        exportText += `[${timestamp}] ${sender}:\n${msg.content}\n\n`;
      });

      // Determine export format based on plan
      let format = 'txt';
      if (planType === 'pro' || planType === 'zip' || planType === 'ace' || planType === 'max') {
        // Pro and above can export to .docx via API
        format = 'docx';
      }

      if (format === 'txt') {
        // Export as TXT (available for all plans)
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-${conversationId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Exported as TXT');
      } else {
        // For paid plans, call the export edge function
        toast.info('Exporting to DOCX...');
        const { data: { session } } = await supabase.auth.getSession();
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const response = await fetch(`${supabaseUrl}/functions/v1/export-google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            conversationId,
            format: 'docx',
          }),
        });

        if (!response.ok) {
          throw new Error('Export failed');
        }

        const result = await response.json();
        toast.success('Exported as DOCX');
      }
    } catch (error) {
      console.error('Error exporting conversation:', error);
      toast.error('Failed to export conversation');
    }
  };

  const handleConversationClick = (itemId: string) => {
    if (onSelectConversation) {
      onSelectConversation(itemId);
      onClose(); // Close the panel after selection
    }
  };

  return (
    <>
      <div 
        className={`fixed left-20 top-0 h-full w-80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border z-30 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Chat History</h2>
        </div>
      
      <ScrollArea className="h-[calc(100%-140px)]">
        <div className="px-3 py-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-8 px-4 text-muted-foreground text-sm">
              No chat history yet. Start a conversation to see it here!
            </div>
          ) : (
            historyItems.map((item) => {
              const shortTitle = item.preview.split(' ').slice(0, 6).join(' ');
              
              return (
                <div
                  key={item.id}
                  className="group relative mb-1 rounded-md hover:bg-accent transition-all duration-200 cursor-pointer"
                  onClick={() => handleConversationClick(item.id)}
                >
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground flex-1 min-w-0 truncate">
                        {shortTitle}
                      </span>
                    </div>
                    
                    <Popover 
                      open={openDropdown === item.id} 
                      onOpenChange={(open) => {
                        setOpenDropdown(open ? item.id : null);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button 
                          className="h-8 w-8 flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 hover:text-gray-900 transition-all flex-shrink-0 ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-48 p-1 z-[9999] bg-popover border-border"
                        align="end"
                        side="bottom"
                        sideOffset={5}
                      >
                        <div className="space-y-0.5">
                          <button 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-sm hover:bg-accent text-foreground transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('export', item.id);
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Export
                          </button>
                          <button 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-sm hover:bg-accent text-foreground transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('rename', item.id);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            Rename
                          </button>
                          <button 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-sm hover:bg-accent text-foreground transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('archive', item.id);
                            }}
                          >
                            <Archive className="h-4 w-4" />
                            Archive
                          </button>
                          <div className="h-px bg-border my-0.5" />
                          <button 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-sm hover:bg-destructive/10 text-destructive transition-colors"
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
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background/95">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={loadHistory}
          size="sm"
        >
          Refresh History
        </Button>
      </div>
    </div>

    <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
          <DialogDescription>
            Enter a new title for this conversation
          </DialogDescription>
        </DialogHeader>
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Conversation title"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleRename();
            }
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
};

export default HistoryPanel;