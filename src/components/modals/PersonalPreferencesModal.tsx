import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Settings, Save, X, Palette, Globe, Bell, Shield, Brain } from 'lucide-react';

interface PersonalPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PreferencesData {
  theme: string;
  theme_variant: string;
  language: string;
  ai_personality: string;
  font_size: string;
  high_contrast: boolean;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_notifications: boolean;
  auto_save_enabled: boolean;
  message_persistence: boolean;
  data_sharing_enabled: boolean;
  analytics_enabled: boolean;
}

export const PersonalPreferencesModal = ({ isOpen, onClose }: PersonalPreferencesModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesData>({
    theme: 'light',
    theme_variant: 'default',
    language: 'en',
    ai_personality: 'professional',
    font_size: 'medium',
    high_contrast: false,
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: true,
    marketing_notifications: false,
    auto_save_enabled: true,
    message_persistence: true,
    data_sharing_enabled: false,
    analytics_enabled: true,
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchPreferences();
    }
  }, [isOpen, user]);

  const fetchPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          theme: data.theme || 'light',
          theme_variant: data.theme_variant || 'default',
          language: data.language || 'en',
          ai_personality: data.ai_personality || 'professional',
          font_size: data.font_size || 'medium',
          high_contrast: data.high_contrast || false,
          notifications_enabled: data.notifications_enabled || true,
          email_notifications: data.email_notifications || true,
          push_notifications: data.push_notifications || true,
          marketing_notifications: data.marketing_notifications || false,
          auto_save_enabled: data.auto_save_enabled || true,
          message_persistence: data.message_persistence || true,
          data_sharing_enabled: data.data_sharing_enabled || false,
          analytics_enabled: data.analytics_enabled || true,
        });
      }
    } catch (error: any) {
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Preferences updated successfully');
      onClose();
    } catch (error: any) {
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = <K extends keyof PreferencesData>(
    key: K,
    value: PreferencesData[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-mergenta-deep-violet">
            <Settings className="h-5 w-5" />
            Personal Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme & Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-mergenta-violet">
              <Palette className="h-5 w-5" />
              Theme & Appearance
            </div>
            
            <div className="space-y-4 pl-7">
              <ThemeSelector
                value={preferences.theme}
                variant={preferences.theme_variant}
                onThemeChange={(theme) => handlePreferenceChange('theme', theme)}
                onVariantChange={(variant) => handlePreferenceChange('theme_variant', variant)}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select
                    value={preferences.font_size}
                    onValueChange={(value) => handlePreferenceChange('font_size', value)}
                  >
                    <SelectTrigger className="border-pastel-violet">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <Switch
                    id="high-contrast"
                    checked={preferences.high_contrast}
                    onCheckedChange={(checked) => handlePreferenceChange('high_contrast', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-mergenta-violet">
              <Globe className="h-5 w-5" />
              Language & Region
            </div>
            
            <div className="pl-7">
              <LanguageSelector
                value={preferences.language}
                onChange={(language) => handlePreferenceChange('language', language)}
              />
            </div>
          </div>

          {/* AI Assistant */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-mergenta-violet">
              <Brain className="h-5 w-5" />
              AI Assistant
            </div>
            
            <div className="space-y-2 pl-7">
              <Label>AI Personality</Label>
              <Select
                value={preferences.ai_personality}
                onValueChange={(value) => handlePreferenceChange('ai_personality', value)}
              >
                <SelectTrigger className="border-pastel-violet">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="analytical">Analytical</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-mergenta-violet">
              <Bell className="h-5 w-5" />
              Notifications
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch
                  id="notifications"
                  checked={preferences.notifications_enabled}
                  onCheckedChange={(checked) => handlePreferenceChange('notifications_enabled', checked)}
                />
              </div>
              
              {preferences.notifications_enabled && (
                <div className="space-y-3 ml-4 pl-4 border-l-2 border-pastel-violet">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch
                      id="email-notifications"
                      checked={preferences.email_notifications}
                      onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                      id="push-notifications"
                      checked={preferences.push_notifications}
                      onCheckedChange={(checked) => handlePreferenceChange('push_notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing-notifications">Marketing Updates</Label>
                    <Switch
                      id="marketing-notifications"
                      checked={preferences.marketing_notifications}
                      onCheckedChange={(checked) => handlePreferenceChange('marketing_notifications', checked)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Preferences */}
          <div className="space-y-4">
            <div className="text-lg font-medium text-mergenta-violet">Chat Preferences</div>
            
            <div className="space-y-3 pl-7">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto-save Conversations</Label>
                <Switch
                  id="auto-save"
                  checked={preferences.auto_save_enabled}
                  onCheckedChange={(checked) => handlePreferenceChange('auto_save_enabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="message-persistence">Message Persistence</Label>
                <Switch
                  id="message-persistence"
                  checked={preferences.message_persistence}
                  onCheckedChange={(checked) => handlePreferenceChange('message_persistence', checked)}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-mergenta-violet">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </div>
            
            <div className="space-y-3 pl-7">
              <div className="flex items-center justify-between">
                <Label htmlFor="data-sharing">Data Sharing</Label>
                <Switch
                  id="data-sharing"
                  checked={preferences.data_sharing_enabled}
                  onCheckedChange={(checked) => handlePreferenceChange('data_sharing_enabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics">Analytics</Label>
                <Switch
                  id="analytics"
                  checked={preferences.analytics_enabled}
                  onCheckedChange={(checked) => handlePreferenceChange('analytics_enabled', checked)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-pastel-violet">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-pastel-violet hover:bg-pastel-violet"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};