import { PlanType } from '@/hooks/useUserPlan';

export interface ModelInfo {
  id: string;
  displayName: string;
  category: 'creativity' | 'research';
  vendor: string;
  badge?: string;
  requiredPlan: PlanType;
  description?: string;
  isNew?: boolean;
}

export const PLAN_HIERARCHY: Record<PlanType, number> = {
  free: 0,
  pro: 1,
  zip: 2,
  ace: 3,
  max: 4,
};

export const MODEL_CONFIG: ModelInfo[] = [
  // Free tier models
  {
    id: 'gemini-2.5-flash',
    displayName: 'Gemini 2.5 Flash',
    category: 'creativity',
    vendor: 'google',
    requiredPlan: 'free',
    description: 'Fast and efficient for most tasks',
  },
  
  // Pro tier models - Creativity
  {
    id: 'gpt-5',
    displayName: 'GPT-5',
    category: 'creativity',
    vendor: 'openai',
    requiredPlan: 'pro',
    badge: 'Latest',
    description: 'Most advanced GPT model',
    isNew: true,
  },
  {
    id: 'gpt-4.1',
    displayName: 'GPT-4.1',
    category: 'creativity',
    vendor: 'openai',
    requiredPlan: 'pro',
    description: 'Advanced creative generation',
  },
  {
    id: 'grok-3',
    displayName: 'Grok 3',
    category: 'creativity',
    vendor: 'xai',
    requiredPlan: 'pro',
    description: 'Fast and witty responses',
  },
  {
    id: 'claude-haiku-3.5',
    displayName: 'Claude Haiku 3.5',
    category: 'creativity',
    vendor: 'anthropic',
    requiredPlan: 'pro',
    description: 'Quick and efficient',
  },
  
  // Pro tier models - Research
  {
    id: 'gemini-2.5-pro',
    displayName: 'Gemini 2.5 Pro',
    category: 'research',
    vendor: 'google',
    requiredPlan: 'pro',
    description: 'Advanced reasoning capabilities',
  },
  {
    id: 'claude-sonnet-4',
    displayName: 'Claude Sonnet 4',
    category: 'research',
    vendor: 'anthropic',
    requiredPlan: 'pro',
    description: 'Exceptional reasoning',
  },
  {
    id: 'claude-sonnet-4.5',
    displayName: 'Claude Sonnet 4.5',
    category: 'research',
    vendor: 'anthropic',
    requiredPlan: 'pro',
    description: 'Enhanced reasoning',
  },
  {
    id: 'o3',
    displayName: 'o3',
    category: 'research',
    vendor: 'openai',
    requiredPlan: 'pro',
    description: 'Complex reasoning',
  },
  {
    id: 'grok-4',
    displayName: 'Grok 4',
    category: 'research',
    vendor: 'xai',
    requiredPlan: 'pro',
    description: 'Advanced analysis',
  },
  {
    id: 'o4-mini',
    displayName: 'o4-mini',
    category: 'research',
    vendor: 'openai',
    requiredPlan: 'pro',
    description: 'Fast reasoning',
  },
  
  // Ace tier models
  {
    id: 'claude-opus-4.1',
    displayName: 'Claude Opus 4.1',
    category: 'research',
    vendor: 'anthropic',
    requiredPlan: 'ace',
    badge: 'Ace',
    description: 'Most capable reasoning',
  },
  {
    id: 'o3-pro',
    displayName: 'o3-pro',
    category: 'research',
    vendor: 'openai',
    requiredPlan: 'ace',
    badge: 'Ace',
    description: 'Top-tier reasoning',
  },
];

export const getAvailableModels = (userPlan: PlanType): ModelInfo[] => {
  const userPlanLevel = PLAN_HIERARCHY[userPlan];
  return MODEL_CONFIG.filter(
    model => PLAN_HIERARCHY[model.requiredPlan] <= userPlanLevel
  );
};

export const getLockedModels = (userPlan: PlanType): ModelInfo[] => {
  const userPlanLevel = PLAN_HIERARCHY[userPlan];
  return MODEL_CONFIG.filter(
    model => PLAN_HIERARCHY[model.requiredPlan] > userPlanLevel
  );
};

export const isModelAvailable = (modelId: string, userPlan: PlanType): boolean => {
  const model = MODEL_CONFIG.find(m => m.id === modelId);
  if (!model) return false;
  return PLAN_HIERARCHY[model.requiredPlan] <= PLAN_HIERARCHY[userPlan];
};

export const getPlanBadgeColor = (plan: PlanType): string => {
  switch (plan) {
    case 'free': return 'bg-gray-100 text-gray-600 ring-gray-200';
    case 'pro': return 'bg-blue-100 text-blue-600 ring-blue-200';
    case 'zip': return 'bg-purple-100 text-purple-600 ring-purple-200';
    case 'ace': return 'bg-violet-100 text-violet-600 ring-violet-200';
    case 'max': return 'bg-amber-100 text-amber-600 ring-amber-200';
    default: return 'bg-gray-100 text-gray-600 ring-gray-200';
  }
};
