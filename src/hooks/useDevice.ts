// src/hooks/useDevice.ts
import { useEffect, useState } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpointMap: Record<Breakpoint, number> = {
  xs: 0,
  sm: 480,
  md: 640,
  lg: 768,
  xl: 1024,
  '2xl': 1280,
};

export function getCurrentBreakpoint(width = typeof window !== 'undefined' ? window.innerWidth : 1024): Breakpoint {
  if (width >= breakpointMap['2xl']) return '2xl';
  if (width >= breakpointMap.xl) return 'xl';
  if (width >= breakpointMap.lg) return 'lg';
  if (width >= breakpointMap.md) return 'md';
  if (width >= breakpointMap.sm) return 'sm';
  return 'xs';
}

export function useBreakpoint() {
  const [bp, setBp] = useState<Breakpoint>(() => getCurrentBreakpoint());

  useEffect(() => {
    const handler = () => setBp(getCurrentBreakpoint(window.innerWidth));
    window.addEventListener('resize', handler);
    handler();
    return () => window.removeEventListener('resize', handler);
  }, []);

  return bp;
}

// Convenience boolean hooks
export function useIsMobile() {
  const bp = useBreakpoint();
  return bp === 'xs' || bp === 'sm' || bp === 'md';
}

export function useIsTablet() {
  const bp = useBreakpoint();
  return bp === 'lg';
}

export function useIsDesktop() {
  const bp = useBreakpoint();
  return bp === 'xl' || bp === '2xl';
}
