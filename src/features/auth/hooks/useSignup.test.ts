import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSignup } from './useSignup'
import { authService } from '@/global/services/auth.service'
import { useAuthStore } from '@/stores/useAuthStore/useAuthStore'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock del servicio de auth
vi.mock('@/global/services/auth.service')

// Mock del store
vi.mock('@/stores/useAuthStore/useAuthStore')

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe llamar a authService.signup con credenciales correctas', async () => {
    // ARRANGE
    const mockLogin = vi.fn()
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      updateUser: vi.fn(),
      user: null,
      isAuthenticated: false,
    } as any)

    const signupData = {
      email: 'new@test.com',
      password: 'Pass1234',
      name: 'New User',
    }

    const mockResponse = {
      user: {
        id: '1',
        email: 'new@test.com',
        name: 'New User',
        role: 'USER',
      },
      token: 'new-token',
      refreshToken: 'new-refresh',
    }

    vi.mocked(authService.signup).mockResolvedValue(mockResponse)

    // ACT
    const { result } = renderHook(() => useSignup(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(signupData)

    // ASSERT
    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith(signupData)
      expect(mockLogin).toHaveBeenCalledWith({
        id: '1',
        email: 'new@test.com',
        name: 'New User',
        role: 'USER',
        token: 'new-token',
        refreshToken: 'new-refresh',
      })
    })
  })

  it('debe manejar errores del servidor', async () => {
    // ARRANGE
    vi.mocked(useAuthStore).mockReturnValue({
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      user: null,
      isAuthenticated: false,
    } as any)

    const errorMessage = 'Email already exists'
    vi.mocked(authService.signup).mockRejectedValue(new Error(errorMessage))

    // ACT
    const { result } = renderHook(() => useSignup(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      email: 'existing@test.com',
      password: 'Pass1234',
      name: 'Test User',
    })

    // ASSERT
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBeDefined()
    })
  })
})
