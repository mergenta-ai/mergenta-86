import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface ScriptHoverCardProps {
  children: React.ReactNode;
}

const ScriptHoverCard = ({ children }: ScriptHoverCardProps) => {
  const [formData, setFormData] = useState({
    title: "",
    keyDetails: "",
    structure: "",
    theme: "",
    mood: "",
    format: "",
    audience: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartScript = () => {
    console.log("Starting script with data:", formData);
  };

  return (
    <HoverCard openDelay={100} closeDelay={300}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        side="right" 
        align="start"
        className="w-96 p-6 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        onPointerDownOutside={(e) => {
          // Prevent closing when interacting with form elements
          const target = e.target as HTMLElement;
          if (target.closest('.hover-card-content')) {
            e.preventDefault();
          }
        }}
      >
        <div className="hover-card-content space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Script</h3>
            <p className="text-sm text-gray-600">Dialogue-driven format for plays, films or skits.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Script Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter your script title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Details / Plot Points
              </label>
              <textarea
                value={formData.keyDetails}
                onChange={(e) => handleInputChange("keyDetails", e.target.value)}
                placeholder="Main characters, scenes, key movements..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Structure
              </label>
              <input
                type="text"
                value={formData.structure}
                onChange={(e) => handleInputChange("structure", e.target.value)}
                placeholder="Long, Medium, Short, Micro"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => handleInputChange("theme", e.target.value)}
                placeholder="Identity, Revenge, Power, Love, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mood
              </label>
              <input
                type="text"
                value={formData.mood}
                onChange={(e) => handleInputChange("mood", e.target.value)}
                placeholder="Romantic, Eerie, Dark, Light, Suspense"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <input
                type="text"
                value={formData.format}
                onChange={(e) => handleInputChange("format", e.target.value)}
                placeholder="Screenplay, Radio, TV, Web Series"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audience
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => handleInputChange("audience", e.target.value)}
                placeholder="Children, Teens, Young Adults, Mature"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleStartScript}
            className="w-full mt-6 px-4 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Start Script
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ScriptHoverCard;