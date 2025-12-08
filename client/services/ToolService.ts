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
        description: 'Ask questions and get instant answers from your PDF documents'
      },
      {
        name: 'Summarize PDF',
        icon: Sparkles,
        color: 'bg-emerald-500',
        description: 'Get AI-powered summaries of your PDF documents in seconds'
      },
      {
        name: 'Word to PDF',
        icon: FileText,
        color: 'bg-blue-500',
        description: 'Convert Word documents to PDF format quickly and easily'
      },
      {
        name: 'PPT to PDF',
        icon: Presentation,
        color: 'bg-orange-500',
        description: 'Transform PowerPoint presentations into PDF files'
      },
      {
        name: 'Edit PDF',
        icon: Edit,
        color: 'bg-yellow-500',
        description: 'Edit text, images, and content in your PDF documents'
      },
      {
        name: 'Merge PDF',
        icon: Merge,
        color: 'bg-indigo-500',
        description: 'Combine multiple PDF files into a single document'
      },
      {
        name: 'Compress PDF',
        icon: Archive,
        color: 'bg-red-500',
        description: 'Reduce PDF file size without losing quality'
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

