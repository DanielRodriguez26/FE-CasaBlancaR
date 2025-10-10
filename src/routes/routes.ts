import { lazy } from 'react'
import { RouteConfig } from './types'

// Lazy load feature components
const LoginForm = lazy(() => import('@features/auth').then(module => ({ default: module.LoginForm })))
const SignupPage = lazy(() => import('@features/auth').then(module => ({ default: module.SignupPage })))

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
        {
            path: '/signup',
            component: SignupPage,
            title: 'Sign Up',
        },
    ],
    protected: [],
}
