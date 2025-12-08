import { SEOData, StructuredData } from '../models/SEO'
import { SEOService } from '../services/SEOService'
import { ToolService } from '../services/ToolService'
import { Tool } from '../models/Tool'

/**
 * Controller for Home page
 * Handles business logic and data preparation for the homepage
 */
export class HomeController {
  /**
   * Get all data needed for the homepage
   */
  static getHomePageData() {
    const seoData = SEOService.getHomePageSEO()
    const structuredData = SEOService.generateStructuredData(
      seoData.title,
      seoData.description,
      seoData.canonical || '',
      [
        'PDF to Video Conversion',
        'Chat with PDF Documents',
        'AI-Powered Summaries',
        'Document Processing'
      ]
    )
    const tools = ToolService.getAllTools()

    return {
      seoData,
      structuredData,
      tools
    }
  }

  /**
   * Get tools data
   */
  static getTools(): Tool[] {
    return ToolService.getAllTools()
  }

  /**
   * Get featured tools
   */
  static getFeaturedTools(): Tool[] {
    return ToolService.getFeaturedTools()
  }
}

