import { useCallback, useState } from 'react'
import { AppError, ErrorSeverity, ErrorType } from '../types/error.types'
import { createAppError, logError, parseError } from '../utils/error.utils'

interface UseErrorHandlerReturn {
    error: AppError | null
    hasError: boolean
    handleError: (error: unknown, customMessage?: string) => void
    clearError: () => void
    createError: (message: string, type?: ErrorType, severity?: ErrorSeverity) => AppError
}

/**
 * Hook for managing errors in components
 * Provides error state and utility functions for error handling
 */
export function useErrorHandler(): UseErrorHandlerReturn {
    const [error, setError] = useState<AppError | null>(null)

    const handleError = useCallback((error: unknown, customMessage?: string) => {
        const appError = parseError(error)

        if (customMessage) {
            appError.message = customMessage
        }

        logError(appError)
        setError(appError)
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    const createError = useCallback(
        (
            message: string,
            type: ErrorType = ErrorType.UNKNOWN,
            severity: ErrorSeverity = ErrorSeverity.MEDIUM
        ) => {
            return createAppError(message, type, severity)
        },
        []
    )

    return {
        error,
        hasError: error !== null,
        handleError,
        clearError,
        createError,
    }
}
