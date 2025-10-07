import { Task } from './task.types'
import { UserPresence } from './user.types'
import { Conflict } from './collaboration.types'
import { Comment } from './comment.types'

// Socket Event Payloads
export interface TaskCreatedPayload {
    task: Task
}

export interface TaskUpdatedPayload {
    task: Task
    userId: string
}

export interface TaskDeletedPayload {
    taskId: string
    userId: string
}

export interface UserJoinedPayload {
    presence: UserPresence
}

export interface UserLeftPayload {
    userId: string
}

export interface UserTypingPayload {
    userId: string
    taskId: string
    isTyping: boolean
}

export interface ConflictDetectedPayload {
    conflict: Conflict
}

export interface CommentAddedPayload {
    comment: Comment
}

// Socket Event Names
export type SocketEvent =
    | 'task:created'
    | 'task:updated'
    | 'task:deleted'
    | 'task:assigned'
    | 'user:joined'
    | 'user:left'
    | 'user:typing'
    | 'user:viewing'
    | 'conflict:detected'
    | 'conflict:resolved'
    | 'comment:added'
    | 'comment:updated'
    | 'comment:deleted'
