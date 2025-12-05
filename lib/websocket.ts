// lib/websocket.ts - WebSocket client for real-time features
export class WebSocketClient {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private listeners: Map<string, Set<Function>> = new Map()

    constructor(private url: string) { }

    connect() {
        try {
            this.ws = new WebSocket(this.url)

            this.ws.onopen = () => {
                console.log('✅ WebSocket connected')
                this.reconnectAttempts = 0
                this.emit('connected', {})
            }

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    this.emit(data.type, data.payload)
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error)
                }
            }

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error)
                this.emit('error', error)
            }

            this.ws.onclose = () => {
                console.log('WebSocket disconnected')
                this.emit('disconnected', {})
                this.attemptReconnect()
            }
        } catch (error) {
            console.error('Failed to create WebSocket:', error)
            this.attemptReconnect()
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
            setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts)
        } else {
            console.error('Max reconnect attempts reached')
            this.emit('max_reconnect_attempts', {})
        }
    }

    send(type: string, payload: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }))
        } else {
            console.warn('WebSocket not connected')
        }
    }

    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event)!.add(callback)
    }

    off(event: string, callback: Function) {
        const listeners = this.listeners.get(event)
        if (listeners) {
            listeners.delete(callback)
        }
    }

    private emit(event: string, data: any) {
        const listeners = this.listeners.get(event)
        if (listeners) {
            listeners.forEach(callback => callback(data))
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
    }
}

// Singleton instance
let wsClient: WebSocketClient | null = null

export function getWebSocketClient(): WebSocketClient {
    if (!wsClient) {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
        wsClient = new WebSocketClient(wsUrl)
    }
    return wsClient
}

// Event types
export enum WSEvent {
    // Meeting events
    MEETING_STARTED = 'meeting:started',
    MEETING_ENDED = 'meeting:ended',
    TRANSCRIPT_UPDATE = 'transcript:update',
    QUESTION_SUGGESTED = 'question:suggested',
    ACTION_ITEM_ADDED = 'action_item:added',

    // Participant events
    PARTICIPANT_JOINED = 'participant:joined',
    PARTICIPANT_LEFT = 'participant:left',
    PARTICIPANT_SPEAKING = 'participant:speaking',

    // Collaboration events
    NOTE_UPDATED = 'note:updated',
    CURSOR_MOVED = 'cursor:moved',

    // Notification events
    NOTIFICATION_RECEIVED = 'notification:received',

    // Connection events
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
}
