import { ChatSession } from '../controllers/ChatController'
import { SessionItem } from './SessionItem'
import { Plus, History, X, MessageSquare } from 'lucide-react'
import { useState } from 'react'

interface ChatHistorySidebarProps {
    sessions: ChatSession[]
    currentSessionId: string | null
    onSessionSelect: (sessionId: string) => void
    onNewChat: () => void
    onNewSession?: () => void
    isOpen: boolean
    onClose: () => void
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
    sessions,
    currentSessionId,
    onSessionSelect,
    onNewChat,
    onNewSession,
    isOpen,
    onClose
}) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:relative top-0 left-0 h-full bg-white border-r border-gray-200 transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } w-72`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <History size={20} className="text-blue-600" />
                                <h3 className="font-semibold text-gray-900">Chat History</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="lg:hidden p-1 hover:bg-gray-100 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={onNewChat}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                <Plus size={16} />
                                Upload New PDF
                            </button>
                            {onNewSession && (
                                <button
                                    onClick={onNewSession}
                                    className="w-full px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <MessageSquare size={16} />
                                    New Session (Same PDF)
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sessions List */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {sessions.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-sm text-gray-500">No chat history yet</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Start a conversation to see it here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {sessions.map((session) => (
                                    <SessionItem
                                        key={session.session_id}
                                        session={session}
                                        isActive={session.session_id === currentSessionId}
                                        onClick={() => onSessionSelect(session.session_id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
