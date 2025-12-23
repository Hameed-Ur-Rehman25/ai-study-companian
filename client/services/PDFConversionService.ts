import {
  PDFUploadResponse,
  PDFExtractionResponse,
  ConversionOptions,
  ConversionStatus,
  VideoMetadata
} from '../models/Conversion'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class PDFConversionService {
  /**
   * Upload PDF file to server
   */
  static async uploadPDF(file: File): Promise<PDFUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/api/pdf/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to upload PDF')
    }

    const data = await response.json()
    return {
      jobId: data.job_id,
      filename: data.filename,
      fileSize: data.file_size,
      status: data.status
    }
  }

  /**
   * Extract content from uploaded PDF
   */
  static async extractPDFContent(jobId: string): Promise<PDFExtractionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/pdf/extract?job_id=${jobId}`, {
      method: 'POST',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to extract PDF content')
    }

    const data = await response.json()
    return {
      jobId: data.job_id,
      totalPages: data.total_pages,
      pages: data.pages.map((page: any) => ({
        pageNum: page.page_num,
        text: page.text,
        images: page.images || [],
        title: page.title,
        bulletPoints: page.bullet_points || []
      })),
      status: 'extracted'
    }
  }

  /**
   * Start PDF to video conversion
   */
  static async convertToVideo(
    jobId: string,
    options: ConversionOptions = {}
  ): Promise<{ jobId: string; status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/pdf/convert-to-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_id: jobId,
        voice_id: options.voiceId || '21m00Tcm4TlvDq8ikWAM',
        video_quality: options.videoQuality || 'high',
        include_animations: options.includeAnimations !== false,
        include_transitions: options.includeTransitions !== false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to start conversion')
    }

    const data = await response.json()
    // Map snake_case response to camelCase
    return {
      jobId: data.job_id,
      status: data.status,
      message: data.message || 'Conversion started'
    }
  }

  /**
   * Get conversion status
   */
  static async getConversionStatus(jobId: string): Promise<ConversionStatus> {
    const response = await fetch(`${API_BASE_URL}/api/video/status/${jobId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to get conversion status')
    }

    const data = await response.json()
    return {
      jobId: data.job_id,
      status: data.status,
      progress: data.progress,
      currentStep: data.current_step,
      estimatedTimeRemaining: data.estimated_time_remaining,
      errorMessage: data.error_message,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  /**
   * Get video download URL
   */
  static getVideoDownloadUrl(jobId: string): string {
    return `${API_BASE_URL}/api/video/download/${jobId}`
  }

  /**
   * Get video preview URL
   */
  static async getVideoPreview(jobId: string): Promise<{ previewUrl: string; duration: number }> {
    const response = await fetch(`${API_BASE_URL}/api/video/preview/${jobId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to get video preview')
    }

    const data = await response.json()
    return {
      previewUrl: data.preview_url,
      duration: data.duration,
    }
  }
}

