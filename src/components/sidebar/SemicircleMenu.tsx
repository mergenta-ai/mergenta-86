import React from 'react';
import { Button } from '../ui/button';

interface MenuItem {
  label: string;
  action: () => void;
  section?: string;
}

interface SemicircleMenuProps {
  items: MenuItem[];
  isProfile?: boolean;
}

const SemicircleMenu: React.FC<SemicircleMenuProps> = ({ items, isProfile = false }) => {
  const radius = isProfile ? 120 : 100;
  const startAngle = -90; // Start from top
  const endAngle = 90; // End at bottom
  const angleStep = (endAngle - startAngle) / (items.length - 1);

  const getButtonPosition = (index: number) => {
    const angle = (startAngle + (index * angleStep)) * (Math.PI / 180);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  const getSectionColor = (section?: string) => {
    switch (section) {
      case 'account':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'preferences':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'about':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
    }
  };

  return (
    <div className="absolute left-16 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        {items.map((item, index) => {
          const { x, y } = getButtonPosition(index);
          return (
            <Button
              key={index}
              size="sm"
              className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-xs font-medium whitespace-nowrap animate-in fade-in zoom-in duration-200 ${getSectionColor(item.section)}`}
              style={{
                left: x + radius,
                top: y + radius,
                animationDelay: `${index * 50}ms`,
              }}
              onClick={item.action}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SemicircleMenu;