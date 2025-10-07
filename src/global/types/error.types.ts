// Error severity levels
export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

// Error types for categorization
export enum ErrorType {
    VALIDATION = 'validation',
    AUTHENTICATION = 'authentication',
    AUTHORIZATION = 'authorization',
    NETWORK = 'network',
    SERVER = 'server',
    CLIENT = 'client',
    STORAGE = 'storage',
    UNKNOWN = 'unknown',
}

// Base application error interface
export interface AppError {
    message: string
    type: ErrorType
    severity: ErrorSeverity
    code?: string
    timestamp: Date
    metadata?: Record<string, unknown>
    originalError?: Error
}

// Validation error details
export interface ValidationError extends AppError {
    type: ErrorType.VALIDATION
    field?: string
    constraint?: string
}

// Network error details
export interface NetworkError extends AppError {
    type: ErrorType.NETWORK
    statusCode?: number
    endpoint?: string
}

// Error handler callback type
export type ErrorHandler = (error: AppError) => void

// Error recovery strategy
export interface ErrorRecoveryStrategy {
    shouldRetry: boolean
    retryDelay?: number
    maxRetries?: number
    fallbackAction?: () => void
}
