import { Video, MessageCircle, Sparkles, Zap, Brain, Shield } from 'lucide-react';
import { MotionWrapper } from './ui/MotionWrapper';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function FeaturesSection() {
    const features = [
        {
            title: "PDF to Video Conversion",
            description: "Transform static documents into engaging video lectures with AI narration and visuals. Perfect for visual learners.",
            icon: Video,
            color: "bg-blue-500",
            colSpan: "lg:col-span-2",
            bgImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
        },
        {
            title: "Interactive Chat",
            description: "Have a conversation with your textbooks. Ask specific questions and get cited answers instantly.",
            icon: MessageCircle,
            color: "bg-indigo-500",
            colSpan: "lg:col-span-1",
            bgImage: null
        },
        {
            title: "Instant Summaries",
            description: "Get the gist of 100-page reports in seconds. Smart summarization captures key points and action items.",
            icon: Sparkles,
            color: "bg-purple-500",
            colSpan: "lg:col-span-1",
            bgImage: null
        },
        {
            title: "Knowledge Graph",
            description: "Visualise connections between concepts in your documents for deeper understanding.",
            icon: Brain,
            color: "bg-emerald-500",
            colSpan: "lg:col-span-2",
            bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    return (
        <section className="py-20 bg-gray-50" id="features">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Everything you need to <span className="text-blue-600">Supercharge Your Study</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Our AI-engine analyzes your documents to create studying materials that adapt to your learning style.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <MotionWrapper
                            key={feature.title}
                            as="div"
                            className={`relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 group ${feature.colSpan || 'col-span-1'} min-h-[300px]`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            {feature.bgImage && (
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                                    <ImageWithFallback
                                        src={feature.bgImage}
                                        alt={feature.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            )}

                            <div className={`relative z-20 p-8 h-full flex flex-col justify-end ${feature.bgImage ? 'text-white' : 'text-gray-900'}`}>
                                <div className={`mb-auto ${!feature.bgImage && 'bg-gray-50 w-fit p-3 rounded-2xl mb-6'}`}>
                                    <feature.icon size={32} className={`${feature.bgImage ? 'text-white' : 'text-blue-600'}`} />
                                </div>

                                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                                <p className={`text-base ${feature.bgImage ? 'text-gray-200' : 'text-gray-500'}`}>
                                    {feature.description}
                                </p>
                            </div>
                        </MotionWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
