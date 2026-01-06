import { API_BASE_URL } from '../config/api'

export interface PDFSummary {
    id: string
    job_id: string
    pdf_filename: string | null
    length: string
    summary_text: string
    created_at: string
}

export class SummaryController {
    /**
     * Get all summaries for the current user
     */
    static async getAllSummaries(): Promise<PDFSummary[]> {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_BASE_URL}/api/ai/summaries`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch summaries')
        }

        const data = await response.json()
        return data.summaries
    }

    /**
     * Get summary by job ID
     */
    static async getSummary(jobId: string): Promise<PDFSummary | null> {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_BASE_URL}/api/ai/summaries/${jobId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            if (response.status === 404) return null
            throw new Error('Failed to fetch summary')
        }

        return await response.json()
    }
}
