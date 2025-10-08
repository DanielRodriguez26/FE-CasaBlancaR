import { User } from './user.types'

export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

export interface ApiError {
    success: false
    error: {
        code: string
        message: string
        details?: Record<string, string[]>
    }
}

export interface LoginCredencials {
    email: string
    password: string
}

export interface LoginResponse{
    user:User
    token: string
    refreshToken: string
}

export interface RefreshTokenResponse {
    token: string
    refreshToken: string
}

export interface SignupCredentials {
    email: string
    password: string
    name: string
}

export interface SignupResponse {
    user: User
    token: string
    refreshToken: string
}