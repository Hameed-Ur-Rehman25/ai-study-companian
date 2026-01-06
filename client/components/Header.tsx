
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, Video, MessageCircle, Sparkles, FileText, User as UserIcon, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, signOut } = useAuth()
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isToolsDropdownOpen || isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isToolsDropdownOpen, isProfileDropdownOpen])

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

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setIsMenuOpen(false)
  }

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
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-[fadeIn_0.2s_ease-in-out]"
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
              href="/#pricing"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
            >
              FAQ
            </Link>

          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon size={18} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 animate-[fadeIn_0.2s_ease-in-out]">
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserIcon size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm font-medium transition-all">
                  Sign In
                </Link>
                <Link href="/signup" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 text-sm font-medium shadow-md hover:shadow-lg transition-all">
                  Sign Up
                </Link>
              </>
            )}

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
          className={`lg:hidden fixed inset-0 top-16 sm:top-20 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
                href="/#pricing"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                FAQ
              </Link>

              <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Signed in as <span className="font-semibold text-gray-900">{user.email}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-2"
                    >
                      <UserIcon size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full block text-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                      Sign In
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="w-full block text-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 text-sm font-medium shadow-md transition-all">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
