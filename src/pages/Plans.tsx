import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      price: '$9',
      period: '/month',
      description: 'Perfect for getting started',
      icon: <Star className="h-6 w-6" />,
      features: [
        '1,000 AI conversations per month',
        'Basic writing assistance',
        'Email support',
        'Standard response time',
        'Mobile app access'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Best for professionals',
      icon: <Crown className="h-6 w-6" />,
      features: [
        '10,000 AI conversations per month',
        'Advanced writing assistance',
        'Priority support',
        'Faster response time',
        'All integrations',
        'Custom templates',
        'Analytics dashboard'
      ],
      buttonText: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For teams and organizations',
      icon: <Zap className="h-6 w-6" />,
      features: [
        'Unlimited AI conversations',
        'Premium writing assistance',
        '24/7 priority support',
        'Instant response time',
        'White-label options',
        'Custom integrations',
        'Advanced analytics',
        'Team management',
        'SSO integration'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan that fits your needs and unlock the full potential of Mergenta AI
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative transition-all duration-300 hover:shadow-elegant ${
                plan.popular 
                  ? 'border-primary shadow-glow scale-105' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.popular ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-primary hover:opacity-90' 
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Can I change my plan anytime?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">What happens if I exceed my limits?</h3>
              <p className="text-muted-foreground">You'll receive notifications as you approach your limits, and you can easily upgrade to continue using the service.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Do you offer refunds?</h3>
              <p className="text-muted-foreground">Yes, we offer a 30-day money-back guarantee for all paid plans if you're not satisfied.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Is there a free trial?</h3>
              <p className="text-muted-foreground">Yes, all plans come with a 7-day free trial so you can test all features before committing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;