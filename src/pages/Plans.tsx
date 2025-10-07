import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Check, Sparkles, Zap, Rocket, Crown, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'FREE',
      tagline: 'Explore the Essentials',
      icon: <Sparkles className="h-6 w-6" />,
      monthlyPrice: 0,
      annualPrice: 0,
      seats: 'Single user',
      features: [
        'Essential conversational AI',
        'Basic workflow creation',
        'TXT download',
        'Community support'
      ],
      callout: 'Begin Smart',
      popular: false,
      highlight: false
    },
    {
      name: 'PRO',
      tagline: 'Accelerate Your Ideas',
      icon: <Zap className="h-6 w-6" />,
      monthlyPrice: 15,
      annualPrice: 153,
      seats: 'Single user',
      features: [
        'Includes Free features',
        'Enhanced conversational intelligence',
        'File uploads & improved workflows',
        'Faster responses & task execution',
        'Saved chats & basic history'
      ],
      callout: 'Think Faster',
      popular: true,
      highlight: false
    },
    {
      name: 'ZIP',
      tagline: 'Fast and Smart',
      icon: <Rocket className="h-6 w-6" />,
      monthlyPrice: 75,
      annualPrice: 765,
      seats: 'Single user',
      features: [
        'Includes Pro features',
        'Advanced AI workflows & smarter automation',
        'Email automation & document management',
        'Export to Google Docs',
        'File processing for multiple document types',
        'Mail-based support'
      ],
      callout: 'Speed and Ease',
      popular: false,
      highlight: false
    },
    {
      name: 'ACE',
      tagline: 'Unlock Ultimate Experience',
      icon: <Crown className="h-6 w-6" />,
      monthlyPrice: 150,
      annualPrice: 1530,
      seats: 'Single user',
      teamPricing: {
        annual: 1530,
        perSeat: 30,
        minSeats: 5
      },
      features: [
        'Includes Pro features',
        'Deep-research AI reasoning',
        'Improved quotas & performance',
        'Extended file management',
        'Exports to Docs & TXT',
        'Priority workflow processing',
        'Personalised support',
        'Early access to new tools'
      ],
      callout: 'Go Beyond',
      popular: false,
      highlight: true
    },
    {
      name: 'MAX',
      tagline: 'All Powerful Plan',
      icon: <Trophy className="h-6 w-6" />,
      monthlyPrice: 200,
      annualPrice: 2040,
      seats: 'Single user',
      teamPricing: {
        annual: 2040,
        perSeat: 25,
        minSeats: 10
      },
      features: [
        'Includes ZIP + ACE features',
        'Full automation capabilities',
        'Maximum quotas & top-tier performance',
        'Full export options (Docs + downloads)',
        'Workflow memory & continuity',
        'Premium AI research tools',
        'Dedicated support',
        'Data backup & secure storage'
      ],
      callout: 'Premium Power',
      popular: false,
      highlight: true
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return '$0';
    return isAnnual 
      ? `$${plan.annualPrice}` 
      : `$${plan.monthlyPrice}`;
  };

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return '';
    return isAnnual ? '/year' : '/month';
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0 || !isAnnual) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.annualPrice;
    return `Save $${savings}/year`;
  };

  const getTeamPricing = (plan: typeof plans[0]) => {
    if (!plan.teamPricing || !isAnnual) return null;
    return `Team: $${plan.teamPricing.annual} + $${plan.teamPricing.perSeat}/seat (min ${plan.teamPricing.minSeats} seats)`;
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Select the perfect plan that fits your needs and unlock the full potential of Mergenta AI
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={isAnnual}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
                Save 15%
              </span>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary shadow-glow scale-105' 
                  : plan.highlight
                  ? 'border-primary/50 hover:border-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4 flex-shrink-0">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.popular || plan.highlight 
                    ? 'bg-gradient-primary text-white' 
                    : 'bg-accent text-accent-foreground'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-xs mb-4">{plan.tagline}</CardDescription>
                <div className="space-y-1">
                  <div>
                    <span className="text-3xl font-bold text-foreground">{getPrice(plan)}</span>
                    <span className="text-sm text-muted-foreground">{getPeriod(plan)}</span>
                  </div>
                  {getSavings(plan) && (
                    <p className="text-xs text-green-600 font-medium">{getSavings(plan)}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3">{plan.seats}</p>
                {getTeamPricing(plan) && (
                  <p className="text-xs text-primary font-medium mt-1">{getTeamPricing(plan)}</p>
                )}
              </CardHeader>
              
              <CardContent className="flex flex-col flex-grow pt-0">
                <ul className="space-y-2.5 mb-6 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto space-y-3">
                  <p className="text-xs font-semibold text-center text-primary italic">
                    {plan.callout}
                  </p>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular || plan.highlight
                        ? 'bg-gradient-primary hover:opacity-90 text-white' 
                        : ''
                    }`}
                    variant={plan.popular || plan.highlight ? 'default' : 'outline'}
                    size="lg"
                  >
                    Choose Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tagline */}
        <div className="text-center mb-8">
          <p className="text-lg font-semibold text-foreground">
            Mergenta AI – AI Reimagined. Intelligent Conversations That Become Workflows.
          </p>
        </div>

        {/* Fair-Use Policy */}
        <div className="max-w-4xl mx-auto mb-6">
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">Fair-Use Policy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All plans operate under Mergenta's Fair-Use Policy. Usage limits are generous and designed for normal creative and professional activity. Excessive or automated high-volume usage may be throttled to maintain platform stability.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            All prices shown are in USD. Indian users will see equivalent INR pricing at checkout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Plans;