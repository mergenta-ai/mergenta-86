import { Cpu } from "lucide-react";

interface ModelDisplayProps {
  selectedModel: string;
  onClick?: () => void;
}

const ModelDisplay = ({ selectedModel, onClick }: ModelDisplayProps) => {
  return (
    <div 
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <Cpu className="h-4 w-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
        {selectedModel}
      </span>
    </div>
  );
};

export default ModelDisplay;