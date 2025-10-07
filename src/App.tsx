import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './routes'
import { ErrorBoundary } from '@global/components'
import './App.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
})

function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <AppRouter />
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default App
