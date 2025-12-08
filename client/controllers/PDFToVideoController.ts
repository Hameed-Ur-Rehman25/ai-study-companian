import { SEOData } from '../models/SEO'
import { SEOService } from '../services/SEOService'
import { PDFToVideoService } from '../services/PDFToVideoService'
import { ToolFeature, ProcessStep } from '../models/Tool'

/**
 * Controller for PDF to Video page
 * Handles business logic and data preparation for the PDF to Video page
 */
export class PDFToVideoController {
  /**
   * Get all data needed for the PDF to Video page
   */
  static getPDFToVideoPageData() {
    const seoData = SEOService.getPDFToVideoSEO()
    const features = PDFToVideoService.getFeatures()
    const steps = PDFToVideoService.getProcessSteps()

    return {
      seoData,
      features,
      steps
    }
  }

  /**
   * Get features for PDF to Video
   */
  static getFeatures(): ToolFeature[] {
    return PDFToVideoService.getFeatures()
  }

  /**
   * Get process steps
   */
  static getProcessSteps(): ProcessStep[] {
    return PDFToVideoService.getProcessSteps()
  }
}

