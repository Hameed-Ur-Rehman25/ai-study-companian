
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'
import { HeroSection } from '../components/HeroSection'
import { PopularTools } from '../components/PopularTools'
import { FeaturesSection } from '../components/FeaturesSection'
import { Testimonials } from '../components/Testimonials'
import { FAQ } from '../components/FAQ'
import { Pricing } from '../components/Pricing'
import { Footer } from '../components/Footer'
import { HomeController } from '../controllers/HomeController'

const Home: NextPage = () => {
    // Use controller to get page data (MVC pattern)
    const { seoData, structuredData, tools } = HomeController.getHomePageData()

    return (
        <>
            <Head>
                {/* Primary Meta Tags */}
                <title>{seoData.title}</title>
                <meta name="title" content={seoData.title} />
                <meta name="description" content={seoData.description} />
                {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
                <meta name="author" content="AI Study Companion" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <link rel="icon" href="/favicon.ico" />
                {seoData.canonical && <link rel="canonical" href={seoData.canonical} />}

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                {seoData.ogUrl && <meta property="og:url" content={seoData.ogUrl} />}
                {seoData.ogTitle && <meta property="og:title" content={seoData.ogTitle} />}
                {seoData.ogDescription && <meta property="og:description" content={seoData.ogDescription} />}
                {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
                <meta property="og:site_name" content={seoData.title} />
                <meta property="og:locale" content="en_US" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                {seoData.ogUrl && <meta name="twitter:url" content={seoData.ogUrl} />}
                {seoData.twitterTitle && <meta name="twitter:title" content={seoData.twitterTitle} />}
                {seoData.twitterDescription && <meta name="twitter:description" content={seoData.twitterDescription} />}
                {seoData.twitterImage && <meta name="twitter:image" content={seoData.twitterImage} />}

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>
            <div className="min-h-screen bg-gray-50 scroll-smooth">
                <Header />
                <main>
                    <HeroSection />

                    {/* Features Section (Bento Grid) */}
                    <div id="features">
                        <FeaturesSection />
                    </div>

                    {/* Popular Tools */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <PopularTools tools={tools} />
                    </div>

                    {/* Testimonials */}
                    <Testimonials />

                    <div id="pricing" className="bg-gray-50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                            <Pricing />
                        </div>
                    </div>

                    <div id="faq" className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-20">
                        <FAQ />
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}

export default Home
