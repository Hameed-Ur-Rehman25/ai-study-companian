// Ultra-safe motion wrapper - always uses fallbacks initially
import { ComponentType, forwardRef, useState, useEffect } from 'react'

let motionCache: any = null
let isClient = false

// Fallback components that never fail
const SafeDiv = forwardRef<HTMLDivElement, any>(({ children, className = '', ...props }, ref) => {
  // Remove all motion-specific props
  const {
    initial,
    animate,
    whileHover,
    whileTap,
    whileInView,
    transition,
    viewport,
    ...safeProps
  } = props as any
  
  return (
    <div ref={ref} className={className} {...safeProps}>
      {children}
    </div>
  )
})
SafeDiv.displayName = 'SafeDiv'

const SafeButton = forwardRef<HTMLButtonElement, any>(({ children, className = '', ...props }, ref) => {
  const {
    initial,
    animate,
    whileHover,
    whileTap,
    transition,
    ...safeProps
  } = props as any
  
  return (
    <button ref={ref} className={className} {...safeProps}>
      {children}
    </button>
  )
})
SafeButton.displayName = 'SafeButton'

const SafeSpan = forwardRef<HTMLSpanElement, any>(({ children, className = '', ...props }, ref) => {
  const {
    initial,
    animate,
    whileHover,
    whileTap,
    transition,
    ...safeProps
  } = props as any
  
  return (
    <span ref={ref} className={className} {...safeProps}>
      {children}
    </span>
  )
})
SafeSpan.displayName = 'SafeSpan'

// Hook to get motion components
export function useMotion() {
  const [motion, setMotion] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (motionCache) {
      setMotion(motionCache)
      setLoaded(true)
      return
    }

    // Try to load framer-motion
    import('framer-motion')
      .then((mod) => {
        if (mod && mod.motion) {
          motionCache = mod.motion
          setMotion(mod.motion)
          setLoaded(true)
        }
      })
      .catch(() => {
        // Fail silently
        setLoaded(true)
      })
  }, [])

  return { motion, loaded }
}

// Always-safe components
export const MotionDiv = SafeDiv
export const MotionButton = SafeButton
export const MotionSpan = SafeSpan

// Export motion getter
export function getMotion() {
  return motionCache
}

export const motionLoaded = false // Will be set dynamically

