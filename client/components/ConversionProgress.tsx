import { useEffect, useState } from 'react'
import { CheckCircle, Loader2, AlertCircle, Clock } from 'lucide-react'
import { MotionWrapper } from './ui/MotionWrapper'
import { ConversionStatus } from '../models/Conversion'
import { PDFConversionController } from '../controllers/PDFConversionController'

interface ConversionProgressProps {
  jobId: string
  onComplete?: (status: ConversionStatus) => void
  onError?: (error: string) => void
  className?: string
}

export function ConversionProgress({
  jobId,
  onComplete,
  onError,
  className = '',
}: ConversionProgressProps) {
  const [status, setStatus] = useState<ConversionStatus | null>(null)
  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    if (!jobId || !isPolling) return

    const pollInterval = setInterval(async () => {
      try {
        const currentStatus = await PDFConversionController.pollStatus(jobId, setStatus)

        if (currentStatus.status === 'completed') {
          setIsPolling(false)
          if (onComplete) {
            onComplete(currentStatus)
          }
        } else if (currentStatus.status === 'failed') {
          setIsPolling(false)
          if (onError) {
            onError(currentStatus.errorMessage || 'Conversion failed')
          }
        }
      } catch (error) {
        setIsPolling(false)
        if (onError) {
          onError(error instanceof Error ? error.message : 'Failed to get status')
        }
      }
    }, 2000) // Poll every 2 seconds

    // Initial poll
    PDFConversionController.pollStatus(jobId, setStatus).catch((error) => {
      setIsPolling(false)
      if (onError) {
        onError(error instanceof Error ? error.message : 'Failed to get status')
      }
    })

    return () => clearInterval(pollInterval)
  }, [jobId, isPolling, onComplete, onError])

  if (!status) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return <CheckCircle size={24} className="text-green-600" />
      case 'failed':
        return <AlertCircle size={24} className="text-red-600" />
      default:
        return <Loader2 size={24} className="animate-spin text-blue-600" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'completed':
        return 'bg-green-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-blue-500'
    }
  }

  const formatTime = (seconds?: number): string => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {status.status === 'completed'
              ? 'Conversion Complete!'
              : status.status === 'failed'
              ? 'Conversion Failed'
              : 'Converting PDF to Video'}
          </h3>
          <p className="text-sm text-gray-600">{status.currentStep}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(status.progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <MotionWrapper
            as="div"
            className={`h-full ${getStatusColor()} transition-all duration-300`}
            style={{ width: `${status.progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${status.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Status Details */}
      <div className="space-y-2 text-sm">
        {status.estimatedTimeRemaining && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} />
            <span>Estimated time remaining: {formatTime(status.estimatedTimeRemaining)}</span>
          </div>
        )}

        {status.errorMessage && (
          <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{status.errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  )
}

