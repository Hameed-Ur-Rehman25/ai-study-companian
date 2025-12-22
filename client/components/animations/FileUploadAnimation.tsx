import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

interface FileUploadAnimationProps {
    size?: number
    className?: string
}

export const FileUploadAnimation: React.FC<FileUploadAnimationProps> = ({
    size = 200,
    className = ''
}) => {
    const [animationData, setAnimationData] = useState<any>(null)

    useEffect(() => {
        // Fetch the animation from LottieFiles
        fetch('https://lottie.host/f02df619-aad2-4a89-9fc7-2fa0d4fe8486/fmRGi65g4H.json')
            .then(response => response.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error('Failed to load animation:', err))
    }, [])

    if (!animationData) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
