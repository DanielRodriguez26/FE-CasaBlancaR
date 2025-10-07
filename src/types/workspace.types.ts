export type WorkspaceMemberRole = 'owner' | 'admin' | 'member'

export interface Workspace {
    id: string
    name: string
    ownerId: string
    members: WorkspaceMember[]
    createdAt: Date
}

export interface WorkspaceMember {
    userId: string
    role: WorkspaceMemberRole
    joinedAt: Date
}
