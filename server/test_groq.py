"""
Test script specifically for Groq API
"""
import asyncio
from app.services.groq_service import GroqService
from app.services.chunking_service import ChunkingService

async def test_groq_basic():
    """Test basic Groq API connectivity"""
    print("=" * 60)
    print("TEST: Groq API Connection")
    print("=" * 60)
    
    try:
        groq = GroqService()
        print("✓ GroqService initialized")
        
        # Test simple chat
        context = "This is a test document about artificial intelligence."
        messages = [
            {"role": "user", "content": "What is this about?"}
        ]
        
        print("📄 Sending test query...")
        response = await groq.chat_with_pdf(context, messages)
        
        print(f"\n✓ Response received:")
        print(f"{response}\n")
        
        print("✅ Groq API is working!\n")
        return True
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}\n")
        return False


async def test_groq_with_chunking():
    """Test Groq with chunking service"""
    print("=" * 60)
    print("TEST: Groq + Chunking Integration")
    print("=" * 60)
    
    try:
        groq = GroqService()
        chunking = ChunkingService()
        
        # Large test text
        test_text = """
        Machine learning is a subset of artificial intelligence that focuses on 
        developing algorithms that can learn from and make predictions on data.
        Deep learning is a type of machine learning that uses neural networks with
        multiple layers. Convolutional neural networks (CNNs) are particularly
        effective for image recognition tasks. Recurrent neural networks (RNNs)
        excel at sequence prediction problems.
        """ * 10  # Repeat to make it longer
        
        # Create chunks
        chunks = chunking.create_chunks(test_text)
        print(f"✓ Created {len(chunks)} chunks")
        
        # Get relevant chunks for a query
        query = "What are neural networks good for?"
        relevant_chunks = chunking.get_relevant_chunks(chunks, query)
        context = chunking.build_context(relevant_chunks)
        
        print(f"✓ Built context from {len(relevant_chunks)} relevant chunks")
        
        # Query Groq
        messages = [{"role": "user", "content": query}]
        response = await groq.chat_with_pdf(context, messages)
        
        print(f"\n✓ Question: {query}")
        print(f"✓ Answer:\n{response}\n")
        
        print("✅ Groq + Chunking integration working!\n")
        return True
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}\n")
        return False


async def main():
    print("\n" + "=" * 60)
    print("🚀 GROQ API TEST SUITE")
    print("=" * 60 + "\n")
    
    results = []
    results.append(await test_groq_basic())
    results.append(await test_groq_with_chunking())
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    
    print(f"Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Groq API is ready to use.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed.")
    
    print("=" * 60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
