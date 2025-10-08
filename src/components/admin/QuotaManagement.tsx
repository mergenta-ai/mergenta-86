import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuotaConfig {
  id: string;
  vendor_type: string;
  model_name: string;
  quota_type: string;
  limit_value: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface VendorQuota {
  id: string;
  vendor_type: string;
  model_name: string | null;
  quota_type: string;
  used_count: number;
  limit_value: number;
  last_reset: string;
}

export const QuotaManagement = () => {
  const { toast } = useToast();
  const [quotaConfigs, setQuotaConfigs] = useState<QuotaConfig[]>([]);
  const [vendorQuotas, setVendorQuotas] = useState<VendorQuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    vendor_type: 'openai' | 'anthropic' | 'google' | 'mistral' | 'xai';
    model_name: string;
    quota_type: 'daily' | 'monthly' | 'per_card' | 'per_vendor';
    limit_value: number;
    is_active: boolean;
    notes: string;
  }>({
    vendor_type: 'openai',
    model_name: '',
    quota_type: 'daily',
    limit_value: 0,
    is_active: true,
    notes: ''
  });

  const vendorOptions = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'google', label: 'Google' },
    { value: 'mistral', label: 'Mistral' },
    { value: 'xai', label: 'XAI' }
  ];

  const modelsByVendor: Record<string, string[]> = {
    openai: ['gpt-5-nano', 'gpt-5-mini', 'gpt-5', 'o3-pro', 'o4-mini'],
    anthropic: ['claude-sonnet-4', 'claude-opus-4.1'],
    google: ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-pro'],
    mistral: ['mistral-large', 'mistral-medium'],
    xai: ['grok-2', 'grok-3']
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [configsResult, quotasResult] = await Promise.all([
        supabase.from('admin_quota_config').select('*').order('vendor_type', { ascending: true }),
        supabase.from('vendor_quotas').select('*').order('vendor_type', { ascending: true })
      ]);

      if (configsResult.error) throw configsResult.error;
      if (quotasResult.error) throw quotasResult.error;

      setQuotaConfigs(configsResult.data || []);
      setVendorQuotas(quotasResult.data || []);
    } catch (error) {
      console.error('Error fetching quota data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load quota configurations'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const { error } = await supabase
          .from('admin_quota_config')
          .update(formData)
          .eq('id', editing);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Quota configuration updated' });
      } else {
        const { error } = await supabase
          .from('admin_quota_config')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Quota configuration created' });
      }

      setEditing(null);
      setFormData({
        vendor_type: 'openai',
        model_name: '',
        quota_type: 'daily',
        limit_value: 0,
        is_active: true,
        notes: ''
      });
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save quota configuration'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_quota_config')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Success', description: 'Quota configuration deleted' });
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete quota configuration'
      });
    }
  };

  const handleEdit = (config: QuotaConfig) => {
    setEditing(config.id);
    setFormData({
      vendor_type: config.vendor_type as 'openai' | 'anthropic' | 'google' | 'mistral' | 'xai',
      model_name: config.model_name,
      quota_type: config.quota_type as 'daily' | 'monthly' | 'per_card' | 'per_vendor',
      limit_value: config.limit_value,
      is_active: config.is_active,
      notes: config.notes || ''
    });
  };

  const syncToVendorQuotas = async () => {
    try {
      const { error } = await supabase.functions.invoke('sync-quota-configs');
      
      if (error) throw error;
      toast({ title: 'Success', description: 'Quotas synced to vendor_quotas table' });
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to sync quotas'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Quota Configuration</CardTitle>
          <CardDescription>
            Manage daily quotas for each AI model. Quotas are tracked per model, not per vendor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Select
                value={formData.vendor_type}
                onValueChange={(value) => setFormData({ ...formData, vendor_type: value as 'openai' | 'anthropic' | 'google' | 'mistral' | 'xai', model_name: '' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vendorOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select
                value={formData.model_name}
                onValueChange={(value) => setFormData({ ...formData, model_name: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelsByVendor[formData.vendor_type]?.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Daily Limit</Label>
              <Input
                type="number"
                value={formData.limit_value}
                onChange={(e) => setFormData({ ...formData, limit_value: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>
              {editing ? <><Pencil className="h-4 w-4 mr-2" /> Update</> : <><Plus className="h-4 w-4 mr-2" /> Add</>}
            </Button>
            {editing && (
              <Button variant="outline" onClick={() => {
                setEditing(null);
                setFormData({
                  vendor_type: 'openai',
                  model_name: '',
                  quota_type: 'daily',
                  limit_value: 0,
                  is_active: true,
                  notes: ''
                });
              }}>
                Cancel
              </Button>
            )}
            <Button variant="outline" onClick={syncToVendorQuotas} className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-2" /> Sync to Vendor Quotas
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Quota Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {quotaConfigs.map((config) => (
              <div
                key={config.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{config.vendor_type}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-sm">{config.model_name}</span>
                    {config.is_active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Daily Limit: {config.limit_value.toLocaleString()}
                    {config.notes && ` • ${config.notes}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(config)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(config.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {quotaConfigs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No quota configurations yet. Add one above to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Usage (vendor_quotas table)</CardTitle>
          <CardDescription>Real-time quota usage tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {vendorQuotas.map((quota) => {
              const percentage = (quota.used_count / quota.limit_value) * 100;
              const isNearLimit = percentage > 80;
              
              return (
                <div key={quota.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{quota.vendor_type}</span>
                      {quota.model_name && (
                        <>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-sm">{quota.model_name}</span>
                        </>
                      )}
                    </div>
                    <Badge variant={isNearLimit ? 'destructive' : 'default'}>
                      {quota.used_count.toLocaleString()} / {quota.limit_value.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isNearLimit ? 'bg-destructive' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last reset: {new Date(quota.last_reset).toLocaleString()}
                  </div>
                </div>
              );
            })}
            {vendorQuotas.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No active quotas being tracked
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
