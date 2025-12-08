import { LucideIcon } from 'lucide-react'

export interface Tool {
  name: string
  icon: LucideIcon
  color: string
  description: string
  featured?: boolean
  href?: string
}

export interface ToolFeature {
  icon: LucideIcon
  title: string
  description: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

