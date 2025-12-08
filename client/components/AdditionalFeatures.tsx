import { ImageWithFallback } from './figma/ImageWithFallback';
import { FileText, File, Presentation, Mail, Image, Edit, Merge, Archive, Shield, Users, Heart, Share2 } from 'lucide-react';

export function AdditionalFeatures() {
  return (
    <section className="mt-8 sm:mt-12 mb-8 sm:mb-12" aria-labelledby="additional-features-heading">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Most Popular PDF Tools */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          Quick Access <span className="text-blue-600">Tools</span>
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">
          Access all our essential PDF tools in one place. From conversion to editing, everything you need is just a click away.
        </p>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          {[
            { name: 'Compress PDF', icon: Archive, color: 'bg-teal-500' },
            { name: 'PDF to Word', icon: FileText, color: 'bg-blue-500' },
            { name: 'PDF to Excel', icon: File, color: 'bg-orange-500' },
            { name: 'Word to PDF', icon: FileText, color: 'bg-green-500' },
            { name: 'JPG to PDF', icon: Image, color: 'bg-blue-500' },
            { name: 'Sign PDF', icon: Edit, color: 'bg-yellow-500' },
            { name: 'Merge PDF', icon: Merge, color: 'bg-indigo-500' },
            { name: 'Compress PDF', icon: Archive, color: 'bg-red-500' }
          ].map((tool, idx) => (
            <div key={idx} className="flex items-start gap-1.5 sm:gap-2">
              <div className={`${tool.color} text-white w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0`}>
                <tool.icon size={14} className="sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm text-gray-900 font-medium truncate">{tool.name}</div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs sm:text-sm transition-colors">
          See all PDF Tools →
        </button>
      </div>
      
      {/* How It Works */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          How It <span className="text-blue-600">Works</span>
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">
          Our intuitive interface makes working with PDFs simple and efficient. Upload, process, and download in just a few clicks.
        </p>
        
        <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
            <div className="flex gap-1.5 sm:gap-2 mb-2">
              {[Edit, FileText, Share2, Image].map((Icon, idx) => (
                <div key={idx} className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded flex items-center justify-center">
                  <Icon size={10} className="sm:w-3 sm:h-3 text-gray-600" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded h-12 sm:h-16"></div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
            <div className="flex gap-1.5 sm:gap-2 mb-2">
              {[Edit, FileText, Share2].map((Icon, idx) => (
                <div key={idx} className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded flex items-center justify-center">
                  <Icon size={10} className="sm:w-3 sm:h-3 text-gray-600" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded h-12 sm:h-16"></div>
          </div>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2">Cloud-Based Processing</h4>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Work directly from your browser without installing any software. All processing happens securely in the cloud, accessible from any device.
        </p>
        <div className="text-blue-600 text-xs sm:text-sm mt-2 cursor-pointer hover:underline">See full demo →</div>
      </div>
      
      <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2">Batch Processing Available</h4>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Process multiple PDFs at once to save time. Upload entire folders and let our AI handle the rest automatically.
        </p>
        <div className="text-blue-600 text-xs sm:text-sm mt-2 cursor-pointer hover:underline">Learn more →</div>
      </div>
      
      {/* Mobile App Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 sm:p-6 text-white relative overflow-hidden lg:col-span-2">
        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">
            Access on <span className="text-blue-400">Any Device</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 leading-relaxed">
            Work seamlessly across desktop, tablet, and mobile. Your PDFs are always accessible, wherever you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-3 sm:px-4 py-2 bg-white text-gray-900 rounded-lg text-xs sm:text-sm hover:bg-gray-100 transition-colors font-medium">
              📱 App Store
            </button>
            <button className="px-3 sm:px-4 py-2 bg-white text-gray-900 rounded-lg text-xs sm:text-sm hover:bg-gray-100 transition-colors font-medium">
              🤖 Play Store
            </button>
          </div>
        </div>
        
        {/* Phone mockup */}
        <div className="absolute -right-2 sm:-right-4 bottom-0 hidden sm:block">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMGFwcHxlbnwxfHx8fDE3NjQyNDM3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Mobile app"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover opacity-30"
          />
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm lg:col-span-2">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          Why Choose <span className="text-blue-600">Our Platform?</span>
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">
          Trusted by thousands of users worldwide, we deliver enterprise-grade security with consumer-friendly simplicity.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-pink-50 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-pink-500 text-white rounded-lg flex items-center justify-center shrink-0">
                <Shield size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">Bank-Level Security</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Your files are encrypted with 256-bit SSL encryption. We never store your documents after processing.
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-600 text-white rounded-lg flex items-center justify-center shrink-0">
                <FileText size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">Lightning Fast</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Advanced AI algorithms process your PDFs in seconds, not minutes. Experience the speed difference.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center shrink-0">
                <Heart size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">50K+ Happy Users</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Join thousands of satisfied users who have transformed their PDF workflow with our platform.
            </p>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-teal-500 text-white rounded-lg flex items-center justify-center shrink-0">
                <Users size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">24/7 Support</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our dedicated support team is always ready to help you with any questions or issues.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center shrink-0">
                <FileText size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">ISO 27001 Certified</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We maintain the highest international standards for information security management.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-2.5 sm:p-3 text-white">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white text-gray-800 rounded-lg flex items-center justify-center shrink-0">
                <Shield size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-semibold">GDPR Compliant</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Full compliance with data protection regulations. Your privacy is our top priority.
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

