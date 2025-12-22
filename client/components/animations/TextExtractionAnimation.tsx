import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

interface TextExtractionAnimationProps {
    size?: number
    className?: string
}

export const TextExtractionAnimation: React.FC<TextExtractionAnimationProps> = ({
    size = 200,
    className = ''
}) => {
    const [animationData, setAnimationData] = useState<any>(null)

    useEffect(() => {
        // Fetch the animation from LottieFiles
        fetch('https://lottie.host/3ea9c7e6-f6a0-4844-ba1e-ea283d1b6fb4/vhHWWKb0RN.json')
            .then(response => response.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error('Failed to load animation:', err))
    }, [])

    if (!animationData) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    )
}
