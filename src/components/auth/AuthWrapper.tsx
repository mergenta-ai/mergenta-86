import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from './AuthForm';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-mergenta-violet/30 border-t-mergenta-violet rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading Mergenta...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm mode={authMode} onModeChange={setAuthMode} />;
  }

  return <>{children}</>;
};