
/**
 * Chat Controller for Chat with PDF functionality
 */
import { API_BASE_URL } from '../config/api'
import { supabase } from '../utils/supabaseClient'

export interface Message {
    role: 'user' | 'model'
    content: string
    timestamp?: string
}

export interface ChatSession {
    session_id: string
    job_id: string
    pdf_filename: string
    created_at: string
    updated_at: string
}

export interface SessionWithMessages {
    session: ChatSession
    messages: Message[]
}

export interface ChatResponse {
    response: string
    session_id: string
}

export class ChatController {

    private static async getAuthHeader(): Promise<Record<string, string>> {
        const { data: { session } } = await supabase.auth.getSession()
        return session ? { 'Authorization': `Bearer ${session.access_token}` } : {}
    }

    /**
     * Send a chat message
     */
    static async sendMessage(
        jobId: string,
        messages: Message[],
        sessionId?: string
    ): Promise<ChatResponse> {
        const authHeaders = await this.getAuthHeader()
        const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders
            },
            body: JSON.stringify({
                job_id: jobId,
                messages: messages,
                session_id: sessionId
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to send message')
        }

        return response.json()
    }

    /**
     * Get all sessions for a job
     */
    static async getSessions(jobId: string): Promise<ChatSession[]> {
        const authHeaders = await this.getAuthHeader()
        const response = await fetch(`${API_BASE_URL}/api/ai/sessions/${jobId}`, {
            headers: { ...authHeaders }
        })

        if (!response.ok) {
            throw new Error('Failed to get sessions')
        }

        const data = await response.json()
        return data.sessions
    }

    /**
     * Get all sessions for the user (global)
     */
    static async getAllSessions(): Promise<ChatSession[]> {
        const authHeaders = await this.getAuthHeader()
        const response = await fetch(`${API_BASE_URL}/api/ai/sessions`, {
            headers: { ...authHeaders }
        })

        if (!response.ok) {
            throw new Error('Failed to get all sessions')
        }

        const data = await response.json()
        return data.sessions
    }

    /**
     * Get a specific session with messages
     */
    static async getSession(sessionId: string): Promise<SessionWithMessages> {
        const authHeaders = await this.getAuthHeader()
        const response = await fetch(`${API_BASE_URL}/api/ai/session/${sessionId}`, {
            headers: { ...authHeaders }
        })

        if (!response.ok) {
            throw new Error('Failed to get session')
        }

        return response.json()
    }

    /**
     * Create a new session
     */
    static async createNewSession(jobId: string, pdfFilename: string): Promise<ChatSession> {
        const authHeaders = await this.getAuthHeader()
        const response = await fetch(`${API_BASE_URL}/api/ai/sessions/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders
            },
            body: JSON.stringify({
                job_id: jobId,
                pdf_filename: pdfFilename
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to create session')
        }

        const data = await response.json()
        return data.session
    }

    /**
     * Delete a session
     */
    static async deleteSession(sessionId: string): Promise<void> {
        const authHeaders = await this.getAuthHeader()
        const response = await fetch(`${API_BASE_URL}/api/ai/session/${sessionId}`, {
            method: 'DELETE',
            headers: { ...authHeaders }
        })

        if (!response.ok) {
            throw new Error('Failed to delete session')
        }
    }
}
