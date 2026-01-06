import { useState, useEffect } from 'react'
import { Video, Clock, Trash2, ChevronLeft, ChevronRight, PlayCircle, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { MotionWrapper } from './ui/MotionWrapper'

interface VideoJob {
    job_id: string
    pdf_filename: string
    status: string
    created_at: string
}

interface VideoHistorySidebarProps {
    onSelectVideo: (jobId: string) => void
    currentJobId: string | null
    className?: string
}

export const VideoHistorySidebar: React.FC<VideoHistorySidebarProps> = ({
    onSelectVideo,
    currentJobId,
    className = ''
}) => {
    const [jobs, setJobs] = useState<VideoJob[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(true)

    // Mock initial data fetch (will replace with API call)
    useEffect(() => {
        // In a real app we would fetch from API
        // For now we will rely on local storage or just show "Processing" ones if we had a state management
        // But since we want to show history from DB, let's try to hit an endpoint we will create
        // Or for MVP, just use LocalStorage to track job_ids created on this client

        const loadHistory = () => {
            const savedJobs = JSON.parse(localStorage.getItem('pdf_video_jobs') || '[]')
            // Sort by newest first
            setJobs(savedJobs.reverse())
            setIsLoading(false)
        }

        loadHistory()

        // Listen for new jobs
        window.addEventListener('jobStarted', loadHistory)
        return () => window.removeEventListener('jobStarted', loadHistory)
    }, [])

    const handleDelete = (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation()
        const newJobs = jobs.filter(j => j.job_id !== jobId)
        setJobs(newJobs)
        localStorage.setItem('pdf_video_jobs', JSON.stringify(newJobs.reverse())) // Re-reverse to save
    }

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-80 z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0 ${className}`}
            >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Video size={20} className="text-blue-600" />
                        Video Library
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <button
                        onClick={() => onSelectVideo('new')}
                        className="w-full bg-blue-600 text-white rounded-xl py-3 px-4 font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4 shadow-sm"
                    >
                        <PlayCircle size={20} />
                        New Video Project
                    </button>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 px-4">
                            <Video size={48} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No videos yet. Start your first project!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {jobs.map((job) => (
                                <MotionWrapper
                                    key={job.job_id}
                                    as="div"
                                    layout
                                    className={`group relative w-full text-left p-3 rounded-xl border transition-all hover:shadow-md cursor-pointer ${currentJobId === job.job_id
                                            ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                                            : 'bg-white border-gray-100 hover:border-blue-100'
                                        }`}
                                    onClick={() => onSelectVideo(job.job_id)}
                                >
                                    <div className="pr-8">
                                        <h3 className="font-medium text-gray-900 truncate mb-1">
                                            {job.pdf_filename}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock size={12} />
                                            {new Date(job.created_at).toLocaleDateString()}
                                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium uppercase ${job.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    job.status === 'error' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, job.job_id)}
                                        className="absolute right-2 top-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </MotionWrapper>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button (Mobile) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed left-4 top-24 z-30 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200 text-gray-600"
                >
                    <ChevronRight size={24} />
                </button>
            )}
        </>
    )
}
