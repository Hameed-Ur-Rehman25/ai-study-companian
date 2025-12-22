import React from 'react'
import { FileUploadAnimation } from './FileUploadAnimation'
import { TextExtractionAnimation } from './TextExtractionAnimation'

type ProcessStage = 'uploading' | 'extracting' | 'processing'

interface ProcessingAnimationProps {
    stage: ProcessStage
    fileName?: string
    progress?: number
    className?: string
}

export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({
    stage,
    fileName,
    progress = 0,
    className = ''
}) => {
    const getStageInfo = () => {
        switch (stage) {
            case 'uploading':
                return {
                    title: 'Uploading Your PDF',
                    description: 'Securely transferring your document...',
                    animation: <FileUploadAnimation size={180} />,
                    bgGradient: 'from-blue-50 to-blue-100',
                    textColor: 'text-blue-900',
                    descColor: 'text-blue-700',
                    progressGradient: 'from-blue-500 to-blue-600'
                }
            case 'extracting':
                return {
                    title: 'Extracting Text',
                    description: 'Reading and analyzing your document...',
                    animation: <TextExtractionAnimation size={180} />,
                    bgGradient: 'from-emerald-50 to-emerald-100',
                    textColor: 'text-emerald-900',
                    descColor: 'text-emerald-700',
                    progressGradient: 'from-emerald-500 to-emerald-600'
                }
            case 'processing':
                return {
                    title: 'Processing Content',
                    description: 'Preparing AI-powered insights...',
                    animation: <TextExtractionAnimation size={180} />,
                    bgGradient: 'from-purple-50 to-purple-100',
                    textColor: 'text-purple-900',
                    descColor: 'text-purple-700',
                    progressGradient: 'from-purple-500 to-purple-600'
                }
        }
    }

    const stageInfo = getStageInfo()

    return (
        <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ${className}`}>
            {/* Animated gradient background */}
            <div className={`relative bg-gradient-to-br ${stageInfo.bgGradient} px-8 py-12`}>
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                {/* Animation */}
                <div className="relative z-10 flex flex-col items-center">
                    {stageInfo.animation}

                    {/* Stage title */}
                    <h3 className={`text-2xl font-bold ${stageInfo.textColor} mt-6 mb-2 text-center`}>
                        {stageInfo.title}
                    </h3>

                    {/* Description */}
                    <p className={`${stageInfo.descColor} text-center mb-6`}>
                        {stageInfo.description}
                    </p>

                    {/* File name */}
                    {fileName && (
                        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-700 font-medium truncate max-w-xs">
                                📄 {fileName}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress section */}
            <div className="px-8 py-6 bg-white">
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${stageInfo.progressGradient} rounded-full transition-all duration-500 ease-out relative`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                </div>

                {/* Stage indicators */}
                <div className="flex justify-between items-center text-xs">
                    <div className={`flex items-center gap-2 transition-all ${stage === 'uploading' ? 'text-blue-600 font-semibold scale-110' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full transition-all ${stage === 'uploading' ? 'bg-blue-600 animate-pulse shadow-lg shadow-blue-400/50' : 'bg-gray-300'}`}></div>
                        Upload
                    </div>
                    <div className={`flex items-center gap-2 transition-all ${stage === 'extracting' ? 'text-emerald-600 font-semibold scale-110' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full transition-all ${stage === 'extracting' ? 'bg-emerald-600 animate-pulse shadow-lg shadow-emerald-400/50' : 'bg-gray-300'}`}></div>
                        Extract
                    </div>
                    <div className={`flex items-center gap-2 transition-all ${stage === 'processing' ? 'text-purple-600 font-semibold scale-110' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full transition-all ${stage === 'processing' ? 'bg-purple-600 animate-pulse shadow-lg shadow-purple-400/50' : 'bg-gray-300'}`}></div>
                        Process
                    </div>
                </div>

                {/* Progress percentage */}
                <div className="text-center mt-3 text-sm font-semibold text-gray-700">
                    {Math.round(progress)}%
                </div>
            </div>

            <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
        </div>
    )
}
