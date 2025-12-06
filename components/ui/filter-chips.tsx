'use client'

interface FilterChipsProps {
    options: { value: string; label: string }[]
    selected: string
    onChange: (value: string) => void
}

export default function FilterChips({ options, selected, onChange }: FilterChipsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selected === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}
