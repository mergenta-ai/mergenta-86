import { Cpu, Lock } from "lucide-react";
import { MODEL_CONFIG } from "@/config/modelConfig";
import { PlanType } from "@/hooks/useUserPlan";

interface ModelDisplayProps {
  selectedModel: string;
  onClick?: () => void;
  userPlan?: PlanType;
}

const ModelDisplay = ({ selectedModel, onClick, userPlan }: ModelDisplayProps) => {
  const modelInfo = MODEL_CONFIG.find(m => m.id === selectedModel);
  const isLocked = userPlan && modelInfo && modelInfo.requiredPlan !== 'free' && 
    (userPlan === 'free' || (userPlan === 'pro' && ['zip', 'ace', 'max'].includes(modelInfo.requiredPlan)));

  return (
    <div 
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <Cpu className="h-4 w-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
        {selectedModel}
      </span>
      {isLocked && (
        <Lock className="h-3 w-3 text-gray-400" />
      )}
      {modelInfo?.badge && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-600">
          {modelInfo.badge}
        </span>
      )}
    </div>
  );
};

export default ModelDisplay;