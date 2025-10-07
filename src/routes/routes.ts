import { lazy } from 'react'
import { RouteConfig } from './types'

// Lazy load feature components
const LoginForm = lazy(() => import('@features/auth').then(module => ({ default: module.LoginForm })))

export const routes: {
    public: RouteConfig[]
    protected: RouteConfig[]
} = {
    public: [
        {
            path: '/login',
            component: LoginForm,
            title: 'Login',
        },
    ],
    protected: [],
}
