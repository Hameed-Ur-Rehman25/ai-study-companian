import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PDFUpload } from '../components/PDFUpload'
import { PDFConversionController } from '../controllers/PDFConversionController'
import { PDFFile } from '../models/Conversion'
import { Sparkles, RefreshCw, FileText } from 'lucide-react'
import { MotionWrapper } from '../components/ui/MotionWrapper'
import { API_BASE_URL } from '../config/api'
import ReactMarkdown from 'react-markdown'

const SummarizePDF: NextPage = () => {
    const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
    const [jobId, setJobId] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isSummarizing, setIsSummarizing] = useState(false)
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

            // 1. Upload
            const response = await PDFConversionController.uploadPDF(selectedFile.file)
            setJobId(response.jobId)

            // 2. Extract
            await PDFConversionController.extractContent(response.jobId)

            setIsUploading(false)
            setIsSummarizing(true)

            // 3. Summarize
            const summaryResponse = await fetch(`${API_BASE_URL}/api/ai/summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_id: response.jobId
                }),
            })

            if (!summaryResponse.ok) {
                throw new Error('Failed to generate summary')
            }

            const data = await summaryResponse.json()
            setSummary(data.summary)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process PDF')
            setIsUploading(false)
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
                                                    Uploading & Processing...
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
                                        <h2 className="text-2xl font-bold">{selectedFile?.file.name}</h2>
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
