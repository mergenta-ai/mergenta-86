import { Cpu, Lock, Sparkles, Brain } from "lucide-react";
import { MODEL_CONFIG, isModelAvailable } from "@/config/modelConfig";
import { PlanType } from "@/hooks/useUserPlan";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ModelDisplayProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  userPlan?: PlanType;
}

const ModelDisplay = ({ selectedModel, onModelSelect, userPlan }: ModelDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const currentPlan = userPlan || 'free';

  const modelInfo = MODEL_CONFIG.find(m => m.id === selectedModel);
  
  const creativityModels = MODEL_CONFIG.filter(m => m.category === 'creativity');
  const researchModels = MODEL_CONFIG.filter(m => m.category === 'research');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelClick = (modelId: string) => {
    if (currentPlan === 'free' && !isModelAvailable(modelId, currentPlan)) {
      navigate('/plans');
      setIsOpen(false);
      return;
    }
    onModelSelect(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Cpu className="h-4 w-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
          {modelInfo?.displayName || selectedModel}
        </span>
        {modelInfo?.badge && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 font-semibold">
            {modelInfo.badge}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] w-full max-w-md max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {/* Creativity Column */}
            <div className="border-b sm:border-b-0 sm:border-r border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Creativity</h3>
                  <p className="text-xs text-gray-500">(Inventive & Expressive)</p>
                </div>
              </div>
              <div className="space-y-1 mt-3">
                {creativityModels.map((model) => {
                  const available = isModelAvailable(model.id, currentPlan);
                  const isSelected = model.id === selectedModel;
                  
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleModelClick(model.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-all text-sm ${
                        isSelected 
                          ? 'bg-purple-50 text-purple-700 font-medium' 
                          : available
                          ? 'hover:bg-gray-50 text-gray-700'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex-1 truncate">{model.displayName}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {model.badge && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                              model.badge === 'Latest' 
                                ? 'bg-green-100 text-green-700'
                                : model.badge === 'Ace'
                                ? 'bg-violet-100 text-violet-700'
                                : 'bg-purple-100 text-purple-600'
                            }`}>
                              {model.badge}
                            </span>
                          )}
                          {!available && <Lock className="h-3 w-3" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Research Column */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Research</h3>
                  <p className="text-xs text-gray-500">(Reasoning & Thinking)</p>
                </div>
              </div>
              <div className="space-y-1 mt-3">
                {researchModels.map((model) => {
                  const available = isModelAvailable(model.id, currentPlan);
                  const isSelected = model.id === selectedModel;
                  
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleModelClick(model.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-all text-sm ${
                        isSelected 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : available
                          ? 'hover:bg-gray-50 text-gray-700'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex-1 truncate">{model.displayName}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {model.badge && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                              model.badge === 'Ace'
                                ? 'bg-violet-100 text-violet-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {model.badge}
                            </span>
                          )}
                          {!available && <Lock className="h-3 w-3" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelDisplay;