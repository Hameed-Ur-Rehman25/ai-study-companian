import { PDFSummary } from '../controllers/SummaryController'
import { Plus, History, X, FileText, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SummaryHistorySidebarProps {
    summaries: PDFSummary[]
    currentJobId: string | null
    onSummarySelect: (summary: PDFSummary) => void
    onNewSummary: () => void
    isOpen: boolean
    onClose: () => void
}

export const SummaryHistorySidebar: React.FC<SummaryHistorySidebarProps> = ({
    summaries,
    currentJobId,
    onSummarySelect,
    onNewSummary,
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
                    } w-72 flex-shrink-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <History size={20} className="text-emerald-600" />
                                <h3 className="font-semibold text-gray-900">Summary History</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="lg:hidden p-1 hover:bg-gray-100 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <button
                            onClick={onNewSummary}
                            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <Plus size={16} />
                            Summarize New PDF
                        </button>
                    </div>

                    {/* Summaries List */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {summaries.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-sm text-gray-500">No summaries yet</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Summarize a document to see it here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {summaries.map((summary) => (
                                    <div
                                        key={summary.id}
                                        onClick={() => onSummarySelect(summary)}
                                        className={`group p-3 rounded-xl cursor-pointer border transition-all ${summary.job_id === currentJobId
                                            ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                            : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${summary.job_id === currentJobId
                                                ? 'bg-emerald-100 text-emerald-600'
                                                : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-emerald-600'
                                                }`}>
                                                <FileText size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-medium truncate ${summary.job_id === currentJobId
                                                    ? 'text-emerald-900'
                                                    : 'text-gray-900'
                                                    }`}>
                                                    {summary.pdf_filename || 'Untitled Document'}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {formatDistanceToNow(new Date(summary.created_at), { addSuffix: true })}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium uppercase tracking-wider ${summary.length === 'brief' ? 'bg-blue-100 text-blue-700' :
                                                            summary.length === 'standard' ? 'bg-emerald-100 text-emerald-700' :
                                                                'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {summary.length}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
