import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PDFUpload } from '../components/PDFUpload'
import { PDFConversionController } from '../controllers/PDFConversionController'
import { SummaryController, PDFSummary } from '../controllers/SummaryController'
import { SummaryHistorySidebar } from '../components/SummaryHistorySidebar'
import { PDFFile } from '../models/Conversion'
import { Sparkles, RefreshCw, FileText, AlignLeft, BookOpen, Menu } from 'lucide-react'
import { MotionWrapper } from '../components/ui/MotionWrapper'
import { ProcessingAnimation } from '../components/animations/ProcessingAnimation'
import { API_BASE_URL } from '../config/api'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

type ProcessStage = 'uploading' | 'extracting' | 'processing' | null
type SummaryLength = 'brief' | 'standard' | 'detailed'

const SummarizePDF: NextPage = () => {
    const { user, loading } = useAuth()
    const router = useRouter()

    // Auth Check
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
    const [jobId, setJobId] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isSummarizing, setIsSummarizing] = useState(false)
    const [processingStage, setProcessingStage] = useState<ProcessStage>(null)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [summaryLength, setSummaryLength] = useState<SummaryLength>('standard')
    const [summary, setSummary] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // History State
    const [summaries, setSummaries] = useState<PDFSummary[]>([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)

    // Load Summaries
    useEffect(() => {
        if (user && !loading) {
            loadAllSummaries()
        }
    }, [user, loading])

    const loadAllSummaries = async () => {
        try {
            setIsInitialLoading(true)
            const allSummaries = await SummaryController.getAllSummaries()
            setSummaries(allSummaries)
        } catch (err) {
            console.error('Failed to load summaries:', err)
        } finally {
            setIsInitialLoading(false)
        }
    }

    const handleSummarySelect = (selectedSummary: PDFSummary) => {
        setJobId(selectedSummary.job_id)
        setSummary(selectedSummary.summary_text)
        setSummaryLength(selectedSummary.length as SummaryLength)
        // Simulate file object for display
        setSelectedFile({
            name: selectedSummary.pdf_filename || 'Unknown PDF',
            size: 0,
            type: 'application/pdf',
            file: { name: selectedSummary.pdf_filename || 'Unknown PDF' } as File
        })
        setError(null)
        setIsSidebarOpen(false)
    }

    const handleNewSummary = () => {
        setSelectedFile(null)
        setJobId(null)
        setSummary(null)
        setError(null)
        setIsSidebarOpen(false)
    }

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
            const { data: { session } } = await import('../utils/supabaseClient').then(mod => mod.supabase.auth.getSession())
            const summaryResponse = await fetch(`${API_BASE_URL}/api/ai/summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
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

            // Refresh history list to show new summary
            await loadAllSummaries()

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

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Summarize PDF - AI Study Companion</title>
                <meta name="description" content="Get AI-powered summaries of your PDF documents in seconds" />
            </Head>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />

                <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
                    {isInitialLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                            <p className="text-gray-500">Loading summaries...</p>
                        </div>
                    ) : (
                        <div className="flex gap-4 h-[calc(100vh-200px)] max-h-[900px]">
                            {/* Sidebar - Always visible */}
                            <SummaryHistorySidebar
                                summaries={summaries}
                                currentJobId={jobId}
                                onSummarySelect={handleSummarySelect}
                                onNewSummary={handleNewSummary}
                                isOpen={isSidebarOpen}
                                onClose={() => setIsSidebarOpen(false)}
                            />

                            {/* Main Content */}
                            <div className={`flex-1 ${!summary ? '' : 'bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col'}`}>

                                {!summary ? (
                                    // Upload View
                                    <div className="flex-1 flex items-center justify-center overflow-y-auto p-4 sm:p-8">
                                        <div className="max-w-3xl w-full">

                                            {/* Mobile Menu Button */}
                                            <div className="lg:hidden mb-4">
                                                <button
                                                    onClick={() => setIsSidebarOpen(true)}
                                                    className="p-2 bg-white rounded-lg shadow border border-gray-200 flex items-center gap-2 text-gray-700"
                                                >
                                                    <Menu size={20} />
                                                    <span>History</span>
                                                </button>
                                            </div>

                                            {processingStage ? (
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

                                                    <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-gray-100">
                                                        <PDFUpload onFileSelect={handleFileSelect} variant="compact" />

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
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full">
                                        <div className="bg-emerald-600 px-6 py-4 sm:px-8 text-white flex items-center justify-between gap-4 flex-shrink-0 shadow-md">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setIsSidebarOpen(true)}
                                                    className="lg:hidden p-1 hover:bg-white/20 rounded"
                                                >
                                                    <Menu size={20} />
                                                </button>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <FileText className="text-emerald-100" size={20} />
                                                        <h2 className="text-xl font-bold truncate max-w-[200px] sm:max-w-md">{selectedFile?.file?.name}</h2>
                                                    </div>
                                                    <p className="text-emerald-100 text-sm opacity-90">AI Generated Summary • <span className="capitalize">{summaryLength}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (summary) {
                                                            navigator.clipboard.writeText(summary)
                                                            // Could add toast here
                                                        }
                                                    }}
                                                    className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                                                    title="Copy to Clipboard"
                                                >
                                                    <span className="hidden sm:inline">Copy</span>
                                                </button>
                                                <button
                                                    onClick={handleNewSummary}
                                                    className="px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm font-bold whitespace-nowrap"
                                                >
                                                    <RefreshCw size={16} />
                                                    <span className="hidden sm:inline">New Summary</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-gray-50/50">
                                            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 sm:p-12 relative">
                                                <div className="prose prose-lg max-w-none prose-emerald prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700">
                                                    <ReactMarkdown>{summary}</ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Footer />
            </div >
        </>
    )
}

export default SummarizePDF
