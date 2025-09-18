import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, MapPin, Globe, Linkedin, Twitter, Save, X } from 'lucide-react';

interface BioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  first_name: string;
  middle_name: string;
  last_name: string;
  bio: string;
  tagline: string;
  professional_title: string;
  location: string;
  website_url: string;
  profile_image_url: string;
  social_links: {
    linkedin?: string;
    twitter?: string;
  };
  profile_visibility: string;
}

export const BioModal = ({ isOpen, onClose }: BioModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    bio: '',
    tagline: '',
    professional_title: '',
    location: '',
    website_url: '',
    profile_image_url: '',
    social_links: {},
    profile_visibility: 'private'
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user]);

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
          bio: data.bio || '',
          tagline: data.tagline || '',
          professional_title: data.professional_title || '',
          location: data.location || '',
          website_url: data.website_url || '',
          profile_image_url: data.profile_image_url || '',
          social_links: (data.social_links as { linkedin?: string; twitter?: string }) || {},
          profile_visibility: data.profile_visibility || 'private'
        });
      }
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profile updated successfully');
      onClose();
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value }
    }));
  };

  const taglineLength = profileData.tagline.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-mergenta-deep-violet">
            <User className="h-5 w-5" />
            Edit Bio & Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex justify-center">
            <ProfileImageUpload
              currentImageUrl={profileData.profile_image_url}
              onImageUpload={(url) => handleInputChange('profile_image_url', url)}
              loading={loading}
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={profileData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Enter first name"
                className="border-pastel-violet focus:border-mergenta-violet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                value={profileData.middle_name}
                onChange={(e) => handleInputChange('middle_name', e.target.value)}
                placeholder="Enter middle name"
                className="border-pastel-violet focus:border-mergenta-violet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={profileData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Enter last name"
                className="border-pastel-violet focus:border-mergenta-violet"
              />
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professional_title">Professional Title</Label>
              <Input
                id="professional_title"
                value={profileData.professional_title}
                onChange={(e) => handleInputChange('professional_title', e.target.value)}
                placeholder="e.g., Product Designer"
                className="border-pastel-violet focus:border-mergenta-violet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="border-pastel-violet focus:border-mergenta-violet"
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline">
              Tagline <span className="text-sm text-muted-foreground">({taglineLength}/100)</span>
            </Label>
            <Input
              id="tagline"
              value={profileData.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value.slice(0, 100))}
              placeholder="Your professional tagline"
              className={`border-pastel-violet focus:border-mergenta-violet ${
                taglineLength > 100 ? 'border-destructive' : ''
              }`}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="border-pastel-violet focus:border-mergenta-violet resize-none"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website_url" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Website/Portfolio
            </Label>
            <Input
              id="website_url"
              value={profileData.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="border-pastel-violet focus:border-mergenta-violet"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <Label>Social Links</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-1">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={profileData.social_links.linkedin || ''}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="border-pastel-violet focus:border-mergenta-violet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-1">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={profileData.social_links.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="border-pastel-violet focus:border-mergenta-violet"
                />
              </div>
            </div>
          </div>

          {/* Profile Visibility */}
          <div className="space-y-2">
            <Label htmlFor="profile_visibility">Profile Visibility</Label>
            <Select
              value={profileData.profile_visibility}
              onValueChange={(value) => handleInputChange('profile_visibility', value)}
            >
              <SelectTrigger className="border-pastel-violet focus:border-mergenta-violet">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private - Only visible to you</SelectItem>
                <SelectItem value="public">Public - Visible to everyone</SelectItem>
                <SelectItem value="contacts">Contacts - Visible to your contacts</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};