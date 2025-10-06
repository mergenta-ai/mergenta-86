import React, { useState } from 'react';
import { Clock, FileText, Crown, HelpCircle, User, Plus, TrendingUp, Mail, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useUserPlan } from '@/hooks/useUserPlan';
import { getPlanBadgeColor } from '@/config/modelConfig';
import HistoryPanel from './sidebar/HistoryPanel';
import PoliciesPanel from './sidebar/PoliciesPanel';
import HelpPanel from './sidebar/HelpPanel';
import { ProfilePanel } from './sidebar/ProfilePanel';
import PlansPanel from './sidebar/PlansPanel';

import { RSSReaderModal } from './modals/RSSReaderModal';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const MergentaSidebar = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  
  const [showRSSReader, setShowRSSReader] = useState(false);
  const [rssReaderCategory, setRSSReaderCategory] = useState<string>('');
  const navigate = useNavigate();
  const { canAccessAdmin } = useUserRole();
  const { planType } = useUserPlan();
  
  const planDisplay = planType.charAt(0).toUpperCase() + planType.slice(1);

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

  // Handle new chat
  const handleNewChat = () => {
    // Reload the page to start a new chat
    window.location.reload();
  };

  // Handle email
  const handleEmail = () => {
    navigate("/emails");
  };

  // Handle RSS Reader
  const handleOpenRSSReader = (category?: string) => {
    setRSSReaderCategory(category || '');
    setShowRSSReader(true);
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

        {/* New Chat Icon */}
        <div className="relative mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-16 w-16 rounded-xl hover:bg-pastel-mint hover:shadow-[0_0_8px_rgba(200,248,220,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-mint-hover"
                onClick={handleNewChat}
              >
                <Plus className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>Start new chat</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Trending Icon */}
        <div className="relative mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-16 w-16 rounded-xl hover:bg-pastel-orange hover:shadow-[0_0_8px_rgba(248,220,200,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-orange-hover"
                onClick={() => handleOpenRSSReader()}
              >
                <TrendingUp className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>Trending</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Email Icon */}
        <div className="relative mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-16 w-16 rounded-xl hover:bg-pastel-blue hover:shadow-[0_0_8px_rgba(200,220,248,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-blue-hover"
                onClick={handleEmail}
              >
                <Mail className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>Email</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Admin Panel Icon - Only visible to admin/moderator */}
        {canAccessAdmin && (
          <div className="relative mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-16 w-16 rounded-xl hover:bg-pastel-orange hover:shadow-[0_0_8px_rgba(248,220,200,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-orange-hover"
                  onClick={() => navigate('/admin')}
                >
                  <Shield className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>Admin Panel</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* History Icon */}
        <div 
          className="relative mb-4"
          onMouseEnter={() => handleMouseEnter('history')}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-16 w-16 rounded-xl hover:bg-pastel-magenta hover:shadow-[0_0_8px_rgba(248,200,220,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-magenta-hover"
              >
                <Clock className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>History</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Middle Section - Main Icons */}
        <div className="flex flex-col justify-start space-y-4">
          {/* Policies */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('policies')}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-16 w-16 rounded-xl hover:bg-pastel-violet hover:shadow-[0_0_8px_rgba(209,196,233,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-violet-hover"
                >
                  <FileText className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>Policies</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Plans */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('plans')}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-16 w-16 rounded-xl hover:bg-pastel-lavender hover:shadow-[0_0_8px_rgba(234,220,248,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-lavender-hover"
                >
                  <Crown className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>Plans</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Help & Support */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('help')}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-16 w-16 rounded-xl hover:bg-pastel-magenta hover:shadow-[0_0_8px_rgba(248,200,220,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-magenta-hover"
                >
                  <HelpCircle className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>Help & Support</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Profile Section */}
        <div 
          className="relative pb-2"
          onMouseEnter={() => handleMouseEnter('profile')}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-16 w-16 rounded-xl hover:bg-pastel-violet hover:shadow-[0_0_8px_rgba(209,196,233,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-violet-hover"
              >
                <User className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Plan Badge */}
        <div className="pb-6 flex justify-center">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ring-1 shadow-md ${getPlanBadgeColor(planType)}`}>
            {planDisplay}
          </span>
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
      

      {/* RSS Reader Modal */}
      <RSSReaderModal
        isOpen={showRSSReader}
        onClose={() => setShowRSSReader(false)}
        initialCategory={rssReaderCategory}
      />
    </>
  );
};

export default MergentaSidebar;