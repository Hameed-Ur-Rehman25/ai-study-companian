import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12 sm:mt-16" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">


        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-bold text-base sm:text-lg">PDF AI Studio</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Transform your learning experience with AI. Convert lectures, chat with texts, and master your studies.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" aria-label="Facebook" className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Products</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="/pdf-to-video" className="text-gray-400 hover:text-white transition-colors">PDF to Video</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chat with PDF</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Summarize PDF</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Knowledge Graph</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Use Cases</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Students</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Researchers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Educators</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Enterprise</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Legal</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 sm:py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} PDF AI Studio. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

