import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  first_name: string;
  middle_name: string;
  last_name: string;
  display_name: string;
  professional_title: string;
  location: string;
  website_url: string;
  profile_image_url: string;
  profile_visibility: string;
  social_links: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    display_name: '',
    professional_title: '',
    location: '',
    website_url: '',
    profile_image_url: '',
    profile_visibility: 'private',
    social_links: {}
  });

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfileData({
          first_name: data.first_name || '',
          middle_name: data.middle_name || '',
          last_name: data.last_name || '',
          display_name: data.display_name || '',
          professional_title: data.professional_title || '',
          location: data.location || '',
          website_url: data.website_url || '',
          profile_image_url: data.profile_image_url || '',
          profile_visibility: data.profile_visibility || 'private',
          social_links: (data.social_links as { linkedin?: string; twitter?: string; github?: string; instagram?: string; }) || {}
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error loading profile",
        description: "There was an error loading your profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setProfileData(prev => ({
      ...prev,
      profile_image_url: imageUrl
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <ProfileImageUpload
                currentImageUrl={profileData.profile_image_url}
                onImageUpload={handleImageUpload}
                loading={saving}
              />
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profileData.first_name}
                    onChange={(e) => handleFieldChange('first_name', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    value={profileData.middle_name}
                    onChange={(e) => handleFieldChange('middle_name', e.target.value)}
                    placeholder="Enter your middle name (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profileData.last_name}
                    onChange={(e) => handleFieldChange('last_name', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={profileData.display_name}
                    onChange={(e) => handleFieldChange('display_name', e.target.value)}
                    placeholder="How should we display your name?"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="professional_title">Professional Title</Label>
                  <Input
                    id="professional_title"
                    value={profileData.professional_title}
                    onChange={(e) => handleFieldChange('professional_title', e.target.value)}
                    placeholder="e.g., Software Engineer, Designer"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={profileData.website_url}
                  onChange={(e) => handleFieldChange('website_url', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profileData.social_links.linkedin || ''}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="LinkedIn profile URL"
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={profileData.social_links.twitter || ''}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="Twitter profile URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={profileData.social_links.github || ''}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    placeholder="GitHub profile URL"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profileData.social_links.instagram || ''}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="Instagram profile URL"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Privacy Settings</h3>
              
              <div>
                <Label htmlFor="profile_visibility">Profile Visibility</Label>
                <Select
                  value={profileData.profile_visibility}
                  onValueChange={(value) => handleFieldChange('profile_visibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="contacts">Contacts Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Profile
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};