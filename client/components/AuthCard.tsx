
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import { User, Lock, Mail, Facebook, Github, Linkedin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface AuthCardProps {
    initialMode?: 'login' | 'signup'
}

export const AuthCard = ({ initialMode = 'login' }: AuthCardProps) => {
    const router = useRouter()
    // True = Signup Mode (Blue Right, Form Left)
    // False = Login Mode (Blue Left, Form Right)
    const [isSignUp, setIsSignUp] = useState(initialMode === 'signup')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form inputs
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')

    // Reset error when switching modes
    useEffect(() => {
        setError(null)
    }, [isSignUp])

    // Update URL shallowly when switching modes so refreshing keeps the state
    const toggleMode = () => {
        const newMode = !isSignUp
        setIsSignUp(newMode)
        const path = newMode ? '/signup' : '/login'
        router.push(path, undefined, { shallow: true })
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isSignUp) {
                // Signup Logic
                if (password !== confirmPassword) {
                    throw new Error("Passwords don't match")
                }
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    // valid Supabase options if using metadata
                    // options: { data: { username } } 
                })
                if (error) throw error
                // On success, usually redirect or show distinct message. 
                // For now, redirect to home/login
                router.push('/')
            } else {
                // Login Logic
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        setLoading(true)
        setError(null)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            })
            if (error) throw error
        } catch (error: any) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl relative overflow-hidden max-w-4xl w-full min-h-[600px] flex">

            {/* 
               Forms Container 
            */}

            {/* Sign Up Form - Always on Left */}
            <div className={`transition-all duration-700 w-1/2 p-12 flex flex-col justify-center items-center h-full absolute left-0 top-0 ${isSignUp ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Registration</h2>
                    <form className="space-y-4" onSubmit={handleAuth}>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Username (Optional)"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B86E5] focus:border-transparent outline-none"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B86E5] focus:border-transparent outline-none"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B86E5] focus:border-transparent outline-none"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B86E5] focus:border-transparent outline-none"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#5B86E5] text-white rounded-xl font-bold shadow-lg hover:bg-[#4a75d4] transform hover:-translate-y-0.5 transition-all"
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or register with</span></div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleGoogleAuth}
                                className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-gray-700 font-medium"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M21.35,11.1H12v3.8h5.6c-0.5,2.3-2.5,4-5.6,4c-3.3,0-6-2.7-6-6s2.7-6,6-6c1.5,0,2.8,0.5,3.8,1.4l2.9-2.8C17.2,2.9,14.8,2,12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.8,0,9.6-4.1,9.6-9.8c0-0.7-0.1-1.3-0.2-1.9L21.35,11.1z"
                                    />
                                </svg>
                                Sign up with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Form - Always on Right */}
            <div className={`transition-all duration-700 w-1/2 p-12 flex flex-col justify-center items-center h-full absolute right-0 top-0 ${!isSignUp ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Login</h2>
                    <form className="space-y-6" onSubmit={handleAuth}>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B86E5] focus:border-transparent outline-none"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B86E5] focus:border-transparent outline-none"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#5B86E5]">Forgot password?</a>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#5B86E5] text-white rounded-xl font-bold shadow-lg hover:bg-[#4a75d4] transform hover:-translate-y-0.5 transition-all"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or login with</span></div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleGoogleAuth}
                                className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-gray-700 font-medium"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M21.35,11.1H12v3.8h5.6c-0.5,2.3-2.5,4-5.6,4c-3.3,0-6-2.7-6-6s2.7-6,6-6c1.5,0,2.8,0.5,3.8,1.4l2.9-2.8C17.2,2.9,14.8,2,12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.8,0,9.6-4.1,9.6-9.8c0-0.7-0.1-1.3-0.2-1.9L21.35,11.1z"
                                    />
                                </svg>
                                Login with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sliding Overlay */}
            <motion.div
                className="absolute top-0 w-1/2 h-full bg-[#5B86E5] text-white z-40 overflow-hidden flex flex-col justify-center items-center"
                initial={false}
                animate={{ x: isSignUp ? '100%' : '0%' }}
                transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
            >
                {/* Decorative Shapes */}
                <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Overlay Content */}
                <div className="relative z-10 p-12 text-center flex flex-col items-center">
                    <AnimatePresence mode='wait'>
                        {isSignUp ? (
                            <motion.div
                                key="signup-overlay"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="space-y-6"
                            >
                                <h2 className="text-4xl font-bold">Welcome Back!</h2>
                                <p className="text-blue-100">
                                    Already have an account?
                                </p>
                                <button
                                    onClick={toggleMode}
                                    className="px-10 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#5B86E5] transition-all shadow-md"
                                >
                                    Login
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="login-overlay"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="space-y-6"
                            >
                                <h2 className="text-4xl font-bold">Hello, Welcome!</h2>
                                <p className="text-blue-100">
                                    Don't have an account?
                                </p>
                                <button
                                    onClick={toggleMode}
                                    className="px-10 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#5B86E5] transition-all shadow-md"
                                >
                                    Register
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Mobile View Toggle (Hidden on Md+) - Fallback if standard media queries hide the overlay on small screens */}
            {/* 
               Note: The current design with absolute split 50/50 doesn't work well on mobile. 
               We should handle mobile responsiveness. 
               On mobile, we usually stack. 
               Layout:
               [ Form ]
               [ Link to switch ]
            */}
            <div className="md:hidden absolute inset-0 bg-white z-50 flex flex-col p-6 overflow-y-auto">
                {isSignUp ? (
                    // Mobile Signup
                    <div className="flex flex-col h-full justify-center">
                        <h2 className="text-2xl font-bold mb-6 text-center">Registration</h2>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <input type="text" placeholder="Username" className="w-full p-4 bg-gray-50 rounded-xl" value={username} onChange={e => setUsername(e.target.value)} />
                            <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} />
                            <input type="password" placeholder="Confirm Password" className="w-full p-4 bg-gray-50 rounded-xl" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            <button type="submit" className="w-full py-4 bg-[#5B86E5] text-white rounded-xl font-bold">Register</button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">Already have an account? <button onClick={toggleMode} className="text-[#5B86E5] font-semibold">Login</button></p>
                        </div>
                    </div>
                ) : (
                    // Mobile Login
                    <div className="flex flex-col h-full justify-center">
                        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} />
                            <button type="submit" className="w-full py-4 bg-[#5B86E5] text-white rounded-xl font-bold">Login</button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">Don't have an account? <button onClick={toggleMode} className="text-[#5B86E5] font-semibold">Register</button></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
