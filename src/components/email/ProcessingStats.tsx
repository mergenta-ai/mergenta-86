import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Clock, Zap } from "lucide-react";

interface Stats {
  total_processed: number;
  total_ignored: number;
  total_failed: number;
  drafts_created: number;
  emails_sent: number;
  avg_processing_time_ms: number;
  total_tokens_used: number;
}

export function ProcessingStats() {
  const [todayStats, setTodayStats] = useState<Stats | null>(null);
  const [weekStats, setWeekStats] = useState<Stats | null>(null);
  const [monthStats, setMonthStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Today's stats
      const { data: todayData } = await supabase
        .from("email_processing_stats")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      setTodayStats(todayData);

      // Week stats (aggregate)
      const { data: weekData } = await supabase
        .from("email_processing_stats")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", weekAgo);

      if (weekData) {
        setWeekStats(aggregateStats(weekData));
      }

      // Month stats (aggregate)
      const { data: monthData } = await supabase
        .from("email_processing_stats")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", monthAgo);

      if (monthData) {
        setMonthStats(aggregateStats(monthData));
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const aggregateStats = (data: any[]): Stats => {
    return data.reduce(
      (acc, curr) => ({
        total_processed: acc.total_processed + (curr.total_processed || 0),
        total_ignored: acc.total_ignored + (curr.total_ignored || 0),
        total_failed: acc.total_failed + (curr.total_failed || 0),
        drafts_created: acc.drafts_created + (curr.drafts_created || 0),
        emails_sent: acc.emails_sent + (curr.emails_sent || 0),
        avg_processing_time_ms: Math.round(
          (acc.avg_processing_time_ms * (acc.total_processed || 1) + 
           curr.avg_processing_time_ms * (curr.total_processed || 1)) /
          ((acc.total_processed || 1) + (curr.total_processed || 1))
        ),
        total_tokens_used: acc.total_tokens_used + (curr.total_tokens_used || 0),
      }),
      {
        total_processed: 0,
        total_ignored: 0,
        total_failed: 0,
        drafts_created: 0,
        emails_sent: 0,
        avg_processing_time_ms: 0,
        total_tokens_used: 0,
      }
    );
  };

  const StatsDisplay = ({ stats }: { stats: Stats | null }) => {
    if (!stats) {
      return (
        <p className="text-center text-muted-foreground py-8">
          No data available for this period
        </p>
      );
    }

    const total = stats.total_processed + stats.total_ignored + stats.total_failed;
    const successRate = total > 0 
      ? Math.round((stats.total_processed / total) * 100) 
      : 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Processed
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.total_processed}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Ignored
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.total_ignored}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Failed
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.total_failed}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Success Rate
            </div>
            <p className="text-3xl font-bold">{successRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Response Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Drafts Created</span>
                <Badge variant="outline">{stats.drafts_created}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Emails Sent</span>
                <Badge variant="outline">{stats.emails_sent}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Avg Time
                </div>
                <Badge variant="outline">{stats.avg_processing_time_ms}ms</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  Tokens Used
                </div>
                <Badge variant="outline">{stats.total_tokens_used.toLocaleString()}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Statistics
        </CardTitle>
        <CardDescription>
          Email processing metrics and performance data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading statistics...</p>
        ) : (
          <Tabs defaultValue="today">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="mt-6">
              <StatsDisplay stats={todayStats} />
            </TabsContent>
            <TabsContent value="week" className="mt-6">
              <StatsDisplay stats={weekStats} />
            </TabsContent>
            <TabsContent value="month" className="mt-6">
              <StatsDisplay stats={monthStats} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
