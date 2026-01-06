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
                className={`fixed lg:relative top-0 left-0 h-full bg-slate-50 border-r border-slate-200 transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } w-80 flex-shrink-0 shadow-lg lg:shadow-none`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-5 border-b border-slate-200 bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <History size={18} strokeWidth={2.5} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg">History</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <button
                            onClick={onNewSummary}
                            className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md"
                        >
                            <Plus size={18} />
                            New Summary
                        </button>
                    </div>

                    {/* Summaries List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        {summaries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <FileText size={24} className="text-slate-400" />
                                </div>
                                <h4 className="text-slate-900 font-medium mb-1">No summaries yet</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Summarize your first PDF to see it here. It's safe and private.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent</div>
                                {summaries.map((summary) => (
                                    <div
                                        key={summary.id}
                                        onClick={() => onSummarySelect(summary)}
                                        className={`group relative p-3.5 rounded-xl cursor-pointer border transition-all duration-200 ${summary.job_id === currentJobId
                                            ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                                            : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${summary.job_id === currentJobId
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                                                }`}>
                                                <FileText size={18} strokeWidth={2} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-semibold truncate transition-colors ${summary.job_id === currentJobId
                                                    ? 'text-emerald-950'
                                                    : 'text-slate-700 group-hover:text-emerald-900'
                                                    }`}>
                                                    {summary.pdf_filename || 'Untitled Document'}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {formatDistanceToNow(new Date(summary.created_at), { addSuffix: true })}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium uppercase tracking-wider ${summary.length === 'brief' ? 'bg-blue-50 text-blue-600' :
                                                        summary.length === 'standard' ? 'bg-emerald-50 text-emerald-600' :
                                                            'bg-purple-50 text-purple-600'
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
