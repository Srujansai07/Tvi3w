'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Goal {
    id: string
    title: string
    target: number
    current: number
    type: 'meetings' | 'notes' | 'contacts'
    deadline: string
    created_at: string
}

export default function GoalsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [goals, setGoals] = useState<Goal[]>([])
    const [showCreate, setShowCreate] = useState(false)
    const [creating, setCreating] = useState(false)
    const [form, setForm] = useState({
        title: '',
        target: 10,
        type: 'meetings' as Goal['type'],
        deadline: '',
    })

    useEffect(() => {
        async function loadGoals() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            // Load goals from user metadata
            const userGoals = session.user.user_metadata?.goals || []

            // Calculate current progress for each goal
            const goalsWithProgress = await Promise.all(
                userGoals.map(async (goal: Goal) => {
                    let current = 0
                    const { count } = await supabase
                        .from(goal.type)
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', session.user.id)
                        .gte('created_at', goal.created_at)

                    current = count || 0
                    return { ...goal, current }
                })
            )

            setGoals(goalsWithProgress)
            setLoading(false)
        }

        loadGoals()
    }, [])

    const handleCreate = async () => {
        if (!form.title || !form.deadline) return

        setCreating(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const newGoal: Goal = {
            id: Date.now().toString(),
            title: form.title,
            target: form.target,
            current: 0,
            type: form.type,
            deadline: form.deadline,
            created_at: new Date().toISOString(),
        }

        const existingGoals = session.user.user_metadata?.goals || []
        const updatedGoals = [...existingGoals, newGoal]

        await supabase.auth.updateUser({
            data: { goals: updatedGoals }
        })

        setGoals([...goals, newGoal])
        setShowCreate(false)
        setForm({ title: '', target: 10, type: 'meetings', deadline: '' })
        setCreating(false)
    }

    const deleteGoal = async (id: string) => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const updatedGoals = goals.filter(g => g.id !== id)
        await supabase.auth.updateUser({
            data: { goals: updatedGoals }
        })

        setGoals(updatedGoals)
    }

    const getProgress = (goal: Goal) => {
        return Math.min((goal.current / goal.target) * 100, 100)
    }

    const getDaysLeft = (deadline: string) => {
        const diff = new Date(deadline).getTime() - new Date().getTime()
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
        if (days < 0) return 'Expired'
        if (days === 0) return 'Today'
        if (days === 1) return '1 day left'
        return `${days} days left`
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-800 rounded-xl p-6 h-32"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🎯</span>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Goals</h1>
                            <p className="text-gray-400">Track your productivity goals</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        + New Goal
                    </button>
                </div>

                {/* Create Form */}
                {showCreate && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Create Goal</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Goal Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    placeholder="Complete 20 meetings this month"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value as Goal['type'] })}
                                        className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    >
                                        <option value="meetings">Meetings</option>
                                        <option value="notes">Notes</option>
                                        <option value="contacts">Contacts</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Target</label>
                                    <input
                                        type="number"
                                        value={form.target}
                                        onChange={(e) => setForm({ ...form, target: parseInt(e.target.value) || 0 })}
                                        className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                        min={1}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                                    <input
                                        type="date"
                                        value={form.deadline}
                                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                        className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={creating || !form.title || !form.deadline}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                            >
                                {creating ? 'Creating...' : 'Create Goal'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Goals List */}
                {goals.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-6xl mb-4">🎯</div>
                        <div className="text-xl text-white mb-2">No goals yet</div>
                        <p className="text-gray-400 mb-6">Set your first productivity goal</p>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Create Goal
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {goals.map(goal => (
                            <div
                                key={goal.id}
                                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">{goal.title}</h3>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-gray-500 text-sm capitalize">{goal.type}</span>
                                            <span className="text-gray-500 text-sm">{getDaysLeft(goal.deadline)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteGoal(goal.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">{goal.current} / {goal.target}</span>
                                        <span className="text-gray-400">{Math.round(getProgress(goal))}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${getProgress(goal) >= 100
                                                    ? 'bg-green-500'
                                                    : getProgress(goal) >= 50
                                                        ? 'bg-blue-500'
                                                        : 'bg-yellow-500'
                                                }`}
                                            style={{ width: `${getProgress(goal)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
