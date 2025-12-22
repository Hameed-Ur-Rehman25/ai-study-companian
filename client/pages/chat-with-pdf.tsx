import { useState, useEffect, useRef } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PDFUpload } from '../components/PDFUpload'
import { PDFConversionController } from '../controllers/PDFConversionController'
import { ChatController, ChatSession, Message } from '../controllers/ChatController'
import { PDFFile } from '../models/Conversion'
import { MessageCircle, Send, Menu } from 'lucide-react'
import { MotionWrapper } from '../components/ui/MotionWrapper'
import { ChatHistorySidebar } from '../components/ChatHistorySidebar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ChatWithPDF: NextPage = () => {
    const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
    const [jobId, setJobId] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Chat state
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Session state
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Load sessions when jobId changes
    useEffect(() => {
        if (jobId) {
            loadSessions()
        }
    }, [jobId])

    const loadSessions = async () => {
        if (!jobId) return

        try {
            const loadedSessions = await ChatController.getSessions(jobId)
            setSessions(loadedSessions)

            // Auto-load most recent session if exists
            if (loadedSessions.length > 0 && !currentSessionId) {
                const mostRecent = loadedSessions[0]
                await loadSession(mostRecent.session_id)
            }
        } catch (err) {
            console.error('Failed to load sessions:', err)
        }
    }

    const loadSession = async (sessionId: string) => {
        try {
            const sessionData = await ChatController.getSession(sessionId)
            setCurrentSessionId(sessionId)
            setMessages(sessionData.messages)
            setIsSidebarOpen(false) // Close sidebar on mobile after selection
        } catch (err) {
            console.error('Failed to load session:', err)
            setError('Failed to load chat history')
        }
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

            const response = await PDFConversionController.uploadPDF(selectedFile.file)
            const newJobId = response.jobId
            setJobId(newJobId)

            // Automatically start extraction
            await PDFConversionController.extractContent(newJobId)

            // Create initial session
            const session = await ChatController.createNewSession(newJobId, selectedFile.file.name)
            setCurrentSessionId(session.session_id)

            // Add initial greeting
            setMessages([{
                role: 'model',
                content: `I've analyzed ${selectedFile.file.name}. What would you like to know about it?`
            }])

            // Reload sessions list
            await loadSessions()
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

        // Optimistically add user message
        const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
        setMessages(newMessages)
        setIsLoading(true)

        try {
            const response = await ChatController.sendMessage(
                jobId,
                newMessages,
                currentSessionId || undefined
            )

            // Update session ID if it was newly created
            if (!currentSessionId) {
                setCurrentSessionId(response.session_id)
                await loadSessions()
            }

            // Add model response
            setMessages(prev => [...prev, { role: 'model', content: response.response }])
        } catch (err) {
            console.error(err)
            setMessages(prev => [...prev, {
                role: 'model',
                content: 'Sorry, I encountered an error. Please try again.'
            }])
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

    const handleNewChat = async () => {
        if (!jobId || !selectedFile?.file) return

        try {
            const session = await ChatController.createNewSession(jobId, selectedFile.file.name)
            setCurrentSessionId(session.session_id)
            setMessages([{
                role: 'model',
                content: `Starting a new conversation about ${selectedFile.file.name}. What would you like to know?`
            }])
            await loadSessions()
            setIsSidebarOpen(false)
        } catch (err) {
            setError('Failed to create new chat session')
        }
    }

    const startOver = () => {
        setJobId(null)
        setSelectedFile(null)
        setMessages([])
        setCurrentSessionId(null)
        setSessions([])
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

                <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
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
                        // Chat Interface with Sidebar
                        <div className="flex gap-4 h-[calc(100vh-200px)] max-h-[800px]">
                            <ChatHistorySidebar
                                sessions={sessions}
                                currentSessionId={currentSessionId}
                                onSessionSelect={loadSession}
                                onNewChat={handleNewChat}
                                isOpen={isSidebarOpen}
                                onClose={() => setIsSidebarOpen(false)}
                            />

                            {/* Main Chat Area */}
                            <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
                                {/* Chat Header */}
                                <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setIsSidebarOpen(true)}
                                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <Menu size={20} />
                                        </button>
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MessageCircle size={20} className="text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="font-semibold text-gray-900 truncate">
                                                {selectedFile?.file?.name}
                                            </h2>
                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Online
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={startOver}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Upload New PDF
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
                                                {msg.role === 'user' ? (
                                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                                ) : (
                                                    <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-headings:mb-2 prose-headings:mt-3">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
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
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    )
}

export default ChatWithPDF
