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
    <div className="flex flex-col items-center pt-8 sm:pt-12 md:pt-16 lg:pt-20 px-4">
      {/* Logo */}
      <h1 className="font-inter text-4xl sm:text-5xl md:text-6xl font-semibold text-primary tracking-tight text-center">
        Mergenta
      </h1>

      {/* Tagline pill */}
      <div className="mt-3 mb-3 flex items-center justify-center">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-primary/15 text-sm md:text-base text-foreground">
          {currentTagline}
        </span>
      </div>
    </div>
  );
};

export default Header;