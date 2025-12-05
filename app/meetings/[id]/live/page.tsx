'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LiveMeetingPage() {
    const params = useParams()
    const router = useRouter()
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState<string[]>([])
    const [notes, setNotes] = useState('')
    const [actionItems, setActionItems] = useState<string[]>([])
    const [questions, setQuestions] = useState<{ type: string, text: string }[]>([])
    const [duration, setDuration] = useState(0)
    const timerRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setDuration(d => d + 1)
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isRecording])

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleStartRecording = () => {
        setIsRecording(true)
        // Simulate transcript updates
        const interval = setInterval(() => {
            setTranscript(prev => [...prev, `[${new Date().toLocaleTimeString()}] Sample transcript line...`])
        }, 5000)
        return () => clearInterval(interval)
    }

    const handleStopRecording = () => {
        setIsRecording(false)
    }

    const handleEndMeeting = async () => {
        setIsRecording(false)
        // Save meeting data
        router.push('/meetings')
    }

    const addActionItem = () => {
        const item = prompt('Enter action item:')
        if (item) setActionItems([...actionItems, item])
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tvi3W
                            </Link>
                            <p className="text-sm text-gray-400 mt-1">Live Meeting</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-white font-mono text-xl">{formatDuration(duration)}</div>
                            {isRecording && (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-red-400 text-sm">Recording</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Video & Transcript */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Placeholder */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🎥</div>
                                    <p className="text-gray-400">Video/Audio Placeholder</p>
                                    <p className="text-sm text-gray-500 mt-2">WebRTC integration coming soon</p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-4">
                                {!isRecording ? (
                                    <button
                                        onClick={handleStartRecording}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Start Recording
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleStopRecording}
                                            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Pause
                                        </button>
                                        <button
                                            onClick={handleEndMeeting}
                                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            End Meeting
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Live Transcript */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-semibold text-white mb-4">Live Transcript</h3>
                            <div className="bg-gray-800/50 rounded-lg p-4 h-64 overflow-y-auto">
                                {transcript.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">Transcript will appear here when recording starts...</p>
                                ) : (
                                    <div className="space-y-2">
                                        {transcript.map((line, idx) => (
                                            <p key={idx} className="text-gray-300 text-sm">{line}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* AI Questions */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-semibold text-white mb-4">💡 AI Suggestions</h3>
                            <div className="space-y-3">
                                {questions.length === 0 ? (
                                    <p className="text-gray-500 text-sm">AI will suggest questions during the meeting...</p>
                                ) : (
                                    questions.map((q, idx) => (
                                        <div key={idx} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                            <span className="text-xs text-blue-400 font-medium">{q.type}</span>
                                            <p className="text-sm text-gray-300 mt-1">{q.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-semibold text-white mb-4">📝 Notes</h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Take notes during the meeting..."
                                className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none text-sm"
                            />
                        </div>

                        {/* Action Items */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">✅ Action Items</h3>
                                <button
                                    onClick={addActionItem}
                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="space-y-2">
                                {actionItems.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No action items yet</p>
                                ) : (
                                    actionItems.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-2 bg-gray-800/50 p-2 rounded">
                                            <span className="text-green-400 mt-1">•</span>
                                            <span className="text-sm text-gray-300">{item}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Participants */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-semibold text-white mb-4">👥 Participants</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        Y
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">You</p>
                                        <p className="text-xs text-gray-400">Host</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
