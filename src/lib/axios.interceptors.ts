import { api } from './axios'
import { useAuthStore } from '@/stores/useAuthStore/useAuthStore'
import { authService } from '@/global/services/auth.service'

// Helper function to get CSRF token from cookies
function getCsrfToken(): string | null {
    const name = 'XSRF-TOKEN'
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null
    }
    return null
}

export function setupInterceptors() {
    // Request interceptor: auto add token and CSRF protection
    api.interceptors.request.use(
        (config) => {
            // Add authentication token
            const token = useAuthStore.getState().user?.token
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }

            // Add CSRF token for state-changing requests
            const method = config.method?.toUpperCase()
            if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                const csrfToken = getCsrfToken()
                if (csrfToken) {
                    config.headers['X-XSRF-TOKEN'] = csrfToken
                }
            }

            return config
        },
        (error) => Promise.reject(error)
    )

    // Response interceptor: manage 401 errors (token expired)
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config

            // If 401 and we haven't retried yet
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    const refreshToken = useAuthStore.getState().user?.refreshToken
                    if (!refreshToken) throw new Error('No refresh token')

                    // Call refresh endpoint
                    const loginResponse = await authService.refreshToken(refreshToken)

                    // Update tokens in the store
                    useAuthStore.getState().updateUser({
                        token: loginResponse.token,
                        refreshToken: loginResponse.refreshToken
                    })

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${loginResponse.token}`
                    return api(originalRequest)
                } catch (refreshError) {
                    // If refresh fails, logout
                    useAuthStore.getState().logout()
                    window.location.href = '/login'
                    return Promise.reject(refreshError)
                }
            }

            return Promise.reject(error)
        }
    )
}
