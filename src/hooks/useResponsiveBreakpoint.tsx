import * as React from "react"

// Tailwind breakpoints - matches Tailwind exactly
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export function useResponsiveBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<Breakpoint>(() => {
    // Initialize with proper value on first render
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if (width >= breakpoints['2xl']) return '2xl'
      if (width >= breakpoints.xl) return 'xl'
      if (width >= breakpoints.lg) return 'lg'
      if (width >= breakpoints.md) return 'md'
      if (width >= breakpoints.sm) return 'sm'
      return 'xs'
    }
    return 'lg'
  })

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      let newBreakpoint: Breakpoint
      
      if (width >= breakpoints['2xl']) {
        newBreakpoint = '2xl'
      } else if (width >= breakpoints.xl) {
        newBreakpoint = 'xl'
      } else if (width >= breakpoints.lg) {
        newBreakpoint = 'lg'
      } else if (width >= breakpoints.md) {
        newBreakpoint = 'md'
      } else if (width >= breakpoints.sm) {
        newBreakpoint = 'sm'
      } else {
        newBreakpoint = 'xs'
      }

      setCurrentBreakpoint(prev => prev !== newBreakpoint ? newBreakpoint : prev)
    }

    // Set initial value
    updateBreakpoint()

    // Listen for changes
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return currentBreakpoint
}

// Unified responsive hooks - consistent with Tailwind breakpoints
export function useIsMobile() {
  const breakpoint = useResponsiveBreakpoint()
  return breakpoint === 'xs' || breakpoint === 'sm'
}

export function useIsTablet() {
  const breakpoint = useResponsiveBreakpoint()
  return breakpoint === 'md'
}

export function useIsDesktop() {
  const breakpoint = useResponsiveBreakpoint()
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'
}

// Additional responsive utilities
export function useScreenSize() {
  const breakpoint = useResponsiveBreakpoint()
  return {
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2Xl: breakpoint === '2xl',
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    breakpoint
  }
}