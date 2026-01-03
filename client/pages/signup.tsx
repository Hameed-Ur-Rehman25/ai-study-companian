
import Head from 'next/head'
import { MotionWrapper } from '../components/ui/MotionWrapper'
import { AuthCard } from '../components/AuthCard'

export default function Signup() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Head>
                <title>Sign up - AI Study Companion</title>
            </Head>
            <div className="flex-grow flex items-center justify-center p-4">
                <MotionWrapper
                    as="div"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-4xl"
                >
                    <AuthCard initialMode="signup" />
                </MotionWrapper>
            </div>
        </div>
    )
}
