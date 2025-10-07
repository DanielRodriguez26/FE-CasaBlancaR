export interface Comment {
    id: string
    taskId: string
    userId: string
    content: string
    mentions: string[]
    createdAt: Date
    updatedAt: Date
}

export interface CommentFormData {
    content: string
    mentions?: string[]
}
