export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
    id: string
    title: string
    description?: string
    priority: TaskPriority
    status: TaskStatus
    project: string
    workspaceId: string
    assignedTo: string[]
    createdBy: string
    version: number
    lastEditedBy?: string
    currentlyEditing?: string[]
    createdAt: Date
    updatedAt: Date
}

export interface TaskFormData {
    title: string
    description?: string
    priority: TaskPriority
    status: TaskStatus
    project: string
    assignedTo?: string[]
}
