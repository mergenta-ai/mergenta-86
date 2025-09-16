import React, { useState } from 'react';
import { Clock, FileText, Crown, HelpCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HistoryPanel from './sidebar/HistoryPanel';
import PoliciesPanel from './sidebar/PoliciesPanel';
import HelpPanel from './sidebar/HelpPanel';
import ProfilePanel from './sidebar/ProfilePanel';
import PlansPanel from './sidebar/PlansPanel';
import { Button } from './ui/button';

const MergentaSidebar = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const navigate = useNavigate();

  // Handle mouse events
  const handleMouseEnter = (panel: string) => {
    // Close all panels first
    setShowHistory(false);
    setShowPolicies(false);
    setShowPlans(false);
    setShowHelp(false);
    setShowProfile(false);
    
    // Then open the requested panel
    switch(panel) {
      case 'history': setShowHistory(true); break;
      case 'policies': setShowPolicies(true); break;
      case 'plans': setShowPlans(true); break;
      case 'help': setShowHelp(true); break;
      case 'profile': setShowProfile(true); break;
    }
  };

  const handleMouseLeave = () => {
    // Close all panels when leaving an icon
    setShowHistory(false);
    setShowPolicies(false);
    setShowPlans(false);
    setShowHelp(false);
    setShowProfile(false);
  };

  // Handle clicks outside sidebar to close panels
  const handleClickOutside = () => {
    setShowHistory(false);
    setShowPolicies(false);
    setShowPlans(false);
    setShowHelp(false);
    setShowProfile(false);
  };


  return (
    <>
      {/* Click outside overlay to close panels */}
      {(showHistory || showPolicies || showPlans || showHelp || showProfile) && (
        <div 
          className="fixed inset-0 z-20 bg-transparent"
          onClick={handleClickOutside}
        />
      )}
      
      <div className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-purple-50 to-purple-100 border-r border-purple-200 z-40 hidden lg:flex flex-col items-center shadow-lg">
        {/* Logo Section */}
        <div className="pt-6 pb-8">
          <img 
            src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png" 
            alt="Mergenta Logo" 
            className="h-30 w-30 object-contain" 
          />
        </div>

        {/* History Icon */}
        <div 
          className="relative mb-12"
          onMouseEnter={() => handleMouseEnter('history')}
        >
          <Button
            variant="ghost"
            className="h-16 w-16 rounded-xl hover:bg-pastel-magenta hover:shadow-[0_0_8px_rgba(248,200,220,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-magenta-hover"
          >
            <Clock className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
          </Button>
        </div>

        {/* Middle Section - Main Icons */}
        <div className="flex flex-col justify-start space-y-6">
          {/* Policies */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('policies')}
          >
            <Button
              variant="ghost"
              className="h-16 w-16 rounded-xl hover:bg-pastel-violet hover:shadow-[0_0_8px_rgba(209,196,233,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-violet-hover"
            >
              <FileText className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
            </Button>
          </div>

          {/* Plans */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('plans')}
          >
            <Button
              variant="ghost"
              className="h-16 w-16 rounded-xl hover:bg-pastel-lavender hover:shadow-[0_0_8px_rgba(234,220,248,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-lavender-hover"
            >
              <Crown className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
            </Button>
          </div>

          {/* Help & Support */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('help')}
          >
            <Button
              variant="ghost"
              className="h-16 w-16 rounded-xl hover:bg-pastel-magenta hover:shadow-[0_0_8px_rgba(248,200,220,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-magenta-hover"
            >
              <HelpCircle className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
            </Button>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Profile Section */}
        <div 
          className="relative pb-6"
          onMouseEnter={() => handleMouseEnter('profile')}
        >
          <Button
            variant="ghost"
            className="h-16 w-16 rounded-xl hover:bg-pastel-violet hover:shadow-[0_0_8px_rgba(209,196,233,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-violet-hover"
          >
            <User className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
          </Button>
        </div>
      </div>

      {/* Side Panels with Continuous Hover Areas */}
      {showHistory && (
        <div 
          className="fixed left-0 top-0 h-full w-[400px] z-30"
          onMouseEnter={() => setShowHistory(true)}
          onMouseLeave={() => setShowHistory(false)}
        >
          <HistoryPanel 
            isVisible={showHistory} 
            onClose={() => setShowHistory(false)}
          />
        </div>
      )}
      
      {showPolicies && (
        <div 
          className="fixed left-0 top-0 h-full w-[400px] z-30"
          onMouseEnter={() => setShowPolicies(true)}
          onMouseLeave={() => setShowPolicies(false)}
        >
          <PoliciesPanel 
            isVisible={showPolicies} 
            onClose={() => setShowPolicies(false)}
            navigate={navigate}
          />
        </div>
      )}
      
      {showPlans && (
        <div 
          className="fixed left-0 top-0 h-full w-[400px] z-30"
          onMouseEnter={() => setShowPlans(true)}
          onMouseLeave={() => setShowPlans(false)}
        >
          <PlansPanel 
            isVisible={showPlans} 
            onClose={() => setShowPlans(false)}
            navigate={navigate}
          />
        </div>
      )}
      
      {showHelp && (
        <div 
          className="fixed left-0 top-0 h-full w-[400px] z-30"
          onMouseEnter={() => setShowHelp(true)}
          onMouseLeave={() => setShowHelp(false)}
        >
          <HelpPanel 
            isVisible={showHelp} 
            onClose={() => setShowHelp(false)}
          />
        </div>
      )}
      
      {showProfile && (
        <div 
          className="fixed left-0 top-0 h-full w-[400px] z-30"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >
          <ProfilePanel 
            isVisible={showProfile} 
            onClose={() => setShowProfile(false)}
            navigate={navigate}
          />
        </div>
      )}
    </>
  );
};

export default MergentaSidebar;