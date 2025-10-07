import {
    AppError,
    ErrorSeverity,
    ErrorType,
    NetworkError,
    ValidationError,
} from '../types/error.types'

/**
 * Creates a standardized AppError object
 */
export function createAppError(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    metadata?: Record<string, unknown>,
    originalError?: Error
): AppError {
    return {
        message,
        type,
        severity,
        timestamp: new Date(),
        metadata,
        originalError,
    }
}

/**
 * Creates a validation error
 */
export function createValidationError(
    message: string,
    field?: string,
    constraint?: string,
    metadata?: Record<string, unknown>
): ValidationError {
    return {
        message,
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.LOW,
        timestamp: new Date(),
        field,
        constraint,
        metadata,
    }
}

/**
 * Creates a network error
 */
export function createNetworkError(
    message: string,
    statusCode?: number,
    endpoint?: string,
    metadata?: Record<string, unknown>,
    originalError?: Error
): NetworkError {
    return {
        message,
        type: ErrorType.NETWORK,
        severity: statusCode && statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
        timestamp: new Date(),
        statusCode,
        endpoint,
        metadata,
        originalError,
    }
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: AppError): boolean {
    if (error.type === ErrorType.NETWORK) {
        const networkError = error as NetworkError
        // Retry on 5xx errors or network failures
        return !networkError.statusCode || networkError.statusCode >= 500
    }
    return false
}

/**
 * Formats error message for user display
 */
export function formatErrorMessage(error: AppError): string {
    switch (error.type) {
        case ErrorType.VALIDATION:
            return error.message
        case ErrorType.AUTHENTICATION:
            return 'Please log in to continue'
        case ErrorType.AUTHORIZATION:
            return 'You do not have permission to perform this action'
        case ErrorType.NETWORK:
            return 'Connection error. Please check your internet connection'
        case ErrorType.SERVER:
            return 'Server error. Please try again later'
        case ErrorType.STORAGE:
            return 'Storage error. Unable to save data'
        default:
            return 'An unexpected error occurred'
    }
}

/**
 * Logs error to console with appropriate severity
 */
export function logError(error: AppError): void {
    const logMessage = `[${error.severity.toUpperCase()}] ${error.type}: ${error.message}`
    const logData = {
        timestamp: error.timestamp,
        metadata: error.metadata,
        originalError: error.originalError,
    }

    switch (error.severity) {
        case ErrorSeverity.CRITICAL:
        case ErrorSeverity.HIGH:
            console.error(logMessage, logData)
            break
        case ErrorSeverity.MEDIUM:
            console.warn(logMessage, logData)
            break
        case ErrorSeverity.LOW:
            console.info(logMessage, logData)
            break
    }
}

/**
 * Parses unknown error into AppError
 */
export function parseError(error: unknown): AppError {
    if (typeof error === 'string') {
        return createAppError(error)
    }

    if (error instanceof Error) {
        return createAppError(
            error.message,
            ErrorType.UNKNOWN,
            ErrorSeverity.MEDIUM,
            undefined,
            error
        )
    }

    if (typeof error === 'object' && error !== null) {
        const errorObj = error as Record<string, unknown>
        return createAppError(
            (errorObj.message as string) || 'Unknown error',
            ErrorType.UNKNOWN,
            ErrorSeverity.MEDIUM,
            errorObj
        )
    }

    return createAppError('An unknown error occurred')
}
