import { ImageWithFallback } from './figma/ImageWithFallback';
import { Video, MessageCircle, Sparkles, Play } from 'lucide-react';
import { MotionWrapper } from './ui/MotionWrapper';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { TiltCard } from './ui/TiltCard';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center p-6 sm:p-8 lg:p-12">
        {/* Left Content */}
        <MotionWrapper
          as="div"
          className="relative z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <MotionWrapper
            as="div"
            className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm mb-3 sm:mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
          >
            🚀 Powered by AI Technology
          </MotionWrapper>

          <MotionWrapper
            as="h1"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Learn Smarter with<br className="hidden sm:block" />
            <MotionWrapper
              as="span"
              className="text-blue-600 inline-block"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                background: 'linear-gradient(90deg, #2563eb, #4f46e5, #2563eb)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI-Powered PDFs
            </MotionWrapper>
          </MotionWrapper>

          <MotionWrapper
            as="p"
            className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Turn PDFs into video lectures, chat with your documents using AI, and get instant summaries. Everything you need to study smarter, not harder.
          </MotionWrapper>

          <MotionWrapper
            as="div"
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <MotionWrapper
              as="button"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play size={18} className="sm:w-5 sm:h-5" />
                Start Free Trial
              </span>
              <MotionWrapper
                as="div"
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </MotionWrapper>
            <MotionWrapper
              as="button"
              className="px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 text-sm sm:text-base relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo Video
            </MotionWrapper>
          </MotionWrapper>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: Video, color: 'bg-blue-100', iconColor: 'text-blue-600', title: 'PDF to Video', subtitle: 'AI Narration' },
              { icon: MessageCircle, color: 'bg-blue-100', iconColor: 'text-blue-600', title: 'Chat AI', subtitle: 'Ask Anything' },
              { icon: Sparkles, color: 'bg-emerald-100', iconColor: 'text-emerald-600', title: 'Summarize', subtitle: 'Save Time' },
            ].map((feature, index) => (
              <MotionWrapper
                key={feature.title}
                as="div"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                <AnimatedIcon
                  delay={0.7 + index * 0.1}
                  hoverScale={1.2}
                  className={`${feature.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md`}
                >
                  <feature.icon size={20} className={`sm:w-6 sm:h-6 ${feature.iconColor}`} />
                </AnimatedIcon>
                <div>
                  <div className="text-xs sm:text-sm text-gray-900 font-medium">{feature.title}</div>
                  <div className="text-xs text-gray-500">{feature.subtitle}</div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </MotionWrapper>

        {/* Right Image */}
        <MotionWrapper
          as="div"
          className="relative mt-6 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <TiltCard
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            options={{
              max: 10,
              perspective: 1000,
              scale: 1.02,
            }}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1759984782106-4b56d0aa05b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhcm5pbmclMjBvbmxpbmV8ZW58MXx8fHwxNzY0MTczMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Student learning online with AI-powered PDF tools"
              className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
            />
            {/* Overlay play button */}
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <MotionWrapper
                as="div"
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-xl cursor-pointer"
                whileHover={{ scale: 1.15, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Play size={24} className="sm:w-8 sm:h-8 text-blue-600 ml-1" fill="currentColor" />
              </MotionWrapper>
            </div>
          </TiltCard>

          {/* Floating stats */}
          <MotionWrapper
            as="div"
            className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-white p-2 sm:p-4 rounded-xl shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <MotionWrapper
              as="div"
              className="text-xl sm:text-2xl font-bold text-blue-600"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              50K+
            </MotionWrapper>
            <div className="text-xs sm:text-sm text-gray-600">Videos Created</div>
          </MotionWrapper>

          <MotionWrapper
            as="div"
            className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-white p-2 sm:p-4 rounded-xl shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <MotionWrapper
              as="div"
              className="text-xl sm:text-2xl font-bold text-emerald-600"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 0.5
              }}
            >
              98%
            </MotionWrapper>
            <div className="text-xs sm:text-sm text-gray-600">Satisfaction</div>
          </MotionWrapper>
        </MotionWrapper>
      </div>
    </section>
  );
}

