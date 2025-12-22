import { useRouter } from 'next/router';
import { BookOpen, MessageSquare, Video, Sparkles } from 'lucide-react';

export default function Home() {
    const router = useRouter();

    const features = [
        {
            id: 'chat',
            title: 'Chat with PDF',
            description: 'Upload your PDF and have an intelligent conversation about its content. Ask questions and get instant answers.',
            icon: MessageSquare,
            route: '/chat-with-pdf',
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50'
        },
        {
            id: 'summarize',
            title: 'Summarize PDF',
            description: 'Get concise, intelligent summaries of your PDF documents. Extract key insights in seconds.',
            icon: BookOpen,
            route: '/summarize-pdf',
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50'
        },
        {
            id: 'video',
            title: 'PDF to Video',
            description: 'Transform your PDF into an engaging video presentation. Perfect for visual learners.',
            icon: Video,
            route: '/pdf-to-video',
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-50 to-red-50'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-20 pb-16">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6 animate-fade-in">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-slate-700">Powered by AI</span>
                    </div>

                    <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                        AI Study Companion
                    </h1>

                    <p className="text-xl text-slate-600 leading-relaxed">
                        Your intelligent assistant for working with PDFs. Chat, summarize, and create videos from your documents with the power of AI.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="group relative"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
                                    style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                                    className={`bg-gradient-to-r ${feature.gradient}`}
                                />

                                <div className={`relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-200 overflow-hidden h-full`}
                                    onClick={() => router.push(feature.route)}>

                                    {/* Background Pattern */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 bg-gradient-to-br ${feature.bgGradient} rounded-full -mr-16 -mt-16`} />

                                    {/* Icon */}
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        {feature.description}
                                    </p>

                                    {/* CTA */}
                                    <div className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:gap-2 transition-all`}>
                                        Get Started
                                        <span className="inline-block ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="text-center mt-16 text-slate-500 text-sm">
                    <p>Built with Next.js, FastAPI, and powered by Groq AI</p>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
        </div>
    );
}
