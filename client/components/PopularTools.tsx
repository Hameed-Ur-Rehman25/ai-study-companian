import Link from 'next/link';
import { TiltCard } from './ui/TiltCard';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { MotionWrapper } from './ui/MotionWrapper';
import { ToolService } from '../services/ToolService';
import { Tool } from '../models/Tool';

interface PopularToolsProps {
  tools?: Tool[];
}

export function PopularTools({ tools }: PopularToolsProps) {
  // Use service to get tools if not provided (MVC pattern)
  const toolsData = tools || ToolService.getAllTools();
  return (
    <section className="mt-8 sm:mt-12 mb-8 sm:mb-12" aria-labelledby="popular-tools-heading">
      <MotionWrapper
        as="div"
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 id="popular-tools-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Your <span className="text-blue-600">AI Study Toolkit</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Three powerful AI features to transform how you learn: create video lectures, chat with documents, and get instant summaries.
        </p>
      </MotionWrapper>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {toolsData.map((tool, index) => {
          const CardContent = (
            <TiltCard
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl cursor-pointer relative overflow-hidden group ${tool.featured ? 'ring-2 ring-blue-500' : ''
                }`}
              options={{
                max: 15,
                perspective: 1000,
                scale: 1.05,
                speed: 1000,
              }}
            >
              {tool.featured && (
                <MotionWrapper
                  as="div"
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full z-10"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  ⭐ Featured
                </MotionWrapper>
              )}

              <div className="relative mb-4">
                <AnimatedIcon
                  delay={index * 0.1}
                  hoverScale={1.3}
                  className={`${tool.color} text-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow`}
                >
                  <tool.icon size={24} className="sm:w-7 sm:h-7" />
                </AnimatedIcon>

                {/* Glow effect */}
                <div className={`absolute inset-0 ${tool.color} opacity-0 group-hover:opacity-20 blur-xl rounded-xl transition-opacity`}></div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {tool.description}
              </p>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 rounded-2xl transition-all pointer-events-none"></div>
            </TiltCard>
          )

          return (
            <MotionWrapper
              key={tool.name}
              as="div"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {tool.href ? (
                <Link href={tool.href} className="block">
                  {CardContent}
                </Link>
              ) : (
                CardContent
              )}
            </MotionWrapper>
          )
        })}
      </div>
    </section>
  );
}
