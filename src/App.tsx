import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './routes'
import { ErrorBoundary } from '@global/components'
import { queryClient } from '@lib/queryClient'
import './App.css'



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
