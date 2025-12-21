"""
Gemini Service for interactions with Google's Gemini API
"""
import os
import logging
import google.generativeai as genai
from typing import List, Dict, Optional, Generator

logger = logging.getLogger(__name__)

class GeminiService:
    """Service for interacting with Google Gemini API"""

    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            logger.warning("GOOGLE_API_KEY not set. Gemini features will not work.")
        else:
            genai.configure(api_key=self.api_key)
            logger.info("Gemini API configured")

    def get_model(self, model_name: str = "gemini-2.5-flash"):
        """Get Gemini model instance"""
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        return genai.GenerativeModel(model_name)

    async def chat_with_pdf(self, context: str, messages: List[Dict[str, str]]) -> str:
        """
        Chat with a PDF document using provided context
        
        Args:
            context: Relevant text context from the PDF (pre-chunked)
            messages: List of message dictionaries {'role': 'user'|'model', 'content': '...'}
        """
        try:
            model = self.get_model()
            
            # Create a chat session
            # We initialize context with the PDF content
            history = [
                {
                    "role": "user",
                    "parts": [f"Here is relevant content from a PDF document I want to discuss:\n\n{context}\n\nPlease answer my questions based on this document content."]
                },
                {
                    "role": "model",
                    "parts": ["I understand. I have read the document content provided. Please ask your questions."]
                }
            ]
            
            # Append previous messages to history
            # Skip the last message which is the current query (we'll send it via send_message)
            current_query = messages[-1]['content']
            
            for msg in messages[:-1]:
                role = "user" if msg['role'] == 'user' else "model"
                history.append({
                    "role": role,
                    "parts": [msg['content']]
                })
            
            chat = model.start_chat(history=history)
            response = chat.send_message(current_query)
            
            return response.text
            
        except Exception as e:
            logger.error(f"Error in chat_with_pdf: {e}")
            raise

    async def summarize_pdf(self, pdf_text: str) -> str:
        """
        Generate a summary of the PDF document
        """
        try:
            model = self.get_model()
            
            prompt = f"""
            Please provide a comprehensive summary of the following document. 
            Include the main topics, key points, and overall conclusion.
            Format the output with Markdown headings and bullet points.
            
            Document Content:
            {pdf_text[:30000]}... (truncated if too long)
            """
            
            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            logger.error(f"Error in summarize_pdf: {e}")
            raise
