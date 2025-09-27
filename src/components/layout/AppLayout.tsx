import { useState } from 'react';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import MobileNavigation from '@/components/MobileNavigation';
import MergentaSidebar from '@/components/MergentaSidebar';

/**
 * APP LAYOUT MANAGER
 * Single source of truth for layout state and ChatInput positioning
 * Manages responsive behavior and dynamic spacing
 */

export interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface LayoutState {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
}

const AppLayout = ({
  children,
  className = '',
}: AppLayoutProps) => {
  const responsive = useResponsiveLayout();
  
  const [layoutState, setLayoutState] = useState<LayoutState>({
    sidebarCollapsed: false,
    mobileMenuOpen: false,
  });

  // Calculate sidebar margin for main content
  const sidebarMargin = responsive.lg && !layoutState.sidebarCollapsed ? 'ml-20' : 'ml-0';

  return (
    <div className={`min-h-screen flex bg-bg-primary ${className}`}>
      {/* Mobile Navigation */}
      {responsive.isMobile && (
        <MobileNavigation />
      )}
      
      {/* Desktop Sidebar */}
      {responsive.isDesktop && (
        <MergentaSidebar />
      )}
      
      {/* Main Content Area */}
      <div 
        className={`flex-1 ${sidebarMargin} flex flex-col relative transition-all duration-normal`}
      >
        {children}
      </div>
    </div>
  );
};

export default AppLayout;