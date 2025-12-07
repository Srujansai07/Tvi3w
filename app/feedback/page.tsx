'use client'

import { useState } from 'react'

export default function FeedbackPage() {
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ type: 'feedback', message: '', rating: 5 })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-lg mx-auto text-center py-16">
                    <div className="text-6xl mb-4">🙏</div>
                    <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
                    <p className="text-gray-400">Your feedback has been submitted. We appreciate your input!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-8"><span className="text-4xl">💬</span><div><h1 className="text-3xl font-bold text-white">Feedback</h1><p className="text-gray-400">Help us improve Tvi3W</p></div></div>

                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3">
                            <option value="feedback">General Feedback</option>
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                            <option value="support">Support</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(n => (
                                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className={`w-12 h-12 rounded-lg text-2xl transition-colors ${form.rating >= n ? 'bg-yellow-500' : 'bg-gray-700'}`}>
                                    ⭐
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 resize-none" placeholder="Tell us what you think..." required />
                    </div>

                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">Submit Feedback</button>
                </form>
            </div>
        </div>
    )
}
