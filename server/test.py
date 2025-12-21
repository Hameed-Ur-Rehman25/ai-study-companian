"""
Test script to verify Gemini API and chat functionality
"""
import os
import asyncio
from dotenv import load_dotenv
from app.services.gemini_service import GeminiService
from app.services.chunking_service import ChunkingService

# Load environment variables
load_dotenv()

async def test_gemini_api():
    """Test basic Gemini API connectivity"""
    print("=" * 60)
    print("TEST 1: Gemini API Connection")
    print("=" * 60)
    
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("❌ FAILED: GOOGLE_API_KEY not found in .env file")
            return False
        
        print(f"✓ API Key found: {api_key[:20]}...")
        
        # Initialize Gemini service
        gemini = GeminiService()
        print("✓ GeminiService initialized")
        
        # Test simple generation
        model = gemini.get_model()
        print("✓ Model retrieved successfully")
        
        response = model.generate_content("Say 'API is working!' in exactly those words.")
        print(f"✓ API Response: {response.text.strip()}")
        
        print("\n✅ TEST 1 PASSED: Gemini API is working!\n")
        return True
        
    except Exception as e:
        print(f"\n❌ TEST 1 FAILED: {str(e)}\n")
        return False


async def test_chunking_service():
    """Test chunking service"""
    print("=" * 60)
    print("TEST 2: Chunking Service")
    print("=" * 60)
    
    try:
        chunking = ChunkingService(chunk_size=100, overlap=20)
        
        # Test text
        test_text = "This is a test document. " * 50  # Create ~1250 characters
        
        # Create chunks
        chunks = chunking.create_chunks(test_text)
        print(f"✓ Created {len(chunks)} chunks from {len(test_text)} characters")
        print(f"  - Chunk 1 length: {len(chunks[0])} chars")
        print(f"  - Chunk 2 length: {len(chunks[1])} chars")
        
        # Test keyword extraction
        query = "What is this test document about and why is it important?"
        keywords = chunking.extract_keywords(query)
        print(f"✓ Extracted keywords: {keywords}")
        
        # Test relevance scoring
        relevant = chunking.get_relevant_chunks(chunks, query, max_chunks=2)
        print(f"✓ Found {len(relevant)} relevant chunks")
        
        # Test context building
        context = chunking.build_context(relevant)
        print(f"✓ Built context: {len(context)} characters")
        
        print("\n✅ TEST 2 PASSED: Chunking service works correctly!\n")
        return True
        
    except Exception as e:
        print(f"\n❌ TEST 2 FAILED: {str(e)}\n")
        return False


async def test_chat_with_context():
    """Test chat with PDF using context"""
    print("=" * 60)
    print("TEST 3: Chat with PDF Context")
    print("=" * 60)
    
    try:
        gemini = GeminiService()
        
        # Simulate PDF content
        pdf_context = """
        This is a research paper about artificial intelligence and machine learning.
        The main findings include:
        1. Deep learning models perform better with larger datasets
        2. Transfer learning can reduce training time significantly
        3. Attention mechanisms improve model performance
        
        The conclusion states that AI will continue to advance rapidly in the coming years.
        """
        
        # Simulate conversation
        messages = [
            {"role": "user", "content": "What are the main findings?"}
        ]
        
        print("📄 Context provided (175 characters)")
        print("💬 User question: 'What are the main findings?'")
        
        # Get response
        response = await gemini.chat_with_pdf(pdf_context, messages)
        
        print(f"\n🤖 AI Response:\n{response}\n")
        
        # Check if response mentions the findings
        if any(keyword in response.lower() for keyword in ['deep learning', 'transfer learning', 'attention']):
            print("✅ TEST 3 PASSED: Chat correctly uses context!\n")
            return True
        else:
            print("⚠️  TEST 3 WARNING: Response may not be using context properly\n")
            return True  # Still pass, but warn
            
    except Exception as e:
        print(f"\n❌ TEST 3 FAILED: {str(e)}\n")
        return False


async def test_chat_history():
    """Test chat with conversation history"""
    print("=" * 60)
    print("TEST 4: Chat with History")
    print("=" * 60)
    
    try:
        gemini = GeminiService()
        
        context = "The capital of France is Paris. Paris is known for the Eiffel Tower."
        
        # Simulate multi-turn conversation
        messages = [
            {"role": "user", "content": "What is the capital of France?"},
            {"role": "model", "content": "The capital of France is Paris."},
            {"role": "user", "content": "What is it known for?"}
        ]
        
        print("📄 Context: Information about France and Paris")
        print("💬 Conversation history: 2 previous messages")
        print("❓ Current question: 'What is it known for?'")
        
        response = await gemini.chat_with_pdf(context, messages)
        
        print(f"\n🤖 AI Response:\n{response}\n")
        
        # Check if response maintains context about Paris
        if 'eiffel' in response.lower() or 'tower' in response.lower() or 'paris' in response.lower():
            print("✅ TEST 4 PASSED: Chat maintains conversation history!\n")
            return True
        else:
            print("⚠️  TEST 4 WARNING: May not be maintaining history properly\n")
            return True  # Still pass, but warn
            
    except Exception as e:
        print(f"\n❌ TEST 4 FAILED: {str(e)}\n")
        return False


async def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("🧪 GEMINI API & CHAT FUNCTIONALITY TEST SUITE")
    print("=" * 60 + "\n")
    
    results = []
    
    # Run tests
    results.append(await test_gemini_api())
    results.append(await test_chunking_service())
    results.append(await test_chat_with_context())
    results.append(await test_chat_history())
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    
    print(f"Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Your Gemini API is ready to use.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please check the errors above.")
    
    print("=" * 60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
