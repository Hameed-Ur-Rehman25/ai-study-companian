// Safe motion wrapper that works even if framer-motion is not available
import { ComponentType, forwardRef } from 'react'

let motion: any = null
let motionLoaded = false
let motionLoading = false

// Function to load motion only on client side
function loadMotion() {
  if (motionLoaded || motionLoading || typeof window === 'undefined') {
    return
  }
  
  motionLoading = true
  
  try {
    // Try to require framer-motion
    const framerMotion = require('framer-motion')
    if (framerMotion && framerMotion.motion) {
      motion = framerMotion.motion
      motionLoaded = true
    }
  } catch (e) {
    // Silently fail - will use fallbacks
    motionLoaded = false
  } finally {
    motionLoading = false
  }
}

// Try to load on module load (client side only)
if (typeof window !== 'undefined') {
  loadMotion()
}

// Fallback components
const FallbackDiv = forwardRef<HTMLDivElement, any>(({ children, className, ...props }, ref) => {
  // Filter out motion-specific props
  const { initial, animate, whileHover, whileTap, transition, viewport, ...restProps } = props as any
  return (
    <div ref={ref} className={className} {...restProps}>
      {children}
    </div>
  )
})
FallbackDiv.displayName = 'FallbackDiv'

const FallbackButton = forwardRef<HTMLButtonElement, any>(({ children, className, ...props }, ref) => {
  const { initial, animate, whileHover, whileTap, transition, ...restProps } = props as any
  return (
    <button ref={ref} className={className} {...restProps}>
      {children}
    </button>
  )
})
FallbackButton.displayName = 'FallbackButton'

const FallbackSpan = forwardRef<HTMLSpanElement, any>(({ children, className, ...props }, ref) => {
  const { initial, animate, whileHover, whileTap, transition, ...restProps } = props as any
  return (
    <span ref={ref} className={className} {...restProps}>
      {children}
    </span>
  )
})
FallbackSpan.displayName = 'FallbackSpan'

export const MotionDiv = motionLoaded && motion ? motion.div : FallbackDiv
export const MotionButton = motionLoaded && motion ? motion.button : FallbackButton
export const MotionSpan = motionLoaded && motion ? motion.span : FallbackSpan

export { motion, motionLoaded }

