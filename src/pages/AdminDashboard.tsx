import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Database, Globe, Zap, BarChart3, Settings, Mail, RefreshCw, Copy, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface RSSFeed {
  id: string;
  title: string;
  url: string;
  source_name: string;
  source_url: string;
  category: string;
  is_active: boolean;
  scraped_at: string;
}

interface VendorQuota {
  id: string;
  vendor_type: string;
  quota_type: string;
  used_count: number;
  limit_value: number;
  last_reset: string;
}

interface AdminSettings {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
}

interface TestLog {
  timestamp: string;
  level: "info" | "success" | "error" | "warning";
  message: string;
}

interface QueueEntry {
  id: string;
  email_address: string;
  history_id: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  error_message: string | null;
}

interface GmailConnection {
  id: string;
  gmail_email: string;
  connected_at: string;
  last_synced_at: string | null;
  history_id: string | null;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [rssFeeds, setRSSFeeds] = useState<RSSFeed[]>([]);
  const [vendorQuotas, setVendorQuotas] = useState<VendorQuota[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Gmail testing state
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [gmailConnections, setGmailConnections] = useState<GmailConnection[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [processLogs, setProcessLogs] = useState<TestLog[]>([]);
  const [pullStatus, setPullStatus] = useState<'idle' | 'pulling' | 'success' | 'error'>('idle');
  const [pullResults, setPullResults] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'gmail-test') {
      loadGmailTestData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (autoRefresh && activeTab === 'gmail-test') {
      const interval = setInterval(() => {
        loadQueueEntries();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load RSS feeds
      const { data: rssData, error: rssError } = await supabase
        .from('rss_feeds')
        .select('*')
        .order('scraped_at', { ascending: false });

      if (rssError) throw rssError;
      setRSSFeeds(rssData || []);

      // Load vendor quotas
      const { data: quotaData, error: quotaError } = await supabase
        .from('vendor_quotas')
        .select('*')
        .order('vendor_type', { ascending: true });

      if (quotaError) throw quotaError;
      setVendorQuotas(quotaData || []);

      // Load admin settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('admin_settings')
        .select('*')
        .order('setting_key', { ascending: true });

      if (settingsError) throw settingsError;
      setAdminSettings(settingsData || []);

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getVendorUsagePercent = (used: number, limit: number) => {
    return limit > 0 ? Math.round((used / limit) * 100) : 0;
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'text-destructive';
    if (percent >= 70) return 'text-orange-500';
    return 'text-green-500';
  };

  const loadGmailTestData = async () => {
    await Promise.all([loadQueueEntries(), loadGmailConnections()]);
  };

  const loadQueueEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('gmail_processing_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setQueueEntries(data || []);
    } catch (error: any) {
      console.error('Error loading queue entries:', error);
    }
  };

  const loadGmailConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('gmail_connections')
        .select('id, gmail_email, connected_at, last_synced_at, history_id')
        .order('connected_at', { ascending: false });

      if (error) throw error;
      setGmailConnections(data || []);
    } catch (error: any) {
      console.error('Error loading Gmail connections:', error);
    }
  };


  const runManualProcessing = async (queueId?: string) => {
    try {
      setProcessingStatus('processing');
      setProcessLogs([]);
      setAutoRefresh(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        setProcessingStatus('error');
        return;
      }

      const body = queueId ? { queue_id: queueId } : {};
      const response = await supabase.functions.invoke('gmail-process-manual', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body,
      });

      if (response.error) {
        throw response.error;
      }

      const { logs, success, processed, successful } = response.data;
      setProcessLogs(logs || []);

      if (success) {
        setProcessingStatus('success');
        toast.success(`Processing complete: ${successful}/${processed} successful`);
        await loadQueueEntries();
      } else {
        setProcessingStatus('error');
        toast.error('Processing failed - check logs for details');
      }

    } catch (error: any) {
      console.error('Error running manual processing:', error);
      setProcessingStatus('error');
      setProcessLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        level: 'error',
        message: error.message || 'Unknown error occurred'
      }]);
      toast.error('Processing failed');
    } finally {
      setTimeout(() => setAutoRefresh(false), 10000);
    }
  };

  const clearProcessLogs = () => {
    setProcessLogs([]);
    setProcessingStatus('idle');
  };

  const pullNewEmails = async () => {
    try {
      setPullStatus('pulling');
      setPullResults(null);

      const { data, error } = await supabase.functions.invoke('gmail-pull-manual', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.success) {
        setPullResults(data);
        setPullStatus('success');
        toast.success(`Successfully pulled ${data.messagesProcessed} new emails!`);
        await loadQueueEntries();
      } else {
        throw new Error(data.error || 'Failed to pull emails');
      }
    } catch (error: any) {
      console.error('Failed to pull emails:', error);
      setPullStatus('error');
      toast.error(error.message || 'Failed to pull emails');
    }
  };

  const getLogColor = (level: TestLog['level']) => {
    switch (level) {
      case 'info': return 'text-blue-600 dark:text-blue-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-orange-600 dark:text-orange-400';
    }
  };


  const categoryStats = rssFeeds.reduce((acc, feed) => {
    const category = feed.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your LLM routing system
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="rss" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            RSS Feeds
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="gmail-test" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Gmail Testing
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total RSS Feeds</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rssFeeds.length}</div>
                <p className="text-xs text-muted-foreground">
                  {rssFeeds.filter(f => f.is_active).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(categoryStats).length}</div>
                <p className="text-xs text-muted-foreground">
                  Unique categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Vendors</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vendorQuotas.length}</div>
                <p className="text-xs text-muted-foreground">
                  Configured vendors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Online</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>RSS Feed Categories</CardTitle>
                <CardDescription>Distribution of RSS feeds by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(categoryStats)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendor Usage</CardTitle>
                <CardDescription>Current quota usage by vendor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vendorQuotas.map((quota) => {
                    const percent = getVendorUsagePercent(quota.used_count, quota.limit_value);
                    return (
                      <div key={quota.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize">{quota.vendor_type}</span>
                          <span className={getUsageColor(percent)}>
                            {quota.used_count}/{quota.limit_value} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              percent >= 90 ? 'bg-destructive' : 
                              percent >= 70 ? 'bg-orange-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rss" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">RSS Feeds</h3>
              <p className="text-sm text-muted-foreground">
                {rssFeeds.length} total feeds, {rssFeeds.filter(f => f.is_active).length} active
              </p>
            </div>
            <Button onClick={loadDashboardData}>
              Refresh Data
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rssFeeds.slice(0, 50).map((feed) => (
                    <TableRow key={feed.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {feed.title}
                      </TableCell>
                      <TableCell>{feed.source_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{feed.category || 'Uncategorized'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={feed.is_active ? "default" : "secondary"}>
                          {feed.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(feed.scraped_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Vendor Quotas</h3>
              <p className="text-sm text-muted-foreground">
                Monitor API usage across all vendors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorQuotas.map((quota) => {
              const percent = getVendorUsagePercent(quota.used_count, quota.limit_value);
              return (
                <Card key={quota.id}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center justify-between">
                      {quota.vendor_type}
                      <Badge variant="outline">{quota.quota_type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold">
                        {quota.used_count} / {quota.limit_value}
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            percent >= 90 ? 'bg-destructive' : 
                            percent >= 70 ? 'bg-orange-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last reset: {new Date(quota.last_reset).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="gmail-test" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pull New Emails - Main Action */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Pull New Emails
                </CardTitle>
                <CardDescription>
                  Fetch new emails from Gmail, generate AI responses, and create drafts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={pullNewEmails}
                    disabled={pullStatus === 'pulling'}
                    variant="default"
                    size="lg"
                  >
                    {pullStatus === 'pulling' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Pull New Emails
                  </Button>
                  {pullStatus === 'success' && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Pull Complete
                    </Badge>
                  )}
                  {pullStatus === 'error' && (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      Failed
                    </Badge>
                  )}
                </div>
                {pullResults && (
                  <div className="bg-muted p-4 rounded-lg space-y-3 text-sm">
                    <div><strong>Messages Processed:</strong> {pullResults.messagesProcessed}</div>
                    <div><strong>New History ID:</strong> {pullResults.newHistoryId}</div>
                    {pullResults.results && pullResults.results.length > 0 && (
                      <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                        <strong>Processed Messages:</strong>
                        {pullResults.results.map((result: any, idx: number) => (
                          <div key={idx} className="p-2 bg-background rounded border">
                            <div><strong>From:</strong> {result.from}</div>
                            <div><strong>Subject:</strong> {result.subject}</div>
                            <div><strong>Action:</strong> <Badge variant="outline">{result.action}</Badge></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gmail Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gmail Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gmailConnections.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No Gmail connections found
                    </p>
                  ) : (
                    gmailConnections.slice(0, 5).map((conn) => (
                      <div key={conn.id} className="text-sm space-y-1 pb-3 border-b last:border-0">
                        <div className="font-medium truncate">{conn.gmail_email}</div>
                        <div className="text-xs text-muted-foreground">
                          Connected: {new Date(conn.connected_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

          {/* Processing Queue Monitor */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Processing Queue Monitor</CardTitle>
                  <div className="flex items-center gap-2">
                    {autoRefresh && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Auto-refresh
                      </Badge>
                    )}
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => runManualProcessing()}
                      disabled={processingStatus === 'processing'}
                    >
                      {processingStatus === 'processing' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Process Pending
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={loadQueueEntries}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>History ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Processed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queueEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No queue entries found
                        </TableCell>
                      </TableRow>
                    ) : (
                      queueEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.email_address}</TableCell>
                          <TableCell className="font-mono text-xs">{entry.history_id}</TableCell>
                          <TableCell>
                            <Badge variant={
                              entry.status === 'completed' ? 'default' :
                              entry.status === 'failed' ? 'destructive' :
                              entry.status === 'processing' ? 'secondary' :
                              'outline'
                            }>
                              {entry.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {entry.processed_at ? new Date(entry.processed_at).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell>
                            {entry.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => runManualProcessing(entry.id)}
                                disabled={processingStatus === 'processing'}
                              >
                                <Zap className="h-3 w-3" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Processing Logs Console */}
            {processLogs.length > 0 && (
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Processing Logs</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const logsText = processLogs.map(log => 
                            `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.level.toUpperCase()}: ${log.message}`
                          ).join('\n');
                          navigator.clipboard.writeText(logsText);
                          toast.success('Logs copied to clipboard');
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearProcessLogs}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border bg-muted/50 p-4">
                    <div className="space-y-1 font-mono text-xs">
                      {processLogs.map((log, idx) => (
                        <div key={idx} className={getLogColor(log.level)}>
                          <span className="text-muted-foreground">
                            [{new Date(log.timestamp).toLocaleTimeString()}]
                          </span>{' '}
                          <span className="font-bold">{log.level.toUpperCase()}:</span> {log.message}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">System Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configuration and system parameters
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Setting Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminSettings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell className="font-mono">{setting.setting_key}</TableCell>
                      <TableCell className="max-w-xs">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {typeof setting.setting_value === 'object' 
                            ? JSON.stringify(setting.setting_value).substring(0, 100) + '...'
                            : String(setting.setting_value)
                          }
                        </code>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {setting.description || 'No description'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;