import { describe, it, expect, vi } from 'vitest'
import { authService } from './auth.service'

// Axios Mock
vi.mock('@lib/axios', () => ({
    api: {
        post: vi.fn()
    }
}))

describe('authService', () => {
    it('Must send credencials and retun user with token', async () => {
        //Arrange: Preparing mock data
        const credentials = {
            email: 'test@test.com',
            password: 'Pass1234'
        }
        const mockResponse = {
            data: {
                user: {
                    id: 1,
                    email: 'test@test.com',
                    name: 'Test User',
                    role: 'user',
                    workspaces: []
                },
                token: 'mock-jwt-token',
                refreshToken: 'mock-refresh-token'
            }
        }
        // configuration mock
        const { api } = await import('@lib/axios')
        vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

        // Act: Ejecution the funtion
        const result = await authService.login(credentials)

        //Assert: Check response
        expect(api.post).toHaveBeenCalledWith('/auth/login', credentials)
        expect(result.token).toBe('mock-jwt-token')
        expect(result.user.email).toBe('test@test.com')
    })

    it('Must throw an error if the credentials are incorrect', async () => {
        const { api } = await import('@lib/axios')
        vi.mocked(api.post).mockRejectedValueOnce({
            response: { data: { error: { message: 'invalid credentials' } } }
        })

        await expect(authService.login({
            email: 'best@test.com', password: 'worng'
        })).rejects.toThrow()
    })
})