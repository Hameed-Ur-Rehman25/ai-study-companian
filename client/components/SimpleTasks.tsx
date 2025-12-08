import { ImageWithFallback } from './figma/ImageWithFallback';
import { Video, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { MotionWrapper } from './ui/MotionWrapper';
import { TiltCard } from './ui/TiltCard';
import { AnimatedIcon } from './ui/AnimatedIcon';

const features = [
  {
    icon: Video,
    gradient: 'from-blue-500 to-blue-600',
    title: 'PDF to Video Lectures',
    description: 'Transform static PDFs into dynamic video presentations with AI-generated narration and visuals.',
    textColor: 'text-blue-100'
  },
  {
    icon: MessageCircle,
    gradient: 'from-blue-500 to-blue-600',
    title: 'Chat with PDF',
    description: 'Ask questions and get instant, accurate answers from your documents using advanced AI technology.',
    textColor: 'text-blue-100'
  },
  {
    icon: Sparkles,
    gradient: 'from-emerald-500 to-emerald-600',
    title: 'Summarize PDF',
    description: 'Get comprehensive summaries of lengthy documents in seconds. Save time and grasp key concepts faster.',
    textColor: 'text-emerald-100'
  }
];

export function SimpleTasks() {
  return (
    <section className="mb-8 sm:mb-12" aria-labelledby="features-heading">
      <MotionWrapper
        as="div"
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 id="features-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Powerful Features for <span className="text-blue-600">Modern Learning</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Transform how you interact with PDFs. Our AI-powered features make document management 
          effortless and learning more engaging than ever before.
        </p>
      </MotionWrapper>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {features.map((feature, index) => (
          <MotionWrapper
            key={feature.title}
            as="div"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <TiltCard
              className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-5 sm:p-6 text-white shadow-2xl relative overflow-hidden group`}
              options={{
                max: 20,
                perspective: 1000,
                scale: 1.08,
                speed: 1000,
              }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
              </div>
              
              <div className="relative z-10">
                <AnimatedIcon
                  delay={index * 0.15}
                  hoverScale={1.3}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 backdrop-blur-sm shadow-lg"
                >
                  <feature.icon size={24} className="sm:w-7 sm:h-7" />
                </AnimatedIcon>
                
                <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
                <p className={`${feature.textColor} text-xs sm:text-sm mb-4 leading-relaxed`}>
                  {feature.description}
                </p>
                
                <MotionWrapper
                  as="button"
                  className="flex items-center gap-2 text-white text-sm sm:text-base font-medium"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  Learn More 
                  <MotionWrapper
                    as="span"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <ArrowRight size={16} className="sm:w-4 sm:h-4" />
                  </MotionWrapper>
                </MotionWrapper>
              </div>
              
              {/* Glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity rounded-2xl`}></div>
            </TiltCard>
          </MotionWrapper>
        ))}
      </div>
      
      {/* Feature showcase with image */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Experience the Future of Document Learning
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Our platform combines cutting-edge AI technology with intuitive design to revolutionize 
              how you work with PDFs. Whether you're a student, educator, or professional, our tools 
              adapt to your needs.
            </p>
            <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-medium text-gray-900">Instant Processing</div>
                  <div className="text-xs sm:text-sm text-gray-500">Upload and convert your PDFs in seconds</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-medium text-gray-900">AI-Powered Accuracy</div>
                  <div className="text-xs sm:text-sm text-gray-500">Advanced algorithms ensure precise results</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-medium text-gray-900">Secure & Private</div>
                  <div className="text-xs sm:text-sm text-gray-500">Your documents are encrypted and protected</div>
                </div>
              </li>
            </ul>
            <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-fit text-sm sm:text-base transition-colors">
              Get Started Free
            </button>
          </div>
          <div className="relative h-64 sm:h-80 lg:h-auto order-1 lg:order-2">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1560264401-b76ed96f3134?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGNvbmZlcmVuY2UlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzY0MjQ0OTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Video presentation showing AI-powered document learning platform"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

