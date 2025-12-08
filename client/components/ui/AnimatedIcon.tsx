import { ReactNode } from 'react'
import { MotionWrapper } from './MotionWrapper'

interface AnimatedIconProps {
  children: ReactNode
  className?: string
  delay?: number
  hoverScale?: number
}

export function AnimatedIcon({ 
  children, 
  className = '', 
  delay = 0,
  hoverScale = 1.2 
}: AnimatedIconProps) {
  return (
    <MotionWrapper
      as="div"
      className={className}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      whileHover={{
        scale: hoverScale,
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 },
      }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </MotionWrapper>
  )
}

