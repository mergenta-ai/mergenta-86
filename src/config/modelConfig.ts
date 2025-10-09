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
  {
    id: 'gemini-2.5-flash-lite',
    displayName: 'Gemini 2.5 Flash Lite',
    category: 'creativity',
    vendor: 'google',
    requiredPlan: 'free',
    description: 'Lightweight and quick',
  },
  {
    id: 'gpt-5-nano',
    displayName: 'GPT-5 Nano',
    category: 'creativity',
    vendor: 'openai',
    requiredPlan: 'free',
    description: 'Speed-optimized GPT model',
  },
  
  // Pro tier models
  {
    id: 'gpt-5-mini',
    displayName: 'GPT-5 Mini',
    category: 'creativity',
    vendor: 'openai',
    requiredPlan: 'pro',
    description: 'Balanced performance and cost',
  },
  {
    id: 'gemini-2.5-pro',
    displayName: 'Gemini 2.5 Pro',
    category: 'research',
    vendor: 'google',
    requiredPlan: 'pro',
    description: 'Advanced reasoning capabilities',
  },
  
  // Zip tier models
  {
    id: 'gpt-5',
    displayName: 'GPT-5',
    category: 'creativity',
    vendor: 'openai',
    requiredPlan: 'zip',
    badge: 'Popular',
    description: 'Powerful all-purpose model',
  },
  {
    id: 'claude-sonnet-4',
    displayName: 'Claude Sonnet 4',
    category: 'creativity',
    vendor: 'anthropic',
    requiredPlan: 'zip',
    badge: 'New',
    description: 'Exceptional reasoning and efficiency',
    isNew: true,
  },
  
  // Ace tier models
  {
    id: 'claude-opus-4.1',
    displayName: 'Claude Opus 4.1',
    category: 'research',
    vendor: 'anthropic',
    requiredPlan: 'ace',
    badge: 'Ace',
    description: 'Most capable reasoning model',
  },
  {
    id: 'o3-pro',
    displayName: 'o3 Pro',
    category: 'research',
    vendor: 'openai',
    requiredPlan: 'ace',
    badge: 'Ace',
    description: 'Advanced multi-step reasoning',
  },
  
  // Max tier models
  {
    id: 'o4-mini',
    displayName: 'o4 Mini',
    category: 'research',
    vendor: 'openai',
    requiredPlan: 'max',
    badge: 'Max',
    description: 'Fast reasoning for complex tasks',
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
