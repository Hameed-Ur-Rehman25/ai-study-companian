import { PDFConversionService } from '../services/PDFConversionService'
import {
  PDFFile,
  ConversionOptions,
  ConversionStatus,
  PDFUploadResponse,
  PDFExtractionResponse
} from '../models/Conversion'

/**
 * Controller for PDF to Video conversion
 * Handles business logic and coordinates between services and views
 */
export class PDFConversionController {
  /**
   * Upload PDF file
   */
  static async uploadPDF(file: File): Promise<PDFUploadResponse> {
    // Validate file
    if (!file.type.includes('pdf')) {
      throw new Error('File must be a PDF')
    }

    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum of ${maxSize / 1024 / 1024}MB`)
    }

    return PDFConversionService.uploadPDF(file)
  }

  /**
   * Extract content from PDF
   */
  static async extractContent(jobId: string): Promise<PDFExtractionResponse> {
    return PDFConversionService.extractPDFContent(jobId)
  }

  /**
   * Start conversion process
   */
  static async startConversion(
    jobId: string,
    options: ConversionOptions = {}
  ): Promise<{ jobId: string; status: string }> {
    const result = await PDFConversionService.convertToVideo(jobId, options)
    return {
      jobId: result.jobId,
      status: result.status,
    }
  }

  /**
   * Poll for conversion status
   */
  static async pollStatus(
    jobId: string,
    onUpdate?: (status: ConversionStatus) => void
  ): Promise<ConversionStatus> {
    const status = await PDFConversionService.getConversionStatus(jobId)
    
    if (onUpdate) {
      onUpdate(status)
    }

    return status
  }

  /**
   * Get video download URL
   */
  static getDownloadUrl(jobId: string): string {
    return PDFConversionService.getVideoDownloadUrl(jobId)
  }
}

