// Hydration-safe motion wrapper
import { useState, useEffect, forwardRef } from 'react'

interface MotionWrapperProps {
  children: React.ReactNode
  className?: string
  initial?: any
  animate?: any
  whileHover?: any
  whileTap?: any
  whileInView?: any
  transition?: any
  viewport?: any
  as?: keyof JSX.IntrinsicElements
  [key: string]: any
}

export const MotionWrapper = forwardRef<HTMLElement, MotionWrapperProps>(
  ({ children, className = '', as = 'div', ...props }, ref) => {
    const [mounted, setMounted] = useState(false)
    const [motion, setMotion] = useState<any>(null)

    useEffect(() => {
      // Only run on client after mount (post-hydration)
      setMounted(true)
      
      // Load motion after hydration
      import('framer-motion')
        .then((mod) => {
          // framer-motion exports motion as a named export
          const motionExport = mod?.motion || mod?.default?.motion
          
          if (motionExport && typeof motionExport === 'object' && motionExport !== null) {
            // Verify motion has the expected structure (has div, button, or span)
            if (motionExport.div || motionExport.button || motionExport.span) {
              setMotion(motionExport)
            } else {
              console.warn('framer-motion loaded but missing expected components')
            }
          } else {
            console.warn('framer-motion motion export is invalid:', motionExport)
          }
        })
        .catch((err) => {
          // Silently fail
          console.warn('Failed to load framer-motion:', err)
        })
    }, [])

    // Extract motion props
    const {
      initial,
      animate,
      whileHover,
      whileTap,
      whileInView,
      transition,
      viewport,
      ...restProps
    } = props

    // Only use motion props after hydration and motion is loaded
    const motionProps = mounted && motion ? {
      initial,
      animate,
      whileHover,
      whileTap,
      whileInView,
      transition,
      viewport,
    } : {}

    // Always render the same on server and initial client render
    if (mounted && motion && typeof motion === 'object' && motion !== null) {
      try {
        const motionObj = motion as any
        
        // framer-motion supports motion.div, motion.button, motion.span, etc.
        // For elements that don't have a direct motion component, use motion.div
        const supportedElements = ['div', 'span', 'button', 'a', 'section', 'article', 'header', 'footer', 'nav', 'main']
        const hasDirectSupport = supportedElements.includes(as as string)
        
        // Get the motion component - prefer direct support, fallback to div
        let MotionComponent = hasDirectSupport ? motionObj[as] : null
        if (!MotionComponent || typeof MotionComponent !== 'function') {
          MotionComponent = motionObj.div
        }
        
        // Verify it's a valid React component before using
        if (MotionComponent && typeof MotionComponent === 'function' && MotionComponent !== null) {
          // Use motion.div with custom component prop for unsupported elements
          if (!hasDirectSupport && as !== 'div') {
            return (
              <MotionComponent
                ref={ref}
                component={as}
                className={className}
                {...motionProps}
                {...restProps}
              >
                {children}
              </MotionComponent>
            )
          } else {
            return (
              <MotionComponent
                ref={ref}
                className={className}
                {...motionProps}
                {...restProps}
              >
                {children}
              </MotionComponent>
            )
          }
        }
      } catch (e) {
        // If motion component fails, fall through to fallback
        console.warn('Motion component failed, using fallback:', e)
      }
    }

    // Fallback - same render on server and client (no motion)
    const Component = as
    return (
      <Component ref={ref as any} className={className} {...restProps}>
        {children}
      </Component>
    )
  }
)

MotionWrapper.displayName = 'MotionWrapper'

