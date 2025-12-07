'use client'

import { useState } from 'react'

interface BulkActionsProps {
    selectedIds: string[]
    onDelete?: () => void
    onStatusChange?: (status: string) => void
    onExport?: () => void
    onClearSelection?: () => void
    entityType: 'meetings' | 'contacts' | 'notes'
}

export function BulkActions({
    selectedIds,
    onDelete,
    onStatusChange,
    onExport,
    onClearSelection,
    entityType,
}: BulkActionsProps) {
    const [showConfirm, setShowConfirm] = useState(false)

    if (selectedIds.length === 0) return null

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-4 flex items-center gap-4 z-50">
            <div className="text-white font-medium">
                {selectedIds.length} selected
            </div>

            <div className="h-6 w-px bg-gray-600" />

            {entityType === 'meetings' && onStatusChange && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onStatusChange('completed')}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        ✓ Complete
                    </button>
                    <button
                        onClick={() => onStatusChange('cancelled')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        ✕ Cancel
                    </button>
                </div>
            )}

            {onExport && (
                <button
                    onClick={onExport}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    📤 Export
                </button>
            )}

            {onDelete && (
                <>
                    {showConfirm ? (
                        <div className="flex items-center gap-2">
                            <span className="text-red-400 text-sm">Confirm delete?</span>
                            <button
                                onClick={() => {
                                    onDelete()
                                    setShowConfirm(false)
                                }}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                No
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            🗑️ Delete
                        </button>
                    )}
                </>
            )}

            {onClearSelection && (
                <button
                    onClick={onClearSelection}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
                >
                    Clear
                </button>
            )}
        </div>
    )
}

interface SelectCheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
}

export function SelectCheckbox({ checked, onChange }: SelectCheckboxProps) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange(!checked)
            }}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checked
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
        >
            {checked && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </button>
    )
}

interface SelectAllProps {
    allSelected: boolean
    partialSelected: boolean
    onSelectAll: () => void
}

export function SelectAll({ allSelected, partialSelected, onSelectAll }: SelectAllProps) {
    return (
        <button
            onClick={onSelectAll}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${allSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : partialSelected
                        ? 'bg-blue-600/50 border-blue-600 text-white'
                        : 'border-gray-600 hover:border-gray-500'
                }`}
        >
            {(allSelected || partialSelected) && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    {allSelected ? (
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    ) : (
                        <path d="M5 10h10" stroke="currentColor" strokeWidth="2" />
                    )}
                </svg>
            )}
        </button>
    )
}
