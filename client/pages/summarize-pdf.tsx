import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PDFUpload } from '../components/PDFUpload'
import { PDFConversionController } from '../controllers/PDFConversionController'
import { PDFFile } from '../models/Conversion'
import { Sparkles, RefreshCw, FileText, AlignLeft, BookOpen } from 'lucide-react'
import { MotionWrapper } from '../components/ui/MotionWrapper'
import { ProcessingAnimation } from '../components/animations/ProcessingAnimation'
import { API_BASE_URL } from '../config/api'
import ReactMarkdown from 'react-markdown'

type ProcessStage = 'uploading' | 'extracting' | 'processing' | null
type SummaryLength = 'brief' | 'standard' | 'detailed'

const SummarizePDF: NextPage = () => {
    const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
    const [jobId, setJobId] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isSummarizing, setIsSummarizing] = useState(false)
    const [processingStage, setProcessingStage] = useState<ProcessStage>(null)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [summaryLength, setSummaryLength] = useState<SummaryLength>('standard')
    const [summary, setSummary] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileSelect = (file: PDFFile) => {
        setSelectedFile(file)
        setError(null)
        setSummary(null)
    }

    const handleUploadAndSummarize = async () => {
        if (!selectedFile?.file) {
            setError('Please select a PDF file')
            return
        }

        try {
            setIsUploading(true)
            setError(null)

            // Stage 1: Uploading
            setProcessingStage('uploading')
            setProcessingProgress(10)

            // 1. Upload
            const response = await PDFConversionController.uploadPDF(selectedFile.file)
            const newJobId = response.jobId
            setJobId(newJobId)

            setProcessingProgress(35)

            // Stage 2: Extracting
            setProcessingStage('extracting')
            setProcessingProgress(40)

            // 2. Extract
            await PDFConversionController.extractContent(newJobId)

            setIsUploading(false)
            setIsSummarizing(true)

            setProcessingProgress(65)

            // Stage 3: Processing (Summarizing)
            setProcessingStage('processing')
            setProcessingProgress(70)

            // 3. Summarize
            const summaryResponse = await fetch(`${API_BASE_URL}/api/ai/summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_id: newJobId,
                    length: summaryLength
                }),
            })

            if (!summaryResponse.ok) {
                throw new Error('Failed to generate summary')
            }

            setProcessingProgress(95)

            const data = await summaryResponse.json()
            setSummary(data.summary)

            setProcessingProgress(100)

            // Small delay to show 100% completion
            await new Promise(resolve => setTimeout(resolve, 500))

            // Clear processing stage
            setProcessingStage(null)
            setProcessingProgress(0)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process PDF')
            setIsUploading(false)
            setProcessingStage(null)
            setProcessingProgress(0)
        } finally {
            setIsSummarizing(false)
        }
    }

    const reset = () => {
        setSelectedFile(null)
        setJobId(null)
        setSummary(null)
        setError(null)
    }

    return (
        <>
            <Head>
                <title>Summarize PDF - AI Study Companion</title>
                <meta name="description" content="Get AI-powered summaries of your PDF documents in seconds" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
                    {!summary ? (
                        <div className="max-w-2xl mx-auto">
                            {processingStage ? (
                                // Show processing animation
                                <MotionWrapper
                                    as="div"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProcessingAnimation
                                        stage={processingStage}
                                        fileName={selectedFile?.file?.name}
                                        progress={processingProgress}
                                    />
                                </MotionWrapper>
                            ) : (
                                <>
                                    <MotionWrapper
                                        as="div"
                                        className="text-center mb-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                                            <Sparkles size={32} className="text-emerald-600" />
                                        </div>
                                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                            Summarize PDF
                                        </h1>
                                        <p className="text-lg text-gray-600">
                                            Get instant, AI-powered summaries of long documents
                                        </p>
                                    </MotionWrapper>

                                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                        <PDFUpload onFileSelect={handleFileSelect} />

                                        {/* Summary Length Selector */}
                                        {selectedFile && (
                                            <MotionWrapper
                                                as="div"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-6"
                                            >
                                                <div className="mb-6">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                        Summary Length
                                                    </label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {/* Brief Option */}
                                                        <button
                                                            onClick={() => setSummaryLength('brief')}
                                                            className={`relative p-4 rounded-xl border-2 transition-all text-left ${summaryLength === 'brief'
                                                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${summaryLength === 'brief'
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-blue-100 text-blue-600'
                                                                    }`}>
                                                                    <AlignLeft size={20} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                                                        Brief
                                                                        {summaryLength === 'brief' && (
                                                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                                        )}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-600 mb-2">
                                                                        Key points only
                                                                    </p>
                                                                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                                        ~250 words
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </button>

                                                        {/* Standard Option */}
                                                        <button
                                                            onClick={() => setSummaryLength('standard')}
                                                            className={`relative p-4 rounded-xl border-2 transition-all text-left ${summaryLength === 'standard'
                                                                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                                                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${summaryLength === 'standard'
                                                                        ? 'bg-emerald-500 text-white'
                                                                        : 'bg-emerald-100 text-emerald-600'
                                                                    }`}>
                                                                    <FileText size={20} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                                                        Standard
                                                                        {summaryLength === 'standard' && (
                                                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                                        )}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-600 mb-2">
                                                                        Balanced detail
                                                                    </p>
                                                                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                                                                        ~650 words
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </button>

                                                        {/* Detailed Option */}
                                                        <button
                                                            onClick={() => setSummaryLength('detailed')}
                                                            className={`relative p-4 rounded-xl border-2 transition-all text-left ${summaryLength === 'detailed'
                                                                    ? 'border-purple-500 bg-purple-50 shadow-md'
                                                                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${summaryLength === 'detailed'
                                                                        ? 'bg-purple-500 text-white'
                                                                        : 'bg-purple-100 text-purple-600'
                                                                    }`}>
                                                                    <BookOpen size={20} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                                                        Detailed
                                                                        {summaryLength === 'detailed' && (
                                                                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                                        )}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-600 mb-2">
                                                                        Comprehensive
                                                                    </p>
                                                                    <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                                                        ~1250 words
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </MotionWrapper>
                                        )}

                                        {selectedFile && (
                                            <MotionWrapper
                                                as="div"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-6"
                                            >
                                                <button
                                                    onClick={handleUploadAndSummarize}
                                                    disabled={isUploading || isSummarizing}
                                                    className="w-full px-6 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                                                >
                                                    {isUploading ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : isSummarizing ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            Generating Summary...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles size={20} />
                                                            Summarize Document
                                                        </>
                                                    )}
                                                </button>
                                                {error && (
                                                    <p className="mt-4 text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
                                                )}
                                            </MotionWrapper>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        // Results View
                        <MotionWrapper
                            as="div"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="bg-emerald-600 px-6 py-8 sm:px-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="text-emerald-100" />
                                        <h2 className="text-2xl font-bold">{selectedFile?.file?.name}</h2>
                                    </div>
                                    <p className="text-emerald-100 opacity-90">AI Generated Summary</p>
                                </div>
                                <button
                                    onClick={reset}
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    <RefreshCw size={16} />
                                    Summarize Another
                                </button>
                            </div>

                            <div className="p-6 sm:p-10 prose prose-lg max-w-none prose-emerald">
                                <ReactMarkdown>{summary}</ReactMarkdown>
                            </div>
                        </MotionWrapper>
                    )}
                </div>

                <Footer />
            </div>
        </>
    )
}

export default SummarizePDF
