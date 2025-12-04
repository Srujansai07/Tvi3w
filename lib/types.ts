export interface Analysis {
    id: string
    content: string
    result: string
    createdAt: string
    userId?: string
}

export interface Meeting {
    id: string
    topic: string
    context?: string
    questions: string
    createdAt: string
    userId?: string
}

export interface BusinessPitch {
    id: string
    pitch: string
    analysis: string
    createdAt: string
    userId?: string
}

export interface User {
    id: string
    email: string
    name?: string
    avatarUrl?: string
    createdAt: string
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}
