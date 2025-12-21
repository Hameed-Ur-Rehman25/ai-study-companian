"""
Text Chunking Service for handling large PDF documents
"""
import logging
import re
from typing import List, Tuple

logger = logging.getLogger(__name__)


class ChunkingService:
    """Service for chunking large text documents"""
    
    def __init__(self, chunk_size: int = 2000, overlap: int = 200):
        """
        Initialize chunking service
        
        Args:
            chunk_size: Maximum characters per chunk
            overlap: Character overlap between chunks
        """
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def create_chunks(self, text: str) -> List[str]:
        """
        Split text into overlapping chunks
        
        Args:
            text: Full text to chunk
            
        Returns:
            List of text chunks
        """
        if len(text) <= self.chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            # Extract chunk
            end = start + self.chunk_size
            chunk = text[start:end]
            
            # Try to break at sentence boundary if not at the end
            if end < len(text):
                # Look for sentence ending punctuation
                last_period = max(
                    chunk.rfind('. '),
                    chunk.rfind('.\n'),
                    chunk.rfind('? '),
                    chunk.rfind('! ')
                )
                
                if last_period > self.chunk_size * 0.5:  # Only if found in latter half
                    chunk = chunk[:last_period + 1]
                    end = start + last_period + 1
            
            chunks.append(chunk.strip())
            
            # Move to next chunk with overlap
            start = end - self.overlap
            
            # Prevent infinite loop
            if start >= len(text):
                break
        
        logger.info(f"Created {len(chunks)} chunks from {len(text)} characters")
        return chunks
    
    def extract_keywords(self, query: str, min_length: int = 3) -> List[str]:
        """
        Extract keywords from user query
        
        Args:
            query: User's question
            min_length: Minimum keyword length
            
        Returns:
            List of keywords
        """
        # Remove common stop words
        stop_words = {
            'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
            'in', 'with', 'to', 'for', 'of', 'as', 'by', 'from', 'this', 'that',
            'what', 'where', 'when', 'why', 'how', 'who', 'can', 'could', 'would',
            'should', 'do', 'does', 'did', 'have', 'has', 'had', 'be', 'been',
            'being', 'are', 'was', 'were', 'it', 'its', 'they', 'them', 'their',
            'me', 'you', 'your', 'about', 'tell', 'explain', 'describe'
        }
        
        # Extract words
        words = re.findall(r'\b\w+\b', query.lower())
        
        # Filter keywords
        keywords = [
            word for word in words 
            if len(word) >= min_length and word not in stop_words
        ]
        
        return keywords
    
    def score_chunk(self, chunk: str, keywords: List[str]) -> float:
        """
        Score a chunk based on keyword matches
        
        Args:
            chunk: Text chunk to score
            keywords: List of keywords to match
            
        Returns:
            Relevance score (higher is better)
        """
        chunk_lower = chunk.lower()
        score = 0.0
        
        for keyword in keywords:
            # Count occurrences
            count = chunk_lower.count(keyword.lower())
            # Weight by keyword length (longer keywords are more specific)
            score += count * len(keyword)
        
        return score
    
    def get_relevant_chunks(
        self, 
        chunks: List[str], 
        query: str, 
        max_chunks: int = 5
    ) -> List[str]:
        """
        Get the most relevant chunks for a query
        
        Args:
            chunks: List of all chunks
            query: User's question
            max_chunks: Maximum number of chunks to return
            
        Returns:
            List of most relevant chunks
        """
        keywords = self.extract_keywords(query)
        
        if not keywords:
            # If no keywords, return first few chunks
            return chunks[:max_chunks]
        
        # Score all chunks
        chunk_scores: List[Tuple[str, float]] = [
            (chunk, self.score_chunk(chunk, keywords))
            for chunk in chunks
        ]
        
        # Sort by score (descending)
        chunk_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Return top chunks
        relevant_chunks = [chunk for chunk, score in chunk_scores[:max_chunks]]
        
        logger.info(f"Selected {len(relevant_chunks)} relevant chunks from {len(chunks)} total")
        return relevant_chunks
    
    def build_context(self, chunks: List[str], max_chars: int = 10000) -> str:
        """
        Build context string from chunks
        
        Args:
            chunks: List of relevant chunks
            max_chars: Maximum total characters
            
        Returns:
            Combined context string
        """
        context_parts = []
        total_chars = 0
        
        for i, chunk in enumerate(chunks):
            chunk_with_marker = f"\n--- Section {i + 1} ---\n{chunk}\n"
            
            if total_chars + len(chunk_with_marker) > max_chars:
                break
            
            context_parts.append(chunk_with_marker)
            total_chars += len(chunk_with_marker)
        
        return "".join(context_parts)
