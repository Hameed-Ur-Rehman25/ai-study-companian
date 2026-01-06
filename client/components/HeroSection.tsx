import { ImageWithFallback } from './figma/ImageWithFallback';
import { Video, MessageCircle, Sparkles, Play, ChevronRight, CheckCircle2 } from 'lucide-react';
import { MotionWrapper } from './ui/MotionWrapper';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { TiltCard } from './ui/TiltCard';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-100/40 blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-100/40 to-pink-100/40 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-100/40 to-teal-100/40 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <MotionWrapper
            as="div"
            className="relative z-10 max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <MotionWrapper
              as="div"
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v2.0 Now Available with Video Generation
            </MotionWrapper>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Master Your Studies with <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                AI Intelligence
              </span>
            </h1>

            <p className="text-lg sm:text-x text-gray-600 mb-8 leading-relaxed">
              Stop struggling with dense PDFs. Instantly convert lectures to video, chat with textbooks, and generate summaries. The all-in-one platform for modern learners.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group">
                Start Learning Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5 text-blue-600" fill="currentColor" />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                  +2k
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">{'★★★★★'}</div>
                <span className="font-medium text-gray-700">4.9/5 from students</span>
              </div>
            </div>

            {/* Trusted By Ticker */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Trusted by students from</p>
              <div className="flex flex-wrap gap-x-8 gap-y-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {['Stanford', 'MIT', 'Harvard', 'Oxford', 'Cambridge'].map(uni => (
                  <span key={uni} className="text-lg font-bold font-serif text-gray-600">{uni}</span>
                ))}
              </div>
            </div>

          </MotionWrapper>

          {/* Right Image/Visual */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/5] mx-auto">
              <TiltCard
                className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
                options={{ max: 5, scale: 1.02 }}
              >
                <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 w-60 h-6 rounded-md bg-white border border-gray-200"></div>
                </div>

                <div className="flex-1 relative bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop"
                    alt="App Dashboard Interface"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Floating Feature Cards */}
                  <MotionWrapper
                    as="div"
                    className="absolute bottom-8 right-[-20px] bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-[200px]"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Video size={16} />
                      </div>
                      <span className="font-bold text-sm">Video Ready!</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[100%]"></div>
                    </div>
                  </MotionWrapper>

                  <MotionWrapper
                    as="div"
                    className="absolute top-32 left-[-20px] bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Summary Done</div>
                      <div className="text-xs text-gray-500">24 pages processed</div>
                    </div>
                  </MotionWrapper>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

