"""
Groq AI service for generating teacher-style narration scripts
Converts dry PDF content into engaging, conversational teaching scripts
"""
import os
import logging
from groq import Groq

logger = logging.getLogger(__name__)


class GroqScriptService:
    """Service for generating AI teacher scripts using Groq"""
    
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            logger.warning("GROQ_API_KEY not set - script generation will fail")
            self.client = None
        else:
            self.client = Groq(api_key=self.api_key)
    
    def generate_teacher_script(
        self,
        page_title: str,
        page_text: str,
        page_num: int = 1
    ) -> str:
        """
        Generate engaging teacher-style narration from PDF content
        
        Args:
            page_title: Title of the page/section
            page_text: Original text from PDF
            page_num: Page number (for context)
            
        Returns:
            Teacher-style narration script
        """
        if not self.client:
            logger.error("Groq client not initialized")
            return page_text  # Fallback to original text
        
        try:
            # Create an engaging prompt for teacher-style narration
            prompt = f"""You are an enthusiastic and friendly teacher explaining educational content to students.

Page {page_num}: {page_title or 'Content'}

Original Content:
{page_text}

Task: Transform this content into an engaging, conversational teaching script.

Guidelines:
- Speak naturally and conversationally, as if teaching in a classroom
- Use simple, clear language that students can easily understand
- Add smooth transitions and explanations where needed
- Include brief examples or analogies if helpful
- Keep the tone warm, encouraging, and enthusiastic
- Aim for 30-60 seconds when spoken aloud
- Don't add greetings or closing statements
- Focus only on explaining the core concepts

Teacher Script:"""
            
            # Call Groq API
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Fast and high quality
                messages=[{
                    "role": "user",
                    "content": prompt
                }],
                temperature=0.7,  # Balanced creativity
                max_tokens=500,   # ~60 seconds of speech
                top_p=0.9
            )
            
            script = response.choices[0].message.content.strip()
            
            logger.info(f"Generated teacher script for page {page_num}: {len(script)} chars")
            return script
        
        except Exception as e:
            logger.error(f"Error generating teacher script: {e}")
            # Fallback to original text
            return page_text
    
    def generate_scripts_for_pages(self, pages_data: list) -> list:
        """
        Generate teacher scripts for multiple pages
        
        Args:
            pages_data: List of dicts with page_num, title, text
            
        Returns:
            List of dicts with added teacher_script field
        """
        for page in pages_data:
            script = self.generate_teacher_script(
                page_title=page.get('title', ''),
                page_text=page.get('text', ''),
                page_num=page.get('page_num', 1)
            )
            page['teacher_script'] = script
        
        return pages_data
