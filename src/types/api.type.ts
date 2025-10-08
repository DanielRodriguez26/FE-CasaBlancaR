import { User } from './user.types'

/**
 * Estructura base para todas las respuestas exitosas de la API
 * @template T - El tipo de dato contenido en `data`
 */
export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

/**
 * Estructura de errores de la API
 */
export interface ApiError {
    success: false
    error: {
        code: string
        message: string
        details?: Record<string, string[]>
    }
}

/**
 * Credenciales para login
 */
export interface LoginCredentials {
    email: string
    password: string
}

/**
 * Credenciales para registro
 */
export interface SignupCredentials {
    email: string
    name: string
    password: string
}

/**
 * Respuesta del endpoint de login
 */
export interface LoginResponse {
    user: User
    token: string
    refreshToken: string
}

/**
 * Respuesta del endpoint de signup
 */
export interface SignupResponse {
    user: User
    token: string
    refreshToken: string
}

/**
 * Respuesta del endpoint de refresh token
 */
export interface RefreshTokenResponse {
    token: string
    refreshToken: string
}

/**
 * Request para refresh token
 */
export interface RefreshTokenRequest {
    refreshToken: string
}

