'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FocusModePage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [focusMode, setFocusMode] = useState(false)
    const [timer, setTimer] = useState(25 * 60) // 25 minutes
    const [isRunning, setIsRunning] = useState(false)
    const [sessions, setSessions] = useState(0)
    const [selectedDuration, setSelectedDuration] = useState(25)

    useEffect(() => {
        async function loadSession() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const focusSessions = session.user.user_metadata?.focus_sessions || 0
            setSessions(focusSessions)
            setLoading(false)
        }

        loadSession()
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1)
            }, 1000)
        } else if (timer === 0 && isRunning) {
            setIsRunning(false)
            handleSessionComplete()
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, timer])

    const handleSessionComplete = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const newSessions = sessions + 1
        await supabase.auth.updateUser({
            data: { focus_sessions: newSessions }
        })
        setSessions(newSessions)

        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Focus Session Complete!', {
                body: 'Great job! Take a short break.',
                icon: '🎯'
            })
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const startTimer = () => {
        setTimer(selectedDuration * 60)
        setIsRunning(true)
        setFocusMode(true)
    }

    const pauseTimer = () => {
        setIsRunning(!isRunning)
    }

    const resetTimer = () => {
        setIsRunning(false)
        setTimer(selectedDuration * 60)
        setFocusMode(false)
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="bg-gray-800 rounded-xl p-12 h-64"></div>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen transition-colors ${focusMode ? 'bg-gray-950' : 'bg-gray-900'}`}>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {!focusMode && (
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-4xl">🧘</span>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Focus Mode</h1>
                                <p className="text-gray-400">Eliminate distractions, boost productivity</p>
                            </div>
                        </div>
                    )}

                    {/* Timer Card */}
                    <div className={`rounded-2xl p-8 text-center transition-all ${focusMode ? 'bg-gray-900 border-2 border-blue-600' : 'bg-gray-800 border border-gray-700'
                        }`}>
                        {!focusMode ? (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-xl text-white font-semibold mb-4">Select Duration</h2>
                                    <div className="flex gap-4 justify-center">
                                        {[15, 25, 45, 60].map(mins => (
                                            <button
                                                key={mins}
                                                onClick={() => setSelectedDuration(mins)}
                                                className={`w-16 h-16 rounded-xl font-bold transition-colors ${selectedDuration === mins
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                            >
                                                {mins}m
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={startTimer}
                                    className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xl transition-colors"
                                >
                                    Start Focus Session
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Timer Display */}
                                <div className="mb-8">
                                    <div className="text-8xl font-mono font-bold text-white mb-4">
                                        {formatTime(timer)}
                                    </div>
                                    <div className="text-gray-400">
                                        {isRunning ? 'Stay focused...' : 'Paused'}
                                    </div>
                                </div>

                                {/* Progress Ring */}
                                <div className="mb-8">
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all"
                                            style={{ width: `${(1 - timer / (selectedDuration * 60)) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={pauseTimer}
                                        className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
                                    >
                                        {isRunning ? 'Pause' : 'Resume'}
                                    </button>
                                    <button
                                        onClick={resetTimer}
                                        className="px-8 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl font-semibold transition-colors"
                                    >
                                        End Session
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                            <div className="text-3xl font-bold text-blue-400">{sessions}</div>
                            <div className="text-gray-400 text-sm">Sessions Completed</div>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                            <div className="text-3xl font-bold text-green-400">{sessions * 25}</div>
                            <div className="text-gray-400 text-sm">Focus Minutes</div>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                            <div className="text-3xl font-bold text-purple-400">🔥{Math.floor(sessions / 4)}</div>
                            <div className="text-gray-400 text-sm">Streak Days</div>
                        </div>
                    </div>

                    {/* Tips */}
                    {!focusMode && (
                        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">💡 Focus Tips</h3>
                            <ul className="space-y-2 text-gray-500 text-sm">
                                <li>• Close unnecessary tabs and apps</li>
                                <li>• Put your phone on silent</li>
                                <li>• Take short breaks between sessions</li>
                                <li>• Stay hydrated</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
