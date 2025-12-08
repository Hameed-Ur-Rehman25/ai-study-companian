import { SEOData, StructuredData } from '../models/SEO'
import { defaultSiteConfig } from '../models/SiteConfig'

/**
 * Service for managing SEO data and structured data
 */
export class SEOService {
  /**
   * Generate structured data for software application
   */
  static generateStructuredData(
    name: string,
    description: string,
    url: string,
    features?: string[]
  ): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name,
      applicationCategory: 'EducationalApplication',
      description,
      url,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '50000'
      },
      featureList: features || [
        'PDF to Video Conversion',
        'Chat with PDF Documents',
        'AI-Powered Summaries',
        'Document Processing'
      ]
    }
  }

  /**
   * Get default SEO data for homepage
   */
  static getHomePageSEO(): SEOData {
    return {
      title: defaultSiteConfig.siteName,
      description: defaultSiteConfig.defaultDescription,
      keywords: 'PDF AI, PDF to video, chat with PDF, PDF summarizer, AI study companion, document processing, PDF tools, AI learning',
      canonical: defaultSiteConfig.siteUrl,
      ogTitle: defaultSiteConfig.siteName,
      ogDescription: defaultSiteConfig.defaultDescription,
      ogImage: `${defaultSiteConfig.siteUrl}/og-image.jpg`,
      ogUrl: defaultSiteConfig.siteUrl,
      twitterTitle: defaultSiteConfig.siteName,
      twitterDescription: defaultSiteConfig.defaultDescription,
      twitterImage: `${defaultSiteConfig.siteUrl}/og-image.jpg`,
      themeColor: defaultSiteConfig.themeColor
    }
  }

  /**
   * Get SEO data for PDF to Video page
   */
  static getPDFToVideoSEO(): SEOData {
    return {
      title: 'PDF to Video Lectures - AI Study Companion',
      description: 'Convert your PDF documents into engaging video lectures with AI narration. Transform your study materials into interactive video content.',
      keywords: 'PDF to video, video lectures, AI narration, convert PDF to video, educational videos',
      canonical: `${defaultSiteConfig.siteUrl}/pdf-to-video`,
      ogTitle: 'PDF to Video Lectures - AI Study Companion',
      ogDescription: 'Convert your PDF documents into engaging video lectures with AI narration. Transform your study materials into interactive video content.',
      ogUrl: `${defaultSiteConfig.siteUrl}/pdf-to-video`,
      twitterTitle: 'PDF to Video Lectures - AI Study Companion',
      twitterDescription: 'Convert your PDF documents into engaging video lectures with AI narration. Transform your study materials into interactive video content.'
    }
  }
}

