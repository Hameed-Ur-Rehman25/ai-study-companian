import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PDFUpload } from '../components/PDFUpload'
import { PDFConversionController } from '../controllers/PDFConversionController'
import { PDFFile } from '../models/Conversion'
import { MessageCircle, Send, Plus } from 'lucide-react'
import { MotionWrapper } from '../components/ui/MotionWrapper'
import { API_BASE_URL } from '../config/api'

interface Message {
    role: 'user' | 'model'
    content: string
}

const ChatWithPDF: NextPage = () => {
    const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
    const [jobId, setJobId] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Chat state
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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

            const response = await PDFConversionController.uploadPDF(selectedFile.file)
            setJobId(response.jobId)

            // Automatically start extraction
            await PDFConversionController.extractContent(response.jobId)

            // Add initial greeting
            setMessages([{
                role: 'model',
                content: `I've analyzed ${selectedFile.file.name}. What would you like to know about it?`
            }])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload PDF')
        } finally {
            setIsUploading(false)
        }
    }

    const sendMessage = async () => {
        if (!inputValue.trim() || !jobId) return

        const userMessage = inputValue.trim()
        setInputValue('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_id: jobId,
                    messages: [...messages, { role: 'user', content: userMessage }]
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to get response')
            }

            const data = await response.json()
            setMessages(prev => [...prev, { role: 'model', content: data.response }])
        } catch (err) {
            console.error(err)
            setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const startNewChat = () => {
        setJobId(null)
        setSelectedFile(null)
        setMessages([])
        setInputValue('')
    }

    return (
        <>
            <Head>
                <title>Chat with PDF - AI Study Companion</title>
                <meta name="description" content="Ask questions and get instant answers from your PDF documents" />
            </Head>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />

                <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
                    {!jobId ? (
                        // Upload View
                        <div className="max-w-2xl mx-auto">
                            <MotionWrapper
                                as="div"
                                className="text-center mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                    Chat with PDF
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Upload a PDF and ask questions to get instant answers
                                </p>
                            </MotionWrapper>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <PDFUpload onFileSelect={handleFileSelect} />

                                {selectedFile && (
                                    <MotionWrapper
                                        as="div"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6"
                                    >
                                        <button
                                            onClick={handleUpload}
                                            disabled={isUploading}
                                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <MessageCircle size={20} />
                                                    Start Chatting
                                                </>
                                            )}
                                        </button>
                                        {error && (
                                            <p className="mt-3 text-red-600 text-sm text-center">{error}</p>
                                        )}
                                    </MotionWrapper>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Chat Interface
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[600px] sm:h-[700px]">
                            {/* Chat Header */}
                            <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <MessageCircle size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-md">
                                            {selectedFile?.file.name}
                                        </h2>
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            Online
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={startNewChat}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                                    title="New Chat"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask a question about your PDF..."
                                        className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!inputValue.trim() || isLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    )
}

export default ChatWithPDF
