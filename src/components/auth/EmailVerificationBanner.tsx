import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const EmailVerificationBanner = ({ email }: { email: string }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      
      toast.success('Verification email sent! Check your inbox.', { duration: 5000 });
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-4 rounded-r-lg shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Verify your email address
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              We sent a confirmation link to <strong>{email}</strong>. Please click it to activate your account.
            </p>
            <Button 
              variant="link"
              onClick={handleResend}
              disabled={resending}
              className="h-auto p-0 text-sm text-yellow-700 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-100 mt-2 font-medium"
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 transition-colors flex-shrink-0 ml-2"
          aria-label="Dismiss banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
