'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ImportedContact {
    email: string
    company?: string
    phone?: string
    role?: string
}

export default function ImportContactsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [importing, setImporting] = useState(false)
    const [preview, setPreview] = useState<ImportedContact[]>([])
    const [csvText, setCsvText] = useState('')
    const [result, setResult] = useState<{ success: number; failed: number } | null>(null)

    const parseCSV = (text: string): ImportedContact[] => {
        const lines = text.trim().split('\n')
        if (lines.length < 2) return []

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
        const emailIndex = headers.findIndex(h => h.includes('email'))
        const companyIndex = headers.findIndex(h => h.includes('company'))
        const phoneIndex = headers.findIndex(h => h.includes('phone'))
        const roleIndex = headers.findIndex(h => h.includes('role') || h.includes('title'))

        if (emailIndex === -1) return []

        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
            return {
                email: values[emailIndex] || '',
                company: companyIndex >= 0 ? values[companyIndex] : undefined,
                phone: phoneIndex >= 0 ? values[phoneIndex] : undefined,
                role: roleIndex >= 0 ? values[roleIndex] : undefined,
            }
        }).filter(c => c.email && c.email.includes('@'))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            setCsvText(text)
            setPreview(parseCSV(text))
        }
        reader.readAsText(file)
    }

    const handleImport = async () => {
        if (preview.length === 0) return

        setImporting(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/login')
            return
        }

        let success = 0
        let failed = 0

        for (const contact of preview) {
            const { error } = await supabase.from('contacts').insert({
                user_id: session.user.id,
                email: contact.email,
                company: contact.company || null,
                phone: contact.phone || null,
                role: contact.role || null,
            })

            if (error) {
                failed++
            } else {
                success++
            }
        }

        setResult({ success, failed })
        setImporting(false)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Import Contacts</h1>
                <p className="text-gray-400 mb-8">Upload a CSV file to import contacts</p>

                {/* Upload Section */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Upload CSV</h2>

                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csv-upload"
                        />
                        <label
                            htmlFor="csv-upload"
                            className="cursor-pointer"
                        >
                            <div className="text-5xl mb-4">📄</div>
                            <div className="text-white font-medium mb-2">Drop CSV file here or click to browse</div>
                            <div className="text-gray-500 text-sm">
                                CSV should have columns: email, company, phone, role
                            </div>
                        </label>
                    </div>

                    <div className="mt-4 text-gray-400 text-sm">
                        <strong>Example format:</strong>
                        <pre className="mt-2 p-3 bg-gray-900 rounded-lg overflow-x-auto">
                            {`email,company,phone,role
john@example.com,Acme Inc,+1234567890,Manager
jane@example.com,Tech Corp,+0987654321,Developer`}
                        </pre>
                    </div>
                </div>

                {/* Preview */}
                {preview.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">
                                Preview ({preview.length} contacts)
                            </h2>
                            <button
                                onClick={handleImport}
                                disabled={importing}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {importing ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Importing...
                                    </>
                                ) : (
                                    'Import All'
                                )}
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                                        <th className="pb-3">Email</th>
                                        <th className="pb-3">Company</th>
                                        <th className="pb-3">Phone</th>
                                        <th className="pb-3">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.slice(0, 10).map((contact, i) => (
                                        <tr key={i} className="border-b border-gray-700/50">
                                            <td className="py-3 text-white">{contact.email}</td>
                                            <td className="py-3 text-gray-400">{contact.company || '-'}</td>
                                            <td className="py-3 text-gray-400">{contact.phone || '-'}</td>
                                            <td className="py-3 text-gray-400">{contact.role || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {preview.length > 10 && (
                                <div className="text-gray-500 text-sm mt-3">
                                    ... and {preview.length - 10} more contacts
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Import Complete</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                                <div className="text-3xl font-bold text-green-400">{result.success}</div>
                                <div className="text-green-300">Imported successfully</div>
                            </div>
                            {result.failed > 0 && (
                                <div className="bg-red-600/20 rounded-lg p-4 border border-red-500/30">
                                    <div className="text-3xl font-bold text-red-400">{result.failed}</div>
                                    <div className="text-red-300">Failed to import</div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => router.push('/contacts')}
                            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            View Contacts →
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
