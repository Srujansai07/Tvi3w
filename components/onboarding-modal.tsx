'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface OnboardingModalProps {
    userId: string
    onComplete: () => void
}

export default function OnboardingModal({ userId, onComplete }: OnboardingModalProps) {
    const supabase = createClient()
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        profession: '',
        industry: '',
    })

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    name: formData.name,
                    profession: formData.profession,
                    industry: formData.industry,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId)

            if (error) throw error

            onComplete()
            router.refresh()
        } catch (error) {
            console.error('Onboarding error:', error)
        } finally {
            setLoading(false)
        }
    }

    const totalSteps = 3

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to Tvi3W! 🎉</h2>
                    <p className="text-gray-400">Let's get you set up in just a few steps.</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 w-12 rounded-full transition-colors ${s <= step ? 'bg-blue-500' : 'bg-gray-600'}`}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">What's your name?</h3>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your full name"
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">What do you do?</h3>
                        <input
                            type="text"
                            value={formData.profession}
                            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                            placeholder="e.g., Product Manager, Engineer"
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">What industry are you in?</h3>
                        <select
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select an industry</option>
                            <option value="Technology">Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Education">Education</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={onComplete}
                            className="px-6 py-2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
                        >
                            Skip for now
                        </button>
                    )}

                    {step < totalSteps ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : null}
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
