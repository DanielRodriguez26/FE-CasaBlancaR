export interface User {
    id: number
    email: string
    name: string
    avatar?: string
    workspaces: string[]
    role: 'user' | 'admin' | 'moderator' 
}

export interface UserPresence {
    userId: string
    status: 'online' | 'away' | 'offline'
    currentTask?: string
    lastSeen: Date
    isTyping: boolean
}

export interface AuthUser extends User {
    token: string
    refreshToken: string
}
