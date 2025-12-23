import { Video, MessageCircle, Sparkles, FileText, Presentation, Edit, Merge, Archive } from 'lucide-react'
import { Tool } from '../models/Tool'

/**
 * Service for managing PDF tools data
 */
export class ToolService {
  /**
   * Get all available PDF tools
   */
  static getAllTools(): Tool[] {
    return [
      {
        name: 'PDF to Video Lectures',
        icon: Video,
        color: 'bg-gradient-to-br from-blue-600 to-indigo-600',
        description: 'Convert your PDF documents into engaging video lectures with AI narration',
        featured: true,
        href: '/pdf-to-video'
      },
      {
        name: 'Chat with PDF',
        icon: MessageCircle,
        color: 'bg-blue-500',
        description: 'Ask questions and get instant answers from your PDF documents',
        href: '/chat-with-pdf'
      },
      {
        name: 'Summarize PDF',
        icon: Sparkles,
        color: 'bg-emerald-500',
        description: 'Get AI-powered summaries of your PDF documents in seconds',
        href: '/summarize-pdf'
      }
    ]
  }

  /**
   * Get featured tools only
   */
  static getFeaturedTools(): Tool[] {
    return this.getAllTools().filter(tool => tool.featured)
  }

  /**
   * Get tool by name
   */
  static getToolByName(name: string): Tool | undefined {
    return this.getAllTools().find(tool => tool.name === name)
  }
}

