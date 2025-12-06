'use client'

import { useState } from 'react'

export default function ExportPage() {
    const [loading, setLoading] = useState(false)
    const [format, setFormat] = useState<'json' | 'csv'>('json')
    const [dataType, setDataType] = useState('all')

    const handleExport = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/export?format=${format}&type=${dataType}`)

            if (!response.ok) {
                throw new Error('Export failed')
            }

            if (format === 'csv') {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `tvi3w-export-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
            } else {
                const data = await response.json()
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `tvi3w-export-${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
            }
        } catch (error) {
            alert('Export failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Export Data</h1>
                <p className="text-gray-400 mb-8">Download your data in JSON or CSV format</p>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">Data to Export</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'all', label: '📦 All Data' },
                                { value: 'meetings', label: '📅 Meetings' },
                                { value: 'contacts', label: '👥 Contacts' },
                                { value: 'notes', label: '📝 Notes' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setDataType(option.value)}
                                    className={`p-4 rounded-lg border transition-colors text-left ${dataType === option.value
                                            ? 'border-blue-500 bg-blue-600/20'
                                            : 'border-gray-600 hover:border-gray-500'
                                        }`}
                                >
                                    <span className="text-white">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">Format</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setFormat('json')}
                                className={`flex-1 p-4 rounded-lg border transition-colors ${format === 'json'
                                        ? 'border-blue-500 bg-blue-600/20'
                                        : 'border-gray-600 hover:border-gray-500'
                                    }`}
                            >
                                <div className="text-2xl mb-1">📄</div>
                                <div className="text-white font-medium">JSON</div>
                                <div className="text-gray-400 text-sm">Structured data</div>
                            </button>
                            <button
                                onClick={() => setFormat('csv')}
                                className={`flex-1 p-4 rounded-lg border transition-colors ${format === 'csv'
                                        ? 'border-blue-500 bg-blue-600/20'
                                        : 'border-gray-600 hover:border-gray-500'
                                    }`}
                            >
                                <div className="text-2xl mb-1">📊</div>
                                <div className="text-white font-medium">CSV</div>
                                <div className="text-gray-400 text-sm">Spreadsheet</div>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <span>⬇️</span>
                                Download Export
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
