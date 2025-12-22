import { useState, useEffect, useRef } from 'react'
import { Download, Play, Pause, Loader2, AlertCircle } from 'lucide-react'
import { MotionWrapper } from './ui/MotionWrapper'
import { PDFConversionController } from '../controllers/PDFConversionController'

interface VideoPreviewProps {
  jobId: string
  className?: string
}

export function VideoPreview({ jobId, className = '' }: VideoPreviewProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true)
        const url = PDFConversionController.getDownloadUrl(jobId)
        setVideoUrl(url)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video')
      } finally {
        setIsLoading(false)
      }
    }

    if (jobId) {
      loadVideo()
    }
  }, [jobId])

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a')
      link.href = videoUrl
      link.download = `video_${jobId}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-12 bg-gray-50 rounded-xl ${className}`}>
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading video...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle size={24} />
          <div>
            <h3 className="font-semibold mb-1">Error Loading Video</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!videoUrl) {
    return null
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Video Player */}
      <div className="relative bg-black">
        <video
          ref={(el) => {
            videoRef.current = el
            if (el) {
              el.addEventListener('play', () => setIsPlaying(true))
              el.addEventListener('pause', () => setIsPlaying(false))
            }
          }}
          src={videoUrl}
          className="w-full h-auto max-h-[600px]"
          controls
        />

        {/* Play/Pause Overlay Button (optional) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!isPlaying && (
            <MotionWrapper
              as="button"
              onClick={handlePlayPause}
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center pointer-events-auto hover:bg-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play size={32} className="text-gray-900 ml-1" fill="currentColor" />
            </MotionWrapper>
          )}
        </div>
      </div>

      {/* Video Actions */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Video is Ready!</h3>
            <p className="text-sm text-gray-600">Download your video lecture</p>
          </div>
          <MotionWrapper
            as="button"
            onClick={handleDownload}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={20} />
            <span className="hidden sm:inline">Download</span>
          </MotionWrapper>
        </div>
      </div>
    </div>
  )
}

