import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Database, Globe, Zap, BarChart3, Settings, ArrowLeft, Users } from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';

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

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [rssFeeds, setRSSFeeds] = useState<RSSFeed[]>([]);
  const [vendorQuotas, setVendorQuotas] = useState<VendorQuota[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage your LLM routing system
            </p>
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="rss" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            RSS Feeds
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Vendors
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

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
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