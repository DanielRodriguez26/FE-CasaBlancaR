import { describe, it, expect, vi } from 'vitest'
import { authService } from './auth.service'

// Axios Mock
vi.mock('@lib/axios', () => ({
    api: {
        post: vi.fn()
    }
}))

describe('authService', () => {
    describe('login', () => {
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

    describe('signup', () => {
        it('Must send signup credentials correctly', async () => {
            // Arrange
            const credentials = {
                email: 'newuser@test.com',
                password: 'Pass1234',
                name: 'New User'
            }
            const mockResponse = {
                data: {
                    user: {
                        id: 2,
                        email: 'newuser@test.com',
                        name: 'New User',
                        role: 'user',
                        workspaces: []
                    },
                    token: 'new-jwt-token',
                    refreshToken: 'new-refresh-token'
                }
            }
            const { api } = await import('@lib/axios')
            vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

            // Act
            const result = await authService.signup(credentials)

            // Assert
            expect(api.post).toHaveBeenCalledWith('/auth/signup', credentials)
            expect(result.token).toBe('new-jwt-token')
            expect(result.user.email).toBe('newuser@test.com')
            expect(result.user.name).toBe('New User')
        })

        it('Must throw error if email already exists', async () => {
            // Arrange
            const credentials = {
                email: 'existing@test.com',
                password: 'Pass1234',
                name: 'Existing User'
            }
            const { api } = await import('@lib/axios')
            vi.mocked(api.post).mockRejectedValueOnce({
                response: {
                    status: 409,
                    data: { error: { message: 'Email already exists' } }
                }
            })

            // Act & Assert
            await expect(authService.signup(credentials)).rejects.toMatchObject({
                response: {
                    status: 409
                }
            })
        })
    })

    describe('refreshToken', () => {
        it('Must send refreshToken and return new tokens', async () => {
            // Arrange
            const refreshToken = 'old-refresh-token'
            const mockResponse = {
                data: {
                    user: {
                        id: 1,
                        email: 'test@test.com',
                        name: 'Test User',
                        role: 'user',
                        workspaces: []
                    },
                    token: 'new-access-token',
                    refreshToken: 'new-refresh-token'
                }
            }
            const { api } = await import('@lib/axios')
            vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

            // Act
            const result = await authService.refreshToken(refreshToken)

            // Assert
            expect(api.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken })
            expect(result.token).toBe('new-access-token')
            expect(result.refreshToken).toBe('new-refresh-token')
        })

        it('Must throw error if refreshToken is invalid', async () => {
            // Arrange
            const invalidRefreshToken = 'invalid-token'
            const { api } = await import('@lib/axios')
            vi.mocked(api.post).mockRejectedValueOnce({
                response: {
                    status: 401,
                    data: { error: { message: 'Invalid refresh token' } }
                }
            })

            // Act & Assert
            await expect(authService.refreshToken(invalidRefreshToken)).rejects.toMatchObject({
                response: {
                    status: 401
                }
            })
        })
    })

    describe('logout', () => {
        it('Must call /auth/logout endpoint', async () => {
            // Arrange
            const { api } = await import('@lib/axios')
            vi.mocked(api.post).mockResolvedValueOnce({ data: {} })

            // Act
            await authService.logout()

            // Assert
            expect(api.post).toHaveBeenCalledWith('/auth/logout')
        })

        it('Must handle logout errors gracefully', async () => {
            // Arrange
            const { api } = await import('@lib/axios')
            vi.mocked(api.post).mockRejectedValueOnce({
                response: {
                    status: 500,
                    data: { error: { message: 'Server error' } }
                }
            })

            // Act & Assert
            await expect(authService.logout()).rejects.toMatchObject({
                response: {
                    status: 500
                }
            })
        })
    })
})