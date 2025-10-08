import { api } from '@lib/axios'
import { LoginCredencials, LoginResponse } from '@/types/api.type'

export const authService = {
    /**
     * Authentication with email and password
     */
    login: async (credentials: LoginCredencials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login',credentials)
        return response.data
    },
    
    /**
     *
     * Register a new user
     */
    signup: async (credentials: LoginCredencials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/signup',credentials)
        return response.data
    },

    /**
     * 
     * Refresh the token
     */
    refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/refresh',{
            refreshToken
        })
        return response.data
    },

    /**
     * 
     * Refresh the token
     */
    logout: async (): Promise<void> => {
        await api.post('/auth/logout',)
    },

    
}