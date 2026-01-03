import { ChatSession } from '../controllers/ChatController'
import { Clock, MessageSquare, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SessionItemProps {
    session: ChatSession
    isActive: boolean
    onClick: () => void
    onDelete?: (sessionId: string) => void
}

export const SessionItem: React.FC<SessionItemProps> = ({ session, isActive, onClick, onDelete }) => {
    const getRelativeTime = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        } catch {
            return 'Recently'
        }
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDelete?.(session.session_id)
    }

    return (
        <div
            onClick={onClick}
            className={`group relative w-full text-left p-3 rounded-lg transition-all cursor-pointer ${isActive
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
        >
            <div className="flex items-start gap-2 pr-6">
                <MessageSquare
                    size={16}
                    className={isActive ? 'text-blue-600 mt-1' : 'text-gray-400 mt-1'}
                />
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                        {session.pdf_filename}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                            {getRelativeTime(session.updated_at)}
                        </span>
                    </div>
                </div>
            </div>

            {onDelete && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Chat"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    )
}
