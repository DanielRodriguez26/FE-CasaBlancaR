import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SignupForm from './SignupForm'
import { useSignup } from '../../hooks/useSignup'

// Mock del hook useSignup
vi.mock('../../hooks/useSignup')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('SignupForm', () => {
  it('debe renderizar todos los campos del formulario', () => {
    // ARRANGE
    const mockMutate = vi.fn()
    vi.mocked(useSignup).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
    } as any)

    // ACT
    render(<SignupForm />, { wrapper: createWrapper() })

    // ASSERT
    expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/^contraseña$/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/confirmar contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
  })

  it('debe mostrar error si las contraseñas no coinciden', async () => {
    // ARRANGE
    const user = userEvent.setup()
    const mockMutate = vi.fn()
    vi.mocked(useSignup).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
    } as any)

    render(<SignupForm />, { wrapper: createWrapper() })

    // ACT
    await user.type(screen.getByPlaceholderText(/^contraseña$/i), 'Pass1234')
    await user.type(screen.getByPlaceholderText(/confirmar contraseña/i), 'Pass9999')
    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    })
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('debe llamar a signup con datos válidos (sin confirmPassword)', async () => {
    // ARRANGE
    const user = userEvent.setup()
    const mockMutate = vi.fn()
    vi.mocked(useSignup).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
    } as any)

    render(<SignupForm />, { wrapper: createWrapper() })

    // ACT
    await user.type(screen.getByPlaceholderText(/nombre/i), 'Test User')
    await user.type(screen.getByPlaceholderText(/email/i), 'test@test.com')
    await user.type(screen.getByPlaceholderText(/^contraseña$/i), 'Pass1234')
    await user.type(screen.getByPlaceholderText(/confirmar contraseña/i), 'Pass1234')
    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    // ASSERT
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@test.com',
        password: 'Pass1234',
        // confirmPassword NO debe enviarse
      })
    })
  })

  it('NO debe enviar confirmPassword al servidor', async () => {
    // Este test verifica una regla de seguridad crítica
    const user = userEvent.setup()
    const mockMutate = vi.fn()
    vi.mocked(useSignup).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
    } as any)

    render(<SignupForm />, { wrapper: createWrapper() })

    await user.type(screen.getByPlaceholderText(/nombre/i), 'Test')
    await user.type(screen.getByPlaceholderText(/email/i), 'test@test.com')
    await user.type(screen.getByPlaceholderText(/^contraseña$/i), 'Pass1234')
    await user.type(screen.getByPlaceholderText(/confirmar/i), 'Pass1234')
    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    await waitFor(() => {
      const calledWith = mockMutate.mock.calls[0][0]
      expect(calledWith).not.toHaveProperty('confirmPassword')
    })
  })

  it('debe mostrar loading durante el signup', () => {
    // ARRANGE
    const mockMutate = vi.fn()
    vi.mocked(useSignup).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      isSuccess: false,
      error: null,
    } as any)

    // ACT
    render(<SignupForm />, { wrapper: createWrapper() })

    // ASSERT
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('debe deshabilitar el botón cuando está cargando', () => {
    // ARRANGE
    const mockMutate = vi.fn()
    vi.mocked(useSignup).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      isSuccess: false,
      error: null,
    } as any)

    // ACT
    render(<SignupForm />, { wrapper: createWrapper() })

    // ASSERT
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
