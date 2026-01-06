import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'
import { PDFUpload } from '../components/PDFUpload'
import { ConversionProgress } from '../components/ConversionProgress'
import { VideoPreview } from '../components/VideoPreview'
import { ProcessingAnimation } from '../components/animations/ProcessingAnimation'
import { ContentPreview } from '../components/ContentPreview'
import { RemotionPlayer } from '../components/RemotionPlayer'
import { PDFConversionController } from '../controllers/PDFConversionController'
import { PDFFile, ConversionOptions, ConversionStatus, PDFExtractionResponse } from '../models/Conversion'
import { Settings, Play, CheckCircle, Upload, ChevronLeft } from 'lucide-react'
import { MotionWrapper } from '../components/ui/MotionWrapper'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

type ProcessStage = 'uploading' | 'extracting' | 'processing' | null

const PDFToVideo: NextPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  // State from convert.tsx
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [processingStage, setProcessingStage] = useState<ProcessStage>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus | null>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState<ConversionOptions>({
    voiceId: 'en',
    videoQuality: 'high',
    includeAnimations: true,
    includeTransitions: true,
  })
  const [error, setError] = useState<string | null>(null)
  const [extractedContent, setExtractedContent] = useState<PDFExtractionResponse | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  // Auth Protection
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/pdf-to-video')
    }
  }, [user, loading, router])

  const handleSelectVideo = (selectedJobId: string) => {
    if (selectedJobId === 'new') {
      // Reset everything
      setSelectedFile(null)
      setJobId(null)
      setExtractedContent(null)
      setVideoReady(false)
      setShowPreview(false)
      setConversionStatus(null)
      return
    }
    // For now we don't have an endpoint to fetch full state of an old job
    // Ideally we would fetch the job state and status here
    // For MVP, just setting the ID might show the "Video Preview" if we check status
    // But since we can't fully rebuild the state without an API, we will leave as placeholder
    console.log("Selected job:", selectedJobId)
  }

  const handleFileSelect = (file: PDFFile) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile?.file) {
      setError('Please select a PDF file')
      return
    }

    try {
      setIsUploading(true)
      setError(null)
      setProcessingStage('uploading')
      setProcessingProgress(10)

      const response = await PDFConversionController.uploadPDF(selectedFile.file)
      setJobId(response.jobId)

      // Save to local history (simple hack for now)
      const existingJobs = JSON.parse(localStorage.getItem('pdf_video_jobs') || '[]')
      const newJob = {
        job_id: response.jobId,
        pdf_filename: selectedFile.file.name,
        status: 'processing',
        created_at: new Date().toISOString()
      }
      localStorage.setItem('pdf_video_jobs', JSON.stringify([...existingJobs, newJob]))
      window.dispatchEvent(new Event('jobStarted'))

      setProcessingProgress(40)
      setProcessingStage('extracting')
      setProcessingProgress(50)

      const extraction = await PDFConversionController.extractContent(response.jobId)
      setProcessingProgress(100)
      setExtractedContent(extraction)

      setTimeout(() => {
        setProcessingStage(null)
        setProcessingProgress(0)
        setShowPreview(true)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload PDF')
      setProcessingStage(null)
      setProcessingProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleStartGeneration = async () => {
    setShowPreview(false)
    setVideoReady(true)
  }

  return (
    <>
      <Head>
        <title>PDF to Video Studio - AI Study Companion</title>
      </Head>

      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Main Content Area - Full Width No Sidebar */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header className="bg-white border-b border-gray-200 sticky top-0 z-30" />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
              {!jobId ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                  <MotionWrapper
                    as="div"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl"
                  >
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                      Turn PDFs into Video Lectures
                    </h1>
                    <p className="text-xl text-gray-600 mb-12">
                      Upload your lecture notes, research papers, or textbooks and let AI transform them into engaging video lessons.
                    </p>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                      <PDFUpload onFileSelect={handleFileSelect} />

                      {selectedFile && !isUploading && (
                        <button
                          onClick={handleUpload}
                          className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <Upload size={24} />
                          Start Transformation
                        </button>
                      )}

                      {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                          {error}
                        </div>
                      )}
                    </div>
                  </MotionWrapper>
                </div>
              ) : (
                // Processing / Preview View
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={() => handleSelectVideo('new')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={24} className="text-gray-500" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedFile?.file?.name || 'Project'}
                      </h2>
                      <p className="text-sm text-gray-500">
                        ID: {jobId}
                      </p>
                    </div>
                  </div>

                  {/* Processing States */}
                  {isUploading && processingStage && (
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
                      <ProcessingAnimation
                        stage={processingStage}
                        progress={processingProgress}
                        fileName={selectedFile?.file?.name}
                      />
                    </div>
                  )}

                  {/* Content Preview */}
                  {showPreview && extractedContent && (
                    <ContentPreview
                      pages={extractedContent.pages}
                      totalPages={extractedContent.totalPages}
                      jobId={jobId}
                      onGenerate={handleStartGeneration}
                      onCancel={() => handleSelectVideo('new')}
                    />
                  )}

                  {/* Final Video Player */}
                  {videoReady && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                      <RemotionPlayer jobId={jobId} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default PDFToVideo

