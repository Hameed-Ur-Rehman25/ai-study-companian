import { useEffect, useRef } from 'react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  options?: {
    max?: number
    perspective?: number
    scale?: number
    speed?: number
    transition?: boolean
  }
}

export function TiltCard({ children, className = '', options }: TiltCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tiltRef.current || typeof window === 'undefined') return

    let tiltInstance: any = null

    // Dynamically import vanilla-tilt only on client side
    import('vanilla-tilt')
      .then((module) => {
        if (!tiltRef.current) return
        
        const VanillaTilt = module.default || module
        if (VanillaTilt && typeof VanillaTilt.init === 'function') {
          tiltInstance = VanillaTilt.init(tiltRef.current, {
            max: options?.max ?? 15,
            perspective: options?.perspective ?? 1000,
            scale: options?.scale ?? 1.05,
            speed: options?.speed ?? 1000,
            transition: options?.transition ?? true,
            glare: true,
            'max-glare': 0.2,
          })
        }
      })
      .catch(() => {
        // Silently fail if vanilla-tilt is not available
        // Component will still render without tilt effect
      })

    return () => {
      if (tiltInstance && typeof tiltInstance.destroy === 'function') {
        try {
          tiltInstance.destroy()
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [options])

  return (
    <div ref={tiltRef} className={`${className} transition-transform duration-300 hover:scale-105`}>
      {children}
    </div>
  )
}

