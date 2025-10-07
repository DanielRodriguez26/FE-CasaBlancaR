import { useCallback, useEffect, useState } from 'react'
import { AppError } from '../types/error.types'
import { parseError } from '../utils/error.utils'

interface UseAsyncState<T> {
    data: T | null
    error: AppError | null
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
    execute: (...args: unknown[]) => Promise<T | null>
    reset: () => void
}

/**
 * Hook for handling async operations with loading, error, and success states
 */
export function useAsync<T>(
    asyncFunction: (...args: unknown[]) => Promise<T>,
    immediate = false
): UseAsyncReturn<T> {
    const [state, setState] = useState<UseAsyncState<T>>({
        data: null,
        error: null,
        isLoading: false,
        isSuccess: false,
        isError: false,
    })

    const execute = useCallback(
        async (...args: unknown[]): Promise<T | null> => {
            setState({
                data: null,
                error: null,
                isLoading: true,
                isSuccess: false,
                isError: false,
            })

            try {
                const response = await asyncFunction(...args)
                setState({
                    data: response,
                    error: null,
                    isLoading: false,
                    isSuccess: true,
                    isError: false,
                })
                return response
            } catch (error) {
                const appError = parseError(error)
                setState({
                    data: null,
                    error: appError,
                    isLoading: false,
                    isSuccess: false,
                    isError: true,
                })
                return null
            }
        },
        [asyncFunction]
    )

    const reset = useCallback(() => {
        setState({
            data: null,
            error: null,
            isLoading: false,
            isSuccess: false,
            isError: false,
        })
    }, [])

    useEffect(() => {
        if (immediate) {
            execute()
        }
    }, [execute, immediate])

    return {
        ...state,
        execute,
        reset,
    }
}
