import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, Workflow, Bot, Zap, Target, Layers, Compass } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export const AuthForm = ({ mode, onModeChange }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, signInWithApple } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Welcome back to Mergenta!');
      } else {
        await signUp(email, password);
        toast.success('Account created! Check your email to verify.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
      toast.success('Redirecting to sign in...');
    } catch (error: any) {
      toast.error(error.message || 'OAuth sign in failed');
    }
  };

  const isSignIn = mode === 'signin';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pastel-violet/20 to-pastel-magenta/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-pastel-lavender/15 to-pastel-rose-lilac/15 rounded-full blur-2xl animate-pulse animation-delay-2000" />
      </div>

      {/* Floating Workflow Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Workflow className="absolute top-1/6 left-1/5 w-6 h-6 text-pastel-violet animate-[spin_20s_linear_infinite] opacity-30" />
        <Bot className="absolute top-1/3 right-1/6 w-5 h-5 text-pastel-magenta animate-[spin_25s_linear_infinite] opacity-25" />
        <Zap className="absolute bottom-1/4 left-1/3 w-4 h-4 text-pastel-lavender animate-[spin_15s_linear_infinite] opacity-35" />
        <Target className="absolute bottom-1/6 right-1/3 w-5 h-5 text-pastel-rose-lilac animate-[spin_30s_linear_infinite] opacity-30" />
        <Layers className="absolute top-1/2 left-1/6 w-4 h-4 text-pastel-violet animate-[spin_18s_linear_infinite] opacity-25" />
        <Compass className="absolute top-3/4 right-1/5 w-6 h-6 text-pastel-magenta animate-[spin_22s_linear_infinite] opacity-30" />
      </div>

      <Card className="w-full max-w-md border-0 bg-white/90 backdrop-blur-md shadow-elegant relative z-10">
        <CardHeader className="space-y-6 text-center">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-30 animate-pulse" />
              <img 
                src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png" 
                alt="Mergenta Logo" 
                className="relative h-16 w-16 object-contain rounded-full shadow-lg" 
              />
            </div>
            <div className="space-y-2">
              <h1 className="font-inter text-4xl font-medium text-mergenta-violet tracking-tight">
                Mergenta
              </h1>
              <p className="text-base text-muted-foreground font-medium">
                {isSignIn ? 'Workflows, not just AI answers' : 'Join the workflow revolution'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              className="w-full bg-white/60 border-pastel-violet/50 hover:bg-white/90 hover:border-mergenta-violet/30 text-foreground font-medium py-3 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="group-hover:text-mergenta-violet transition-colors">Continue with Google</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignIn('apple')}
              className="w-full bg-white/60 border-pastel-violet/50 hover:bg-white/90 hover:border-mergenta-violet/30 text-foreground font-medium py-3 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="group-hover:text-mergenta-violet transition-colors">Continue with Apple</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-pastel-violet/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/90 px-3 py-1 text-muted-foreground font-medium rounded-full">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/60 border-pastel-violet/50 focus:border-mergenta-violet focus:ring-2 focus:ring-mergenta-violet/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/60 border-pastel-violet/50 focus:border-mergenta-violet focus:ring-2 focus:ring-mergenta-violet/20 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-95 text-white font-semibold py-3 transition-all duration-300 shadow-glow hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isSignIn ? 'Signing in...' : 'Creating account...'}</span>
                </div>
              ) : (
                isSignIn ? 'Sign In' : 'Create Account'
              )}
            </Button>

            {/* Mode Toggle */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                {isSignIn ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => onModeChange(isSignIn ? 'signup' : 'signin')}
                  className="text-mergenta-violet hover:text-mergenta-deep-violet font-medium transition-colors"
                >
                  {isSignIn ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};