
import { Check } from 'lucide-react'
import { MotionWrapper } from './ui/MotionWrapper'

const tiers = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for trying out the features.',
        features: [
            '5 PDF Conversions per month',
            'Basic Video Quality',
            'Standard Processing Speed',
            'Chat with PDF (Limited)'
        ],
        cta: 'Get Started',
        popular: false
    },
    {
        name: 'Pro',
        price: '$19',
        description: 'For students and professionals who need more.',
        features: [
            'Unlimited PDF Conversions',
            'HD Video Quality',
            'Priority Processing',
            'Advanced AI Chat Features',
            'Priority Support'
        ],
        cta: 'Upgrade to Pro',
        popular: true
    },
    {
        name: 'Team',
        price: '$49',
        description: 'For study groups and classrooms.',
        features: [
            'Everything in Pro',
            'Collaborative Spaces',
            'Admin Dashboard',
            'API Access',
            'Dedicated Support'
        ],
        cta: 'Contact Sales',
        popular: false
    }
]

export const Pricing = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <MotionWrapper
                    as="div"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-gray-600">Choose the plan that fits your needs.</p>
                </MotionWrapper>

                <div className="grid md:grid-cols-3 gap-8">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl shadow-lg p-8 border ${tier.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'}`}
                        >
                            {tier.popular && (
                                <span className="absolute top-0 right-0 -mr-2 -mt-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                    Most Popular
                                </span>
                            )}
                            <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                            <p className="mt-2 text-gray-500">{tier.description}</p>
                            <div className="mt-4 flex items-baseline text-gray-900">
                                <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                                <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
                            </div>
                            <ul className="mt-6 space-y-4">
                                {tier.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex">
                                        <Check className="flex-shrink-0 w-6 h-6 text-green-500" />
                                        <span className="ml-3 text-gray-500">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <button className={`w-full block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors ${tier.popular ? 'shadow-lg' : ''}`}>
                                    {tier.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
