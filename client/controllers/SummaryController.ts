import { API_BASE_URL } from '../config/api'
import { supabase } from '../utils/supabaseClient'

export interface PDFSummary {
    id: string
    job_id: string
    pdf_filename: string | null
    length: string
    summary_text: string
    created_at: string
}

export class SummaryController {
    private static async getAuthHeader(): Promise<Record<string, string>> {
        const { data: { session } } = await supabase.auth.getSession()
        return session ? { 'Authorization': `Bearer ${session.access_token}` } : {}
    }

    /**
     * Get all summaries for the current user
     */
    static async getAllSummaries(): Promise<PDFSummary[]> {
        const authHeaders = await this.getAuthHeader()
        const response = await fetch(`${API_BASE_URL}/api/ai/summaries`, {
            headers: { ...authHeaders }
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
        const authHeaders = await this.getAuthHeader()
        const response = await fetch(`${API_BASE_URL}/api/ai/summaries/${jobId}`, {
            headers: { ...authHeaders }
        })

        if (!response.ok) {
            if (response.status === 404) return null
            throw new Error('Failed to fetch summary')
        }

        return await response.json()
    }
}
