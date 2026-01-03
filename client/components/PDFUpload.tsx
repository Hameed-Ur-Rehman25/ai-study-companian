import { useState, useRef, useCallback } from 'react'
import { Upload, File, X, AlertCircle } from 'lucide-react'
import { MotionWrapper } from './ui/MotionWrapper'
import { PDFFile } from '../models/Conversion'

interface PDFUploadProps {
  onFileSelect: (file: PDFFile) => void
  maxSize?: number // in bytes
  className?: string
}

export function PDFUpload({ onFileSelect, maxSize = 50 * 1024 * 1024, className = '' }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!file.type.includes('pdf')) {
      return 'File must be a PDF document'
    }

    if (file.size > maxSize) {
      return `File size exceeds maximum of ${(maxSize / 1024 / 1024).toFixed(0)}MB`
    }

    if (file.size === 0) {
      return 'File is empty'
    }

    return null
  }

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    const pdfFile: PDFFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }
    setSelectedFile(pdfFile)
    onFileSelect(pdfFile)
  }, [maxSize, onFileSelect])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  return (
    <div className={className}>
      {!selectedFile ? (
        <MotionWrapper
          as="div"
          className={`bg-white shadow-xl shadow-blue-50/50 rounded-3xl border border-gray-100 p-8 sm:p-12 text-center transition-all ${isDragging
              ? 'border-blue-500 ring-4 ring-blue-50'
              : 'hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100/50'
            } ${error ? 'border-red-500 bg-red-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            className="hidden"
            id="pdf-upload"
          />

          <MotionWrapper
            as="div"
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 relative w-48 h-48 sm:w-64 sm:h-64 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/upload-illustration.png"
                alt="Upload Document"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Upload your PDF
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-xs mx-auto">
              Drag & drop your file here, or click to browse
            </p>

            <MotionWrapper
              as="label"
              htmlFor="pdf-upload"
              className="px-8 py-3.5 bg-[#4F46E5] text-white rounded-2xl cursor-pointer hover:bg-[#4338CA] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload size={20} />
              Select Document
            </MotionWrapper>

            <p className="text-xs text-gray-400 mt-6 font-medium">
              PDFs up to {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          </MotionWrapper>
        </MotionWrapper>
      ) : (
        <MotionWrapper
          as="div"
          className="bg-white border-2 border-blue-200 rounded-xl p-4 sm:p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <File size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X size={20} />
            </button>
          </div>
        </MotionWrapper>
      )}

      {error && (
        <MotionWrapper
          as="div"
          className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </MotionWrapper>
      )}
    </div>
  )
}

