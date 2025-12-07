export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
                <div className="space-y-6 text-gray-400">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">Data Collection</h2>
                        <p>We collect only the data necessary to provide our services: email, name, meetings, notes, and contacts you create.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">Data Usage</h2>
                        <p>Your data is used solely to provide Tvi3W services. We do not sell or share your personal information with third parties.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">Data Storage</h2>
                        <p>All data is securely stored in Supabase with encryption at rest and in transit.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">AI Processing</h2>
                        <p>Meeting notes may be processed by Google Gemini AI for analysis. This processing is done securely and data is not retained by AI providers.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">Your Rights</h2>
                        <p>You can export or delete your data at any time from the Settings page.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
                        <p>For privacy concerns, contact us through the Feedback page.</p>
                    </section>
                </div>
                <p className="text-gray-500 text-sm mt-8">Last updated: December 2024</p>
            </div>
        </div>
    )
}
