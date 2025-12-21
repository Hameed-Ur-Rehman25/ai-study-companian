import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Video } from 'lucide-react'
import { MotionWrapper } from '../components/ui/MotionWrapper'
import { PDFToVideoController } from '../controllers/PDFToVideoController'

const PDFToVideo: NextPage = () => {
  // Use controller to get page data (MVC pattern)
  const { seoData, features, steps } = PDFToVideoController.getPDFToVideoPageData()

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        {seoData.canonical && <link rel="canonical" href={seoData.canonical} />}
        
        {/* Open Graph */}
        {seoData.ogTitle && <meta property="og:title" content={seoData.ogTitle} />}
        {seoData.ogDescription && <meta property="og:description" content={seoData.ogDescription} />}
        {seoData.ogUrl && <meta property="og:url" content={seoData.ogUrl} />}
        
        {/* Twitter */}
        {seoData.twitterTitle && <meta name="twitter:title" content={seoData.twitterTitle} />}
        {seoData.twitterDescription && <meta name="twitter:description" content={seoData.twitterDescription} />}
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <MotionWrapper
              as="div"
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                <Video size={40} className="sm:w-12 sm:h-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                PDF to Video Lectures
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-8">
                Transform your PDF documents into engaging video lectures with AI-powered narration
              </p>
              <Link href="/pdf-to-video/convert">
                <MotionWrapper
                  as="button"
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </MotionWrapper>
              </Link>
            </MotionWrapper>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16">
          {/* Features Section */}
          <section className="mb-16">
            <MotionWrapper
              as="div"
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to create professional video lectures from your PDFs
              </p>
            </MotionWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <MotionWrapper
                  key={feature.title}
                  as="div"
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </MotionWrapper>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-16">
            <MotionWrapper
              as="div"
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Convert your PDFs to video in just a few simple steps
              </p>
            </MotionWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <MotionWrapper
                  key={step.number}
                  as="div"
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                        {step.number}
                      </div>
                      <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <step.icon size={20} className="text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-blue-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </MotionWrapper>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-white text-center">
            <MotionWrapper
              as="div"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Ready to Transform Your PDFs?
              </h2>
              <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Start creating engaging video lectures from your documents today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MotionWrapper
                  as="button"
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Free Trial
                </MotionWrapper>
                <Link href="/">
                  <MotionWrapper
                    as="button"
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </MotionWrapper>
                </Link>
              </div>
            </MotionWrapper>
          </section>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default PDFToVideo

