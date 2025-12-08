import { Sparkles, Clock, FileText, Play, Upload, Download } from 'lucide-react'
import { ToolFeature, ProcessStep } from '../models/Tool'

/**
 * Service for PDF to Video feature data
 */
export class PDFToVideoService {
  /**
   * Get features for PDF to Video page
   */
  static getFeatures(): ToolFeature[] {
    return [
      {
        icon: Sparkles,
        title: 'AI-Powered Narration',
        description: 'Advanced AI generates natural, engaging voiceovers for your content'
      },
      {
        icon: Clock,
        title: 'Fast Processing',
        description: 'Convert your PDFs to video in minutes, not hours'
      },
      {
        icon: FileText,
        title: 'Smart Content Extraction',
        description: 'Automatically identifies key points and creates structured video content'
      },
      {
        icon: Play,
        title: 'Interactive Videos',
        description: 'Create engaging video lectures with animations and visual effects'
      }
    ]
  }

  /**
   * Get process steps for PDF to Video
   */
  static getProcessSteps(): ProcessStep[] {
    return [
      {
        number: '1',
        title: 'Upload Your PDF',
        description: 'Select and upload your PDF document. We support all standard PDF formats.',
        icon: Upload
      },
      {
        number: '2',
        title: 'AI Processing',
        description: 'Our AI analyzes your content and generates a video script with narration.',
        icon: Sparkles
      },
      {
        number: '3',
        title: 'Preview & Customize',
        description: 'Review your video lecture and customize narration, speed, and visuals.',
        icon: Play
      },
      {
        number: '4',
        title: 'Download & Share',
        description: 'Download your video in high quality or share it directly with others.',
        icon: Download
      }
    ]
  }
}

