'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STEPS = [
    {
        id: 1,
        title: 'Welcome to Tvi3W',
        description: 'Your AI-powered meeting assistant for smarter productivity.',
        icon: '👋',
    },
    {
        id: 2,
        title: 'Schedule Meetings',
        description: 'Create and manage meetings with ease. Set recurring schedules, add participants, and never miss an important discussion.',
        icon: '📅',
    },
    {
        id: 3,
        title: 'Manage Contacts',
        description: 'Keep all your professional contacts organized. Import from CSV, group by company, and track relationships.',
        icon: '👥',
    },
    {
        id: 4,
        title: 'Take Smart Notes',
        description: 'Capture ideas quickly with Quick Notes. Tag, search, and organize your thoughts effortlessly.',
        icon: '📝',
    },
    {
        id: 5,
        title: 'AI-Powered Analysis',
        description: 'Get intelligent insights from your meeting notes. Extract action items, summarize discussions, and identify key topics.',
        icon: '🤖',
    },
    {
        id: 6,
        title: 'You\'re All Set!',
        description: 'Start your productivity journey now. Let\'s create your first meeting!',
        icon: '🚀',
    },
]

export default function OnboardingPage() {
    const supabase = createClient()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [completing, setCompleting] = useState(false)

    const handleComplete = async () => {
        setCompleting(true)
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
            await supabase.auth.updateUser({
                data: { onboarding_completed: true }
            })
        }

        router.push('/dashboard')
    }

    const step = STEPS[currentStep]
    const isLast = currentStep === STEPS.length - 1
    const isFirst = currentStep === 0

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-colors ${i <= currentStep ? 'bg-blue-600' : 'bg-gray-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Card */}
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
                    <div className="text-6xl mb-6">{step.icon}</div>
                    <h1 className="text-2xl font-bold text-white mb-4">{step.title}</h1>
                    <p className="text-gray-400 mb-8">{step.description}</p>

                    {/* Navigation */}
                    <div className="flex gap-4">
                        {!isFirst && (
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
                            >
                                Back
                            </button>
                        )}

                        {isLast ? (
                            <button
                                onClick={handleComplete}
                                disabled={completing}
                                className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                            >
                                {completing ? 'Getting Started...' : 'Get Started'}
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                            >
                                Next
                            </button>
                        )}
                    </div>

                    {/* Skip */}
                    {!isLast && (
                        <button
                            onClick={handleComplete}
                            className="mt-4 text-gray-500 hover:text-gray-400 text-sm transition-colors"
                        >
                            Skip onboarding
                        </button>
                    )}
                </div>

                {/* Step indicator */}
                <div className="text-center mt-6 text-gray-500 text-sm">
                    Step {currentStep + 1} of {STEPS.length}
                </div>
            </div>
        </div>
    )
}
