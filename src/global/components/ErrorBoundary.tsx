import { Component, ErrorInfo, ReactNode } from 'react'
import { AppError, ErrorSeverity, ErrorType } from '../types/error.types'
import { createAppError, logError } from '../utils/error.utils'
import { DefaultErrorFallback } from './DefaultErrorFallback'

interface Props {
    children: ReactNode
    fallback?: (error: AppError, resetError: () => void) => ReactNode
    onError?: (error: AppError, errorInfo: ErrorInfo) => void
}

interface State {
    error: AppError | null
    hasError: boolean
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            hasError: false,
        }
    }

    static getDerivedStateFromError(error: Error): State {
        const appError = createAppError(
            error.message,
            ErrorType.CLIENT,
            ErrorSeverity.HIGH,
            undefined,
            error
        )

        return {
            hasError: true,
            error: appError,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        const appError = createAppError(
            error.message,
            ErrorType.CLIENT,
            ErrorSeverity.HIGH,
            { componentStack: errorInfo.componentStack },
            error
        )

        logError(appError)

        if (this.props.onError) {
            this.props.onError(appError, errorInfo)
        }
    }

    resetError = (): void => {
        this.setState({
            hasError: false,
            error: null,
        })
    }

    render(): ReactNode {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.resetError)
            }

            return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
        }

        return this.props.children
    }
}
