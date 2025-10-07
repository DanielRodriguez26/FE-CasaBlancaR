export interface Conflict {
    id: string
    taskId: string
    field: string
    localValue: unknown
    remoteValue: unknown
    localVersion: number
    remoteVersion: number
    detectedAt: Date
}

export interface Activity {
    id: string
    taskId: string
    userId: string
    action: 'created' | 'updated' | 'deleted' | 'commented' | 'assigned'
    changes?: Record<string, { old: unknown; new: unknown }>
    timestamp: Date
}
