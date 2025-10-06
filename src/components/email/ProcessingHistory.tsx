import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProcessingLog {
  id: string;
  sender_email: string;
  sender_name?: string;
  subject?: string;
  processing_mode: string;
  action_taken: string;
  rule_applied_name?: string;
  ai_tokens_used: number;
  processing_time_ms: number;
  error_message?: string;
  created_at: string;
}

export function ProcessingHistory() {
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");

  useEffect(() => {
    fetchLogs();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('processing_logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'email_processing_log'
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("email_processing_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesFilter =
      filterAction === "all" || log.action_taken === filterAction;

    return matchesSearch && matchesFilter;
  });

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "replied_draft": return "default";
      case "replied_sent": return "default";
      case "ignored": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "replied_draft": return "Draft Created";
      case "replied_sent": return "Reply Sent";
      case "ignored": return "Ignored";
      case "failed": return "Failed";
      default: return action;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Processing History
        </CardTitle>
        <CardDescription>
          View recent email processing logs and results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by sender or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="replied_draft">Drafts</SelectItem>
                <SelectItem value="replied_sent">Sent</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading history...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm || filterAction !== "all" 
                ? "No logs match your filters" 
                : "No processing history yet"}
            </p>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {log.sender_name || log.sender_email}
                          </span>
                          <Badge variant={getActionBadgeVariant(log.action_taken)}>
                            {getActionLabel(log.action_taken)}
                          </Badge>
                          {log.rule_applied_name && (
                            <Badge variant="outline">
                              Rule: {log.rule_applied_name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.subject || "No subject"}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                          <span>•</span>
                          <span>{log.processing_time_ms}ms</span>
                          <span>•</span>
                          <span>{log.ai_tokens_used} tokens</span>
                          <span>•</span>
                          <span>{log.processing_mode.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    {log.error_message && (
                      <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                        Error: {log.error_message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
