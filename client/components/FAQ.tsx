
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { MotionWrapper } from './ui/MotionWrapper'

const faqs = [
    {
        question: "How does the PDF to Video conversion work?",
        answer: "Our AI analyzes the content of your PDF, extracts key points, generates a script using advanced language models, and then creates a narrated video with relevant visuals."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we take security seriously. Your uploaded PDFs and generated content are stored securely. We use industry-standard encryption and security practices."
    },
    {
        question: "Can I try it for free?",
        answer: "Yes! You can try out the features with our free plan. Upgrade to pro for higher limits and faster processing."
    },
    {
        question: "What file formats do you support?",
        answer: "Currently, we support PDF documents. We are working on adding support for other formats like Word and PowerPoint in the future."
    }
]

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <MotionWrapper
                    as="div"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-gray-600">Everything you need to know about the product.</p>
                </MotionWrapper>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="font-medium text-gray-900">{faq.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 py-4 bg-white border-t border-gray-200">
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
