import React from 'react'
import { ChevronRight, Image as ImageIcon, FileText, Sparkles } from 'lucide-react'
import { MotionWrapper } from './ui/MotionWrapper'

interface Page {
    pageNum: number
    text: string
    title?: string
    images?: string[]
}

interface ContentPreviewProps {
    pages: Page[]
    totalPages: number
    onGenerate: () => void
    onCancel: () => void
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({
    pages,
    totalPages,
    onGenerate,
    onCancel
}) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <MotionWrapper
                as="div"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-4">
                    <Sparkles size={16} />
                    <span className="text-sm font-medium">Content Extracted Successfully</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Preview Your Content
                </h2>
                <p className="text-gray-600">
                    Review the extracted content before generating your video ({totalPages} pages)
                </p>
            </MotionWrapper>

            {/* Pages Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                    {pages.map((page, index) => (
                        <MotionWrapper
                            key={page.pageNum}
                            as="div"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                {/* Page Number Badge */}
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold">
                                    {page.pageNum}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Title */}
                                    {page.title && (
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {page.title}
                                        </h3>
                                    )}

                                    {/* Text Preview */}
                                    <div className="flex items-start gap-2 mb-3">
                                        <FileText size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {page.text || 'No text content'}
                                        </p>
                                    </div>

                                    {/* Images Count */}
                                    {page.images && page.images.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-blue-600">
                                            <ImageIcon size={14} />
                                            <span>{page.images.length} image{page.images.length > 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Arrow */}
                                <ChevronRight size={20} className="text-gray-300 flex-shrink-0" />
                            </div>
                        </MotionWrapper>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                    Go Back
                </button>

                <MotionWrapper
                    as="button"
                    onClick={onGenerate}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Sparkles size={20} />
                    Generate Video with AI
                </MotionWrapper>
            </div>
        </div>
    )
}
