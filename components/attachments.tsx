'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useRef } from 'react'

interface Attachment {
    id: string
    name: string
    size: number
    type: string
    url: string
    created_at: string
}

interface FileUploadProps {
    meetingId: string
    onUpload?: (attachment: Attachment) => void
}

export function FileUpload({ meetingId, onUpload }: FileUploadProps) {
    const supabase = createClient()
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setProgress(0)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Not authenticated')

            const fileExt = file.name.split('.').pop()
            const fileName = `${meetingId}/${Date.now()}.${fileExt}`

            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90))
            }, 100)

            const { data, error } = await supabase.storage
                .from('attachments')
                .upload(fileName, file)

            clearInterval(progressInterval)

            if (error) throw error

            setProgress(100)

            const { data: urlData } = supabase.storage
                .from('attachments')
                .getPublicUrl(fileName)

            const attachment: Attachment = {
                id: data.path,
                name: file.name,
                size: file.size,
                type: file.type,
                url: urlData.publicUrl,
                created_at: new Date().toISOString(),
            }

            onUpload?.(attachment)
        } catch (error: any) {
            alert('Upload failed: ' + error.message)
        } finally {
            setUploading(false)
            setProgress(0)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.gif"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
                {uploading ? (
                    <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Uploading {progress}%
                    </>
                ) : (
                    <>
                        <span>📎</span>
                        Attach File
                    </>
                )}
            </button>
        </div>
    )
}

interface AttachmentListProps {
    attachments: Attachment[]
    onDelete?: (id: string) => void
}

export function AttachmentList({ attachments, onDelete }: AttachmentListProps) {
    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return '📄'
        if (type.includes('image')) return '🖼️'
        if (type.includes('word') || type.includes('document')) return '📝'
        if (type.includes('sheet') || type.includes('excel')) return '📊'
        if (type.includes('presentation') || type.includes('powerpoint')) return '📽️'
        return '📁'
    }

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    if (attachments.length === 0) return null

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-400">Attachments ({attachments.length})</h4>
            <div className="space-y-2">
                {attachments.map((attachment) => (
                    <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                    >
                        <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 flex-1 min-w-0 hover:text-blue-400"
                        >
                            <span className="text-xl">{getFileIcon(attachment.type)}</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-white text-sm truncate">{attachment.name}</div>
                                <div className="text-gray-500 text-xs">{formatSize(attachment.size)}</div>
                            </div>
                        </a>
                        {onDelete && (
                            <button
                                onClick={() => onDelete(attachment.id)}
                                className="text-gray-500 hover:text-red-400 p-1"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
