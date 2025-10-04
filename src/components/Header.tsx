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
    <div className="flex flex-col items-center pt-9 md:pt-16 px-4 relative">
      {/* Softer Title */}
      <h1 className="font-inter text-4xl md:text-5xl font-medium text-[#7D55C7] tracking-[-0.01em] text-center">
        Mergenta
      </h1>

      {/* Sleek tagline pill */}
      <div className="mt-2 mb-2 flex items-center gap-2">
        <span className="inline-flex items-center px-4 py-1 rounded-full
                         bg-white/95 text-[#444] shadow-sm
                         ring-1 ring-[#6A0DAD]/15 text-sm md:text-base">
          {currentTagline}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ring-1 shadow-sm ${getPlanBadgeColor(planType)}`}>
          {planDisplay} Plan
        </span>
      </div>
    </div>
  );
};

export default Header;