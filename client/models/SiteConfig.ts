export interface SiteConfig {
  siteUrl: string
  siteName: string
  defaultDescription: string
  themeColor: string
}

export const defaultSiteConfig: SiteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-study-companion.com',
  siteName: 'AI Study Companion - PDF AI Studio',
  defaultDescription: 'Transform your PDFs with cutting-edge AI technology. Create engaging video lectures, chat with documents, get instant summaries, and unlock the full potential of your PDFs with our AI-powered platform.',
  themeColor: '#2563eb'
}

