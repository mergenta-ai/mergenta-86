import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
  const [step, setStep] = useState<'warning' | 'final'>('warning');
  const [deleting, setDeleting] = useState(false);
  const { user, signOut } = useAuth();

  const handleClose = () => {
    setStep('warning');
    onClose();
  };

  const handleDeletePermanently = () => {
    setStep('final');
  };

  const handleFinalDelete = async () => {
    if (!user) return;
    
    setDeleting(true);
    try {
      // Delete user data from all tables
      await Promise.all([
        supabase.from('conversations').delete().eq('user_id', user.id),
        supabase.from('messages').delete().eq('user_id', user.id),
        supabase.from('usage_analytics').delete().eq('user_id', user.id),
        supabase.from('user_preferences').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('id', user.id),
      ]);

      // Delete the user account from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) {
        console.error('Error deleting user account:', authError);
        // Even if admin delete fails, sign out the user
      }

      // Sign out the user
      await signOut();

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      
      handleClose();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error deleting account",
        description: "There was an error deleting your account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    if (step === 'final') {
      setStep('warning');
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === 'warning' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete Account
              </DialogTitle>
            </DialogHeader>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-red-800 font-medium">
                    Are you sure you want to delete your account?
                  </p>
                  <p className="text-red-700 text-sm">
                    This action cannot be undone. All your data, conversations, and settings will be permanently deleted.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeletePermanently}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Permanently
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Final Confirmation
              </DialogTitle>
            </DialogHeader>

            <div className="bg-red-600 text-white rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-white mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium text-lg">
                    Your account will now be permanently deleted
                  </p>
                  <p className="text-red-100 text-sm">
                    This is your final chance to cancel. Once deleted, your account cannot be recovered.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                  disabled={deleting}
                >
                  No, Keep Account
                </Button>
                <Button 
                  onClick={handleFinalDelete}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={deleting}
                >
                  {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Yes, Delete Forever
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};