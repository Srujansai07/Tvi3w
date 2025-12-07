'use client'

const PLANS = [
    { name: 'Free', price: '$0', period: '/forever', features: ['Up to 50 meetings', '100 notes', 'Basic AI analysis', 'Email support'], current: true },
    { name: 'Pro', price: '$9', period: '/month', features: ['Unlimited meetings', 'Unlimited notes', 'Advanced AI', 'Priority support', 'Integrations', 'Export data'], current: false, popular: true },
    { name: 'Team', price: '$29', period: '/month', features: ['Everything in Pro', '5 team members', 'Shared calendar', 'Admin dashboard', 'API access', 'Custom integrations'], current: false },
]

export default function BillingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-4">Plans & Billing</h1>
                    <p className="text-gray-400">Choose the plan that works for you</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {PLANS.map(plan => (
                        <div key={plan.name} className={`bg-gray-800 rounded-2xl p-6 border-2 relative ${plan.popular ? 'border-blue-500' : 'border-gray-700'}`}>
                            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">Most Popular</div>}
                            <h2 className="text-xl font-bold text-white mb-2">{plan.name}</h2>
                            <div className="mb-6"><span className="text-4xl font-bold text-white">{plan.price}</span><span className="text-gray-500">{plan.period}</span></div>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map(f => <li key={f} className="text-gray-400 flex items-center gap-2"><span className="text-green-400">✓</span>{f}</li>)}
                            </ul>
                            <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.current ? 'bg-gray-700 text-gray-400 cursor-default' : plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                                {plan.current ? 'Current Plan' : 'Upgrade'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-white font-semibold mb-4">Billing History</h3>
                    <div className="text-gray-500 text-center py-8">No billing history - you're on the free plan</div>
                </div>
            </div>
        </div>
    )
}
