import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { API_BASE_URL } from '../config/api'
import { FileText, Video, MessageCircle, BarChart2, Shield, Settings, User } from 'lucide-react'
import Link from 'next/link'

interface UserStats {
    summary_count: number
    video_count: number
    chat_count: number
    subscription_plan: string
}

const Dashboard: NextPage = () => {
    const { user, session, loading } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState<UserStats | null>(null)
    const [isLoadingStats, setIsLoadingStats] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    useEffect(() => {
        const fetchStats = async () => {
            if (!session?.access_token) return;

            try {
                const response = await fetch(`${API_BASE_URL}/api/user/stats`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                }
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setIsLoadingStats(false)
            }
        }

        if (user) {
            fetchStats()
        }
    }, [user, session])

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Dashboard - AI Study Companion</title>
            </Head>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />

                <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
                        <p className="text-gray-600">{user.email}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Summary Stats */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Summaries Generated</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {isLoadingStats ? '-' : stats?.summary_count}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <FileText className="text-purple-600" size={24} />
                            </div>
                        </div>

                        {/* Video Stats */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Videos Created</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {isLoadingStats ? '-' : stats?.video_count}
                                    </p>
                                    {!isLoadingStats && stats && (
                                        <span className="text-sm text-gray-500">
                                            / {stats.subscription_plan === 'Pro' ? '10' : '1'}
                                        </span>
                                    )}
                                </div>
                                {!isLoadingStats && stats && (
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${stats.subscription_plan === 'Pro' ? 'bg-blue-500' : 'bg-orange-500'}`}
                                            style={{
                                                width: `${Math.min(100, (stats.video_count / (stats.subscription_plan === 'Pro' ? 10 : 1)) * 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Video className="text-blue-600" size={24} />
                            </div>
                        </div>

                        {/* Chat Stats */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Chat Sessions</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {isLoadingStats ? '-' : stats?.chat_count}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <MessageCircle className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BarChart2 size={20} className="text-gray-500" />
                                Quick Actions
                            </h2>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                                    <Link href="/summarize-pdf" className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <FileText className="text-purple-600" size={20} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Summarize PDF</h3>
                                        <p className="text-sm text-gray-500">Get quick summaries of your documents</p>
                                    </Link>

                                    <Link href="/pdf-to-video" className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Video className="text-blue-600" size={20} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">PDF to Video</h3>
                                        <p className="text-sm text-gray-500">Convert lecture notes into engaging videos</p>
                                    </Link>

                                    <Link href="/chat-with-pdf" className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <MessageCircle className="text-green-600" size={20} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Chat with PDF</h3>
                                        <p className="text-sm text-gray-500">Ask questions and get instant answers</p>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={20} className="text-gray-500" />
                                Your Profile
                            </h2>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{user.email?.split('@')[0]}</p>
                                        <p className="text-sm text-gray-500">
                                            {isLoadingStats ? 'Loading...' : `${stats?.subscription_plan} Plan`}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Shield size={18} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Account Status</span>
                                        </div>
                                        <span className="text-sm text-green-600 font-medium">Active</span>
                                    </div>

                                    {stats?.subscription_plan !== 'Pro' && (
                                        <Link href="/#pricing" className="block w-full text-center py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                                            Upgrade to Pro
                                        </Link>
                                    )}
                                    {stats?.subscription_plan === 'Pro' && (
                                        <button className="block w-full text-center py-2 px-4 bg-gray-100 text-gray-500 rounded-lg cursor-default font-medium text-sm">
                                            Pro Active
                                        </button>
                                    )}

                                    <hr className="border-gray-100" />

                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                                try {
                                                    const res = await fetch(`${API_BASE_URL}/api/user`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Authorization': `Bearer ${session?.access_token}`
                                                        }
                                                    });
                                                    if (res.ok) {
                                                        await useAuth().signOut();
                                                        router.push('/login');
                                                    } else {
                                                        const data = await res.json();
                                                        alert(data.detail || 'Failed to delete account');
                                                    }
                                                } catch (e) {
                                                    console.error(e);
                                                    alert('An error occurred');
                                                }
                                            }
                                        }}
                                        className="block w-full text-center py-2 px-4 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}

export default Dashboard
