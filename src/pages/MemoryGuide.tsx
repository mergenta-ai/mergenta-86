import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Brain, 
  ArrowLeft, 
  Lightbulb, 
  MessageSquare, 
  Clock, 
  Users, 
  Target, 
  BookOpen,
  Zap,
  Shield,
  Star,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemoryGuide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMemorySettings();
    }
  }, [user]);

  const fetchMemorySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('memory_enabled')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setMemoryEnabled(data.memory_enabled ?? true);
      }
    } catch (error) {
      console.error('Error fetching memory settings:', error);
    }
  };

  const handleMemoryToggle = async (enabled: boolean) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          memory_enabled: enabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMemoryEnabled(enabled);
      toast.success(`Memory ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update memory settings');
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    {
      icon: MessageSquare,
      title: "Contextual Conversations",
      description: "Mergenta remembers your previous questions and responses, creating flowing, natural conversations that build upon each other.",
      example: "You: 'Help me write a marketing email' → Later: 'Make it more casual' → Mergenta knows you're still talking about the email."
    },
    {
      icon: Target,
      title: "Personalized Responses",
      description: "Memory allows Mergenta to understand your preferences, writing style, and goals to provide more relevant and tailored assistance.",
      example: "After learning you prefer concise communication, Mergenta will automatically provide shorter, more direct responses."
    },
    {
      icon: Clock,
      title: "Long-term Learning",
      description: "Mergenta builds a knowledge base about your projects, interests, and work patterns to offer increasingly helpful suggestions.",
      example: "Remembering you're working on a product launch, Mergenta can proactively suggest relevant templates and strategies."
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Faster Interactions",
      description: "No need to repeat context or preferences in every conversation"
    },
    {
      icon: Brain,
      title: "Smarter Responses",
      description: "AI becomes more intelligent about your specific needs over time"
    },
    {
      icon: Users,
      title: "Consistent Experience",
      description: "Seamless conversations across different sessions and devices"
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your memory data is encrypted and only accessible to you"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="hover:bg-pastel-violet"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-primary p-4 rounded-full shadow-glow">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mergenta-deep-violet mb-4">
            Mergenta Memory Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how Mergenta's Memory feature transforms your AI interactions by remembering context, 
            preferences, and conversation history to provide increasingly personalized assistance.
          </p>
        </div>

        {/* Memory Toggle Card */}
        <Card className="mb-8 border-pastel-violet shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-mergenta-violet">
                  <Brain className="h-5 w-5" />
                  Memory Settings
                </CardTitle>
                <CardDescription>
                  Control how Mergenta remembers and learns from your interactions
                </CardDescription>
              </div>
              <Badge variant={memoryEnabled ? "default" : "secondary"} className="px-3 py-1">
                {memoryEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="memory-toggle" className="text-base font-medium">
                  Enable Memory
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow Mergenta to remember your conversations and preferences
                </p>
              </div>
              <Switch
                id="memory-toggle"
                checked={memoryEnabled}
                onCheckedChange={handleMemoryToggle}
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* How Memory Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-mergenta-deep-violet mb-6 flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            How Memory Works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {examples.map((example, index) => {
              const Icon = example.icon;
              return (
                <Card key={index} className="border-pastel-violet hover:shadow-soft transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-pastel-lavender p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-mergenta-violet" />
                      </div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                    </div>
                    <CardDescription>{example.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-mergenta-light-violet p-3 rounded-lg">
                      <p className="text-sm text-mergenta-deep-violet">
                        <strong>Example:</strong> {example.example}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-mergenta-deep-violet mb-6 flex items-center gap-2">
            <Star className="h-6 w-6" />
            Benefits of Memory
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-pastel-violet hover:shadow-soft transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-primary p-2 rounded-lg shadow-soft">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-mergenta-deep-violet mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Privacy & Security */}
        <Card className="mb-8 border-pastel-violet">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-mergenta-violet">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-mergenta-deep-violet">Data Protection</h4>
                <p className="text-sm text-muted-foreground">
                  All memory data is encrypted and stored securely. Only you have access to your conversation history and preferences.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-mergenta-deep-violet">User Control</h4>
                <p className="text-sm text-muted-foreground">
                  You can disable memory at any time or delete specific conversations from your history through your preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-primary hover:opacity-90 px-8 py-3"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Start Using Memory
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
          
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/plans')}
              className="border-pastel-violet hover:bg-pastel-violet"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
            <Button
              variant="ghost"
              onClick={() => {/* Open help */}}
              className="hover:bg-pastel-violet"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Get Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGuide;