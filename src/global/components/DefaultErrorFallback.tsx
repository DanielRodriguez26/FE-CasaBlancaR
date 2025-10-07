import { AppError } from '../types/error.types'

/**
 * Default Error Fallback UI
 */
export function DefaultErrorFallback({
    error,
    resetError,
}: {
    error: AppError
    resetError: () => void
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <div className="mb-4 text-red-600">
                    <svg
                        className="mx-auto h-12 w-12"
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
                </div>
                <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
                    Something went wrong
                </h1>
                <p className="mb-6 text-center text-gray-600">{error.message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={resetError}
                        className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Reload page
                    </button>
                </div>
            </div>
        </div>
    )
}
