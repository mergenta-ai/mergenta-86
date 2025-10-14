import { useState, useEffect } from "react";
import { useUserPlan } from "@/hooks/useUserPlan";
import { getPlanBadgeColor } from "@/config/modelConfig";

const taglines = [
  "AI reimagined",
  "Conversation elevated", 
  "Smarter. Simpler. Stronger",
  "Beyond intelligence",
  "Your creative AI",
  "Ideas in motion",
  "New way AI",
  "Your thinking AI"
];

const Header = () => {
  const [currentTagline, setCurrentTagline] = useState("");
  const { planType } = useUserPlan();

  useEffect(() => {
    const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];
    setCurrentTagline(randomTagline);
  }, []);

  const planDisplay = planType.charAt(0).toUpperCase() + planType.slice(1);

  return (
    <div className="flex flex-col items-center pt-4 sm:pt-6 md:pt-8 px-4 relative">
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {/* Softer Title */}
        <h1 className="font-inter text-2xl sm:text-3xl md:text-4xl font-medium text-[#7D55C7] tracking-[-0.01em] text-center">
          Mergenta
        </h1>

        {/* Sleek tagline pill */}
        <div className="flex items-center justify-center">
          <span className="inline-block bg-white/95 text-[#444] shadow-sm ring-1 ring-[#6A0DAD]/15 rounded-full px-3 py-0.5 text-xs sm:px-4 sm:py-1 sm:text-sm">
            {currentTagline}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;