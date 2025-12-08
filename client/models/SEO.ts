export interface SEOData {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  themeColor?: string
}

export interface StructuredData {
  '@context': string
  '@type': string
  name: string
  applicationCategory?: string
  description: string
  url: string
  offers?: {
    '@type': string
    price: string
    priceCurrency: string
  }
  aggregateRating?: {
    '@type': string
    ratingValue: string
    ratingCount: string
  }
  featureList?: string[]
  [key: string]: any
}

