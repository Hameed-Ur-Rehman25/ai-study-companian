export interface PDFFile {
  name: string
  size: number
  type: string
  file?: File
}

export interface ConversionOptions {
  voiceName?: string
  languageCode?: string
  speakingRate?: number
  pitch?: number
  videoQuality?: 'low' | 'medium' | 'high'
  includeAnimations?: boolean
  includeTransitions?: boolean
}

export interface ConversionStatus {
  jobId: string
  status: 'pending' | 'uploading' | 'extracting' | 'generating_audio' | 'creating_video' | 'completed' | 'failed'
  progress: number
  currentStep: string
  estimatedTimeRemaining?: number
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface VideoMetadata {
  jobId: string
  videoUrl: string
  videoSize: number
  duration: number
  format: string
  createdAt: string
}

export interface PDFUploadResponse {
  jobId: string
  filename: string
  fileSize: number
  status: string
}

export interface PDFExtractionResponse {
  jobId: string
  totalPages: number
  pages: Array<{
    pageNum: number
    text: string
    images: string[]
    duration?: number
    title?: string
    bulletPoints: string[]
  }>
  status: string
}

