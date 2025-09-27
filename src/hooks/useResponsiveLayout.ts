import { useState, useEffect } from 'react';

/**
 * Unified responsive breakpoint system
 * Matches design tokens breakpoints exactly
 */
export interface ResponsiveBreakpoints {
  xs: boolean;      // >= 480px
  sm: boolean;      // >= 640px  
  md: boolean;      // >= 768px
  lg: boolean;      // >= 1024px
  xl: boolean;      // >= 1280px
  '2xl': boolean;   // >= 1536px
}

export interface ResponsiveState extends ResponsiveBreakpoints {
  isMobile: boolean;    // < 768px
  isTablet: boolean;    // >= 768px && < 1024px
  isDesktop: boolean;   // >= 1024px
  width: number;
  height: number;
}

const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function useResponsiveLayout(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Server-safe defaults
    if (typeof window === 'undefined') {
      return {
        xs: false,
        sm: false,
        md: false,
        lg: false,
        xl: false,
        '2xl': false,
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 0,
        height: 0,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      xs: width >= BREAKPOINTS.xs,
      sm: width >= BREAKPOINTS.sm,
      md: width >= BREAKPOINTS.md,
      lg: width >= BREAKPOINTS.lg,
      xl: width >= BREAKPOINTS.xl,
      '2xl': width >= BREAKPOINTS['2xl'],
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      width,
      height,
    };
  });

  useEffect(() => {
    let timeoutId: number;

    const updateState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setState({
        xs: width >= BREAKPOINTS.xs,
        sm: width >= BREAKPOINTS.sm,
        md: width >= BREAKPOINTS.md,
        lg: width >= BREAKPOINTS.lg,
        xl: width >= BREAKPOINTS.xl,
        '2xl': width >= BREAKPOINTS['2xl'],
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
        width,
        height,
      });
    };

    const handleResize = () => {
      // Debounce resize events for performance
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateState, 150);
    };

    // Initial measurement
    updateState();

    // Add resize listener
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
}

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useResponsiveLayout instead
 */
export function useIsMobile(): boolean {
  const { isMobile } = useResponsiveLayout();
  return isMobile;
}