import { Mail, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12 sm:mt-16" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Newsletter Section */}
        <div className="py-8 sm:py-12 border-b border-gray-800">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Get the latest features, tips, and exclusive offers delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
              <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 whitespace-nowrap text-sm sm:text-base transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg"></div>
              <span className="text-white font-semibold text-base sm:text-lg">PDF AI Studio</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Transform your PDFs with cutting-edge AI technology. Create video lectures, chat with documents, and more.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" aria-label="Facebook" className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                <Youtube size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Products</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">PDF to Video</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chat with PDF</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Summarize PDF</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Convert PDF</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Edit PDF</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Merge PDF</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Solutions</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Education</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Business</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Students</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Teachers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Enterprise</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Access</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Video Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Affiliates</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 sm:py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © 2024 PDF AI Studio. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

