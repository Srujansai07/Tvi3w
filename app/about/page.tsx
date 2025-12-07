export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="text-6xl mb-4">🚀</div>
                    <h1 className="text-4xl font-bold text-white mb-4">About Tvi3W</h1>
                    <p className="text-xl text-gray-400">Your AI-Powered Personal Meeting Assistant</p>
                </div>

                <div className="space-y-8">
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed">Tvi3W is designed to revolutionize how you manage meetings, notes, and professional relationships. We leverage AI to help you stay organized, capture important insights, and never miss a follow-up.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                            <div className="text-4xl mb-3">📅</div>
                            <h3 className="text-white font-semibold mb-2">Smart Scheduling</h3>
                            <p className="text-gray-500 text-sm">Intelligent meeting management with templates and recurring support</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                            <div className="text-4xl mb-3">🤖</div>
                            <h3 className="text-white font-semibold mb-2">AI Analysis</h3>
                            <p className="text-gray-500 text-sm">Extract insights, action items, and summaries automatically</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                            <div className="text-4xl mb-3">🔒</div>
                            <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
                            <p className="text-gray-500 text-sm">Your data is encrypted and protected</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Built with ❤️</h2>
                        <p className="text-blue-100">Using Next.js, Supabase, and Google Gemini AI</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
