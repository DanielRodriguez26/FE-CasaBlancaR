import { AppError, ErrorSeverity } from '../types/error.types'
import { formatErrorMessage } from '../utils/error.utils'

interface ErrorAlertProps {
    error: AppError
    onClose?: () => void
    showDetails?: boolean
}

/**
 * Error Alert Component
 * Displays error messages with appropriate styling based on severity
 */
export function ErrorAlert({ error, onClose, showDetails = false }: ErrorAlertProps) {
    const getSeverityStyles = (severity: ErrorSeverity): string => {
        switch (severity) {
            case ErrorSeverity.CRITICAL:
            case ErrorSeverity.HIGH:
                return 'bg-red-50 border-red-200 text-red-800'
            case ErrorSeverity.MEDIUM:
                return 'bg-yellow-50 border-yellow-200 text-yellow-800'
            case ErrorSeverity.LOW:
                return 'bg-blue-50 border-blue-200 text-blue-800'
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800'
        }
    }

    const getIcon = (severity: ErrorSeverity) => {
        if (severity === ErrorSeverity.CRITICAL || severity === ErrorSeverity.HIGH) {
            return (
                <svg
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            )
        }

        return (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        )
    }

    return (
        <div className={`rounded-md border p-4 ${getSeverityStyles(error.severity)}`}>
            <div className="flex">
                <div className="flex-shrink-0">{getIcon(error.severity)}</div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium">{formatErrorMessage(error)}</h3>
                    {showDetails && error.metadata && (
                        <div className="mt-2 text-sm">
                            <pre className="overflow-x-auto rounded bg-white bg-opacity-50 p-2">
                                {JSON.stringify(error.metadata, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
                {onClose && (
                    <div className="ml-auto pl-3">
                        <button
                            onClick={onClose}
                            className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
