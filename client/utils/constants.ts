/**
 * Application-wide constants
 */

export const APP_NAME = 'AI Study Companion - PDF AI Studio'
export const APP_DESCRIPTION = 'Transform your PDFs with cutting-edge AI technology'

export const ROUTES = {
  HOME: '/',
  PDF_TO_VIDEO: '/pdf-to-video',
  CHAT_WITH_PDF: '/chat-with-pdf',
  SUMMARIZE_PDF: '/summarize-pdf'
} as const

export const API_ENDPOINTS = {
  UPLOAD_PDF: '/api/pdf/upload',
  CONVERT_TO_VIDEO: '/api/pdf/convert-to-video',
  CHAT: '/api/pdf/chat',
  SUMMARIZE: '/api/pdf/summarize'
} as const

