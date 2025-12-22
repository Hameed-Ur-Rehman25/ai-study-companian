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
                    "content": f"""You are an expert AI assistant analyzing a PDF document. Here is the relevant content from the document:

{context}

Instructions for providing excellent responses:
1. Answer questions based ONLY on the document content provided above
2. Use clear, well-structured markdown formatting:
   - Use **bold** for key terms and important points
   - Use bullet points (-) for lists
   - Use numbered lists (1.) for sequential information
   - Use ## for section headings when appropriate
3. Be conversational and helpful in your tone
4. If the answer is in the document, provide it clearly and concisely
5. If the information is NOT in the document:
   - Clearly state "I don't see that specific information in this document"
   - Then provide 2-3 related questions the user might ask that ARE covered in the document
   - Format suggestions as: "However, I can help you with: [suggested questions]"
6. Do not show your reasoning process - provide only the final answer
7. Always format your response with proper markdown for better readability"""
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

    async def summarize_pdf(self, pdf_text: str, length: str = "standard") -> str:
        """
        Generate a summary of the PDF document with specified length
        
        Args:
            pdf_text: The full text content of the PDF
            length: Summary length - 'brief', 'standard', or 'detailed'
        """
        try:
            # Define prompts and settings for each length
            length_configs = {
                "brief": {
                    "prompt": """Provide a BRIEF summary (200-300 words) with only the most important points.
Focus on the absolute essentials and main takeaways.
Use bullet points for clarity.
Be concise and direct.
Provide only the summary without showing your reasoning process.""",
                    "max_tokens": 512
                },
                "standard": {
                    "prompt": """Provide a comprehensive summary (500-800 words) covering:
- Main topics and themes
- Key points and important details
- Overall conclusion and implications

Use proper Markdown formatting with headings (##) and bullet points.
Structure your summary logically for easy reading.
Provide only the summary without showing your reasoning process.""",
                    "max_tokens": 1024
                },
                "detailed": {
                    "prompt": """Provide a DETAILED and comprehensive summary (1000-1500 words) that includes:
- In-depth analysis of main topics and themes
- Key points with supporting details and examples
- Important context and background information
- Thorough explanations of complex concepts
- Overall conclusion and broader implications

Use proper Markdown formatting with:
- Main headings (##) for major sections
- Subheadings (###) for subsections
- Bullet points for lists
- **Bold** for emphasis on key terms

Provide a well-structured, comprehensive analysis.
Provide only the summary without showing your reasoning process.""",
                    "max_tokens": 2048
                }
            }
            
            # Get config for requested length (default to standard if invalid)
            config = length_configs.get(length, length_configs["standard"])
            
            full_prompt = f"""{config["prompt"]}

Document Content:
{pdf_text[:30000]}... (truncated if too long)
"""
            
            completion = self.client.chat.completions.create(
                model="qwen/qwen3-32b",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant that provides clear, well-structured summaries. Do not include your reasoning process in the response."
                    },
                    {
                        "role": "user",
                        "content": full_prompt
                    }
                ],
                temperature=0.6,
                max_completion_tokens=config["max_tokens"],
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
