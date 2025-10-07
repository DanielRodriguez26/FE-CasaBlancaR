import { lazy } from 'react'
import { RouteConfig } from './types'

// Lazy load feature components
const Auth = lazy(() => import('@features/auth/auth'))

export const routes: {
    public: RouteConfig[]
    protected: RouteConfig[]
} = {
    public: [
        {
            path: '/login',
            component: Auth,
            title: 'Login',
        },
    ],
    protected: [],
}
