import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, Video, MessageCircle, Sparkles, FileText } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false)
      }
    }

    if (isToolsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isToolsDropdownOpen])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const toolsMenuItems = [
    { icon: Video, label: 'PDF to Video', description: 'Convert PDFs to videos' },
    { icon: MessageCircle, label: 'Chat with PDF', description: 'AI-powered chat' },
    { icon: Sparkles, label: 'Summarize PDF', description: 'Quick summaries' },
    { icon: FileText, label: 'All PDF Tools', description: 'View all tools' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-sm sm:text-base">AI</span>
            </div>
            <span className="text-gray-900 font-bold text-lg sm:text-xl group-hover:text-blue-600 transition-colors">
              PDF AI Studio
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                onMouseEnter={() => setIsToolsDropdownOpen(true)}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1.5 transition-all text-sm font-medium group"
              >
                Tools
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {/* Dropdown Menu */}
              {isToolsDropdownOpen && (
                <div
                  onMouseLeave={() => setIsToolsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-\[fadeIn_0\.2s_ease-in-out\]"
                >
                  {toolsMenuItems.map((item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <item.icon size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="#features"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
            >
              AI Features
            </Link>
            <Link
              href="#pricing"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="#resources"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
            >
              Resources
            </Link>
            <Link
              href="#about"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
            >
              About
            </Link>
          </nav>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm font-medium transition-all">
              Sign In
            </button>
            <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 text-sm font-medium shadow-md hover:shadow-lg transition-all">
              Free Trial
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`lg:hidden fixed inset-0 top-16 sm:top-20 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto px-4 py-6">
            <nav className="flex flex-col gap-1">
              {/* Tools Section */}
              <div className="mb-2">
                <button
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <span>Tools</span>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isToolsDropdownOpen && (
                  <div className="mt-1 ml-4 space-y-1 border-l-2 border-blue-100 pl-4">
                    {toolsMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        href="#"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <item.icon size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                AI Features
              </Link>
              <Link
                href="#pricing"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                href="#resources"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                Resources
              </Link>
              <Link
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                About
              </Link>

              <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 text-sm font-medium shadow-md transition-all"
                >
                  Free Trial
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

