'use client'

import { useState } from 'react'

const defaultTags = [
    { name: 'urgent', color: 'red' },
    { name: 'follow-up', color: 'orange' },
    { name: 'client', color: 'blue' },
    { name: 'internal', color: 'green' },
    { name: 'project', color: 'purple' },
    { name: 'personal', color: 'pink' },
]

interface TagBadgeProps {
    tag: string
    color?: string
    onRemove?: () => void
    size?: 'sm' | 'md'
}

export function TagBadge({ tag, color = 'blue', onRemove, size = 'sm' }: TagBadgeProps) {
    const colorClasses: Record<string, string> = {
        red: 'bg-red-900/50 text-red-400 border-red-800',
        orange: 'bg-orange-900/50 text-orange-400 border-orange-800',
        blue: 'bg-blue-900/50 text-blue-400 border-blue-800',
        green: 'bg-green-900/50 text-green-400 border-green-800',
        purple: 'bg-purple-900/50 text-purple-400 border-purple-800',
        pink: 'bg-pink-900/50 text-pink-400 border-pink-800',
        gray: 'bg-gray-700 text-gray-300 border-gray-600',
    }

    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'

    return (
        <span className={`inline-flex items-center gap-1 rounded-full border ${colorClasses[color] || colorClasses.gray} ${sizeClasses}`}>
            #{tag}
            {onRemove && (
                <button
                    onClick={(e) => { e.preventDefault(); onRemove() }}
                    className="hover:text-white transition-colors"
                >
                    ×
                </button>
            )}
        </span>
    )
}

interface TagInputProps {
    tags: string[]
    onChange: (tags: string[]) => void
    suggestions?: string[]
}

export function TagInput({ tags, onChange, suggestions = defaultTags.map(t => t.name) }: TagInputProps) {
    const [input, setInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    const addTag = (tag: string) => {
        const normalizedTag = tag.toLowerCase().trim()
        if (normalizedTag && !tags.includes(normalizedTag)) {
            onChange([...tags, normalizedTag])
        }
        setInput('')
        setShowSuggestions(false)
    }

    const removeTag = (tag: string) => {
        onChange(tags.filter(t => t !== tag))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input) {
            e.preventDefault()
            addTag(input)
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1])
        }
    }

    const filteredSuggestions = suggestions.filter(
        s => s.includes(input.toLowerCase()) && !tags.includes(s)
    )

    return (
        <div className="relative">
            <div className="flex flex-wrap gap-2 p-3 bg-gray-700 rounded-lg border border-gray-600 focus-within:border-blue-500">
                {tags.map(tag => (
                    <TagBadge
                        key={tag}
                        tag={tag}
                        color={defaultTags.find(t => t.name === tag)?.color}
                        onRemove={() => removeTag(tag)}
                    />
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setShowSuggestions(true) }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                    className="flex-1 min-w-[100px] bg-transparent text-white outline-none placeholder:text-gray-500"
                />
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                    {filteredSuggestions.map(suggestion => (
                        <button
                            key={suggestion}
                            onClick={() => addTag(suggestion)}
                            className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                            <TagBadge tag={suggestion} color={defaultTags.find(t => t.name === suggestion)?.color} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

interface TagFilterProps {
    selectedTags: string[]
    onChange: (tags: string[]) => void
    availableTags?: string[]
}

export function TagFilter({ selectedTags, onChange, availableTags = defaultTags.map(t => t.name) }: TagFilterProps) {
    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter(t => t !== tag))
        } else {
            onChange([...selectedTags, tag])
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag)
                const tagColor = defaultTags.find(t => t.name === tag)?.color || 'gray'
                return (
                    <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isSelected
                                ? `bg-${tagColor}-600 text-white ring-2 ring-${tagColor}-400`
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        #{tag}
                    </button>
                )
            })}
        </div>
    )
}
