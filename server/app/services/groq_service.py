"""
Groq Service for interactions with Groq API (alternative to Gemini)
"""
import os
import logging
from typing import List, Dict
from groq import Groq

logger = logging.getLogger(__name__)


class GroqService:
    """Service for interacting with Groq API"""

    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            logger.warning("GROQ_API_KEY not set. Using environment default.")
        self.client = Groq(api_key=self.api_key) if self.api_key else Groq()
        logger.info("Groq API configured")

    async def chat_with_pdf(self, context: str, messages: List[Dict[str, str]]) -> str:
        """
        Chat with a PDF document using provided context
        
        Args:
            context: Relevant text context from the PDF (pre-chunked)
            messages: List of message dictionaries {'role': 'user'|'model', 'content': '...'}
        """
        try:
            # Build conversation history for Groq
            groq_messages = [
                {
                    "role": "system",
                    "content": f"You are a helpful AI assistant analyzing a PDF document. Here is the relevant content from the document:\n\n{context}\n\nPlease answer questions based on this document content. Provide clear, direct answers without showing your reasoning process."
                }
            ]
            
            # Add conversation history (convert 'model' role to 'assistant' for Groq)
            for msg in messages:
                role = "assistant" if msg['role'] == 'model' else msg['role']
                groq_messages.append({
                    "role": role,
                    "content": msg['content']
                })
            
            # Make API call
            completion = self.client.chat.completions.create(
                model="qwen/qwen3-32b",
                messages=groq_messages,
                temperature=0.6,
                max_completion_tokens=4096,
                top_p=0.95,
                stream=False,
                stop=None
            )
            
            response_text = completion.choices[0].message.content
            
            # Filter out thinking tokens if present
            # Some models wrap thinking in <think>...</think> or similar tags
            response_text = self._filter_thinking(response_text)
            
            return response_text
            
        except Exception as e:
            logger.error(f"Error in chat_with_pdf: {e}")
            raise
    
    def _filter_thinking(self, text: str) -> str:
        """
        Filter out thinking/reasoning tokens from the response
        
        Args:
            text: Raw response text
            
        Returns:
            Filtered text with only the final answer
        """
        import re
        
        # Remove content within <think> tags
        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL | re.IGNORECASE)
        
        # Remove content within <reasoning> tags
        text = re.sub(r'<reasoning>.*?</reasoning>', '', text, flags=re.DOTALL | re.IGNORECASE)
        
        # Remove lines that start with "Thinking:" or "Reasoning:"
        text = re.sub(r'^(Thinking|Reasoning):.*$', '', text, flags=re.MULTILINE | re.IGNORECASE)
        
        # Remove markdown code blocks that contain "thinking" or "reasoning"
        text = re.sub(r'```(?:thinking|reasoning)\n.*?\n```', '', text, flags=re.DOTALL | re.IGNORECASE)
        
        # Clean up extra whitespace
        text = re.sub(r'\n\n+', '\n\n', text).strip()
        
        return text

    async def summarize_pdf(self, pdf_text: str) -> str:
        """
        Generate a summary of the PDF document
        """
        try:
            prompt = f"""
            Please provide a comprehensive summary of the following document. 
            Include the main topics, key points, and overall conclusion.
            Format the output with Markdown headings and bullet points.
            Provide only the summary without showing your reasoning process.
            
            Document Content:
            {pdf_text[:30000]}... (truncated if too long)
            """
            
            completion = self.client.chat.completions.create(
                model="qwen/qwen3-32b",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant that provides clear, concise summaries. Do not include your reasoning process in the response."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.6,
                max_completion_tokens=4096,
                top_p=0.95,
                stream=False,
                stop=None
            )
            
            response_text = completion.choices[0].message.content
            
            # Filter out thinking tokens if present
            response_text = self._filter_thinking(response_text)
            
            return response_text
            
        except Exception as e:
            logger.error(f"Error in summarize_pdf: {e}")
            raise
