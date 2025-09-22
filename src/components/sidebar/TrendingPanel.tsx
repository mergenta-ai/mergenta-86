import React from 'react';
import { Button } from '../ui/button';
import { TrendingUp, ChevronRight } from 'lucide-react';

interface TrendingPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const trendingCategories = [
  { name: 'Sports', icon: '⚽' },
  { name: 'Finance', icon: '💰' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Academic', icon: '🎓' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Politics', icon: '🏛️' },
  { name: 'Wellness', icon: '🧘' },
  { name: 'Technology', icon: '💻' },
  { name: 'Environment', icon: '🌍' },
  { name: 'Local', icon: '📍' },
];

const TrendingPanel: React.FC<TrendingPanelProps> = ({ isVisible, onClose }) => {
  const handleCategoryClick = (category: string) => {
    // Handle category selection - you can implement navigation or other logic here
    console.log(`Selected trending category: ${category}`);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="ml-20 h-full bg-white border-r border-gray-200 shadow-lg animate-in slide-in-from-left duration-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Trending Topics</h2>
              <p className="text-sm text-gray-500">Explore popular categories</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {trendingCategories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                className="w-full justify-between h-12 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-700">{category.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Stay updated with the latest trends
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendingPanel;