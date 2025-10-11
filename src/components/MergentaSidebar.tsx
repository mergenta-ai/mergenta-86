import React, { useState } from "react";
import { Clock, FileText, Crown, HelpCircle, User, Plus, TrendingUp, Mail, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useUserPlan } from "@/hooks/useUserPlan";
import { getPlanBadgeColor } from "@/config/modelConfig";
import HistoryPanel from "./sidebar/HistoryPanel";
import PoliciesPanel from "./sidebar/PoliciesPanel";
import HelpPanel from "./sidebar/HelpPanel";
import { ProfilePanel } from "./sidebar/ProfilePanel";

import { RSSReaderModal } from "./modals/RSSReaderModal";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const MergentaSidebar = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // centralised click handler for sidebar icons (keeps existing boolean state shape)
  const handleIconClick = (panelName?: string) => {
    // remember previous open states
    const prev = {
      history: showHistory,
      policies: showPolicies,
      help: showHelp,
      profile: showProfile,
    };

    // close all panels first
    setShowHistory(false);
    setShowPolicies(false);
    setShowHelp(false);
    setShowProfile(false);

    // if a panelName provided, toggle that panel based on its previous state
    if (panelName) {
      if (panelName === "history") setShowHistory(!prev.history);
      if (panelName === "policies") setShowPolicies(!prev.policies);
      if (panelName === "help") setShowHelp(!prev.help);
      if (panelName === "profile") setShowProfile(!prev.profile);
    }
  };

  const [showRSSReader, setShowRSSReader] = useState(false);
  const [rssReaderCategory, setRSSReaderCategory] = useState<string>("");
  const navigate = useNavigate();
  const { canAccessAdmin } = useUserRole();
  const { planType } = useUserPlan();

  const planDisplay = planType.charAt(0).toUpperCase() + planType.slice(1);

  // Handle mouse events
  const handleMouseEnter = (panel: string) => {
    // Close all panels first
    setShowHistory(false);
    setShowPolicies(false);
    setShowHelp(false);
    setShowProfile(false);

    // Then open the requested panel
    switch (panel) {
      case "history":
        setShowHistory(true);
        break;
      case "policies":
        setShowPolicies(true);
        break;
      case "help":
        setShowHelp(true);
        break;
      case "profile":
        setShowProfile(true);
        break;
    }
  };

  const handleMouseLeave = () => {
    // Close all panels when leaving an icon
    setShowHistory(false);
    setShowPolicies(false);
    setShowHelp(false);
    setShowProfile(false);
  };

  // Handle clicks outside sidebar to close panels
  const handleClickOutside = () => {
    setShowHistory(false);
    setShowPolicies(false);
    setShowHelp(false);
    setShowProfile(false);
  };

  // Handle new chat
  const handleNewChat = () => {
    handleClickOutside(); // Close all panels
    // Reload the page to start a new chat
    window.location.reload();
  };

  // Handle email
  const handleEmail = () => {
    handleClickOutside(); // Close all panels
    navigate("/emails");
  };

  // Handle RSS Reader
  const handleOpenRSSReader = (category?: string) => {
    handleClickOutside(); // Close all panels
    setRSSReaderCategory(category || "");
    setShowRSSReader(true);
  };

  return (
    <>
      {/* Click outside overlay to close panels */}
      {(showHistory || showPolicies || showHelp || showProfile) && (
        <div className="fixed inset-0 z-20 bg-transparent" onClick={handleClickOutside} />
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
        <div className="relative mb-2">
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
        <div className="relative mb-2">
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
        <div className="relative mb-2">
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
          <div className="relative mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-16 w-16 rounded-xl hover:bg-pastel-orange hover:shadow-[0_0_8px_rgba(248,220,200,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-orange-hover"
                  onClick={() => {
                    handleClickOutside(); // Close all panels
                    navigate("/admin");
                  }}
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
        <div className="relative mb-2" onMouseEnter={() => handleMouseEnter("history")}>
          <Button
            variant="ghost"
            className="h-16 w-16 rounded-xl hover:bg-pastel-magenta hover:shadow-[0_0_8px_rgba(248,200,220,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-magenta-hover"
            onClick={() => handleIconClick("history")}
            aria-label="History"
          >
            <Clock className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
          </Button>
        </div>

        {/* Middle Section - Main Icons */}
        <div className="flex flex-col justify-start space-y-2">
          {/* Policies */}
          {/* Policies */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("policies")}>
            <Button
              variant="ghost"
              className="h-16 w-16 rounded-xl hover:bg-pastel-violet hover:shadow-[0_0_8px_rgba(209,196,233,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-violet-hover"
              onClick={() => handleIconClick("policies")}
              aria-label="Policies"
            >
              <FileText className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
            </Button>
          </div>

          {/* Plans */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-16 w-16 rounded-xl hover:bg-pastel-lavender hover:shadow-[0_0_8px_rgba(234,220,248,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-lavender-hover"
                  onClick={() => {
                    handleClickOutside(); // Close all panels
                    navigate("/plans");
                  }}
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
          <div className="relative" onMouseEnter={() => handleMouseEnter("help")}>
            <Button
              variant="ghost"
              className="h-16 w-16 rounded-xl hover:bg-pastel-magenta hover:shadow-[0_0_8px_rgba(248,200,220,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-magenta-hover"
              onClick={() => handleIconClick("help")}
              aria-label="Help & Support"
            >
              <HelpCircle className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
            </Button>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Profile Section */}
        <div className="relative pb-1" onMouseEnter={() => handleMouseEnter("profile")}>
          <Button
            variant="ghost"
            className="h-16 w-16 rounded-xl hover:bg-pastel-violet hover:shadow-[0_0_8px_rgba(209,196,233,0.4)] transition-all duration-300 [&_svg]:!size-6 active:bg-pastel-violet-hover"
            onClick={() => handleIconClick("profile")}
            aria-label="Profile"
          >
            <User className="h-6 w-6 text-sidebar-icon-default hover:text-sidebar-icon-hover" />
          </Button>
        </div>

        {/* Plan Badge */}
        <div className="pb-6 flex justify-center">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ring-1 shadow-md ${getPlanBadgeColor(planType)}`}
          >
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
          <HistoryPanel isVisible={showHistory} onClose={() => setShowHistory(false)} />
        </div>
      )}

      {showPolicies && (
        <div
          className="fixed left-0 top-0 h-full w-[400px] z-30"
          onMouseEnter={() => setShowPolicies(true)}
          onMouseLeave={() => setShowPolicies(false)}
        >
          <PoliciesPanel isVisible={showPolicies} onClose={() => setShowPolicies(false)} navigate={navigate} />
        </div>
      )}

      {showHelp && (
        <div
          className="fixed left-0 top-0 h-full w-[400px] z-30"
          onMouseEnter={() => setShowHelp(true)}
          onMouseLeave={() => setShowHelp(false)}
        >
          <HelpPanel isVisible={showHelp} onClose={() => setShowHelp(false)} />
        </div>
      )}

      {showProfile && (
        <div
          className="fixed left-0 top-0 h-full w-[400px] z-30"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >
          <ProfilePanel isVisible={showProfile} onClose={() => setShowProfile(false)} navigate={navigate} />
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
