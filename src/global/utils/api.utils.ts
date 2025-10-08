import { AxiosError } from 'axios'
import { ApiError } from '@/types/api.type'

/**
 * Checks if an error is an Axios error
 */
export function isAxiosError(error: unknown): error is AxiosError<ApiError> {
    return (error as AxiosError).isAxiosError === true
}

/**
 * Extracts error message from API error response
 */
export function getApiErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        return error.response?.data?.error?.message || error.message
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'An unexpected error occurred'
}

/**
 * Gets error details from API error response
 */
export function getApiErrorDetails(error: unknown): Record<string, string[]> | undefined {
    if (isAxiosError(error)) {
        return error.response?.data?.error?.details
    }
    return undefined
}
