import { QueryClientProvider } from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import { AppRouter } from './routes'
import { ErrorBoundary } from '@global/components'
import { queryClient } from '@lib/queryClient'
import './App.css'



function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <AppRouter />
                {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default App
