'use client'

import { useState } from 'react'

interface SearchBarProps {
    placeholder?: string
    onSearch: (query: string) => void
    className?: string
}

export default function SearchBar({
    placeholder = 'Search...',
    onSearch,
    className = ''
}: SearchBarProps) {
    const [query, setQuery] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        // Auto-search on type with debounce
        onSearch(e.target.value)
    }

    return (
        <form onSubmit={handleSubmit} className={`relative ${className}`}>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
            />
            <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </form>
    )
}
