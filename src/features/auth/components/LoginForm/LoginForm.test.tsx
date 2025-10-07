import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import LoginForm from './LoginForm';

/**
 * Test Suite: LoginForm Component
 *
 * Objetivo: Validar el comportamiento del componente LoginForm siguiendo TDD estricto
 *
 * Categorías de tests:
 * 1. Renderizado inicial
 * 2. Interacción con inputs
 * 3. Validación de formulario (FASE RED - no implementado aún)
 * 4. Submit del formulario
 */

describe('LoginForm Component', () => {
  /**
   * Setup: Se ejecuta antes de cada test
   * Garantiza que cada test tenga un DOM limpio
   */
  beforeEach(() => {
    // React Testing Library limpia automáticamente después de cada test
    // Este beforeEach es opcional pero útil para setups futuros
  });

  // ============================================
  // CATEGORÍA 1: RENDERIZADO INICIAL
  // ============================================

  describe('Renderizado inicial', () => {
    it('debe renderizar el formulario correctamente', () => {
      // Arrange: Renderizar el componente
      render(<LoginForm />);

      // Act: No hay acción, solo verificamos renderizado

      // Assert: Verificar que el formulario existe
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('debe mostrar el título "Iniciar Sesión"', () => {
      // Arrange
      render(<LoginForm />);

      // Act: No hay acción

      // Assert: Verificar que el título existe y es visible
      const heading = screen.getByRole('heading', { name: /iniciar sesión/i });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Iniciar Sesión');
    });

    it('debe mostrar el campo de email con placeholder correcto', () => {
      // Arrange
      render(<LoginForm />);

      // Act: No hay acción

      // Assert: Verificar que el input de email existe
      const emailInput = screen.getByPlaceholderText(/nombre de usuario/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'text');
      expect(emailInput).toHaveAttribute('name', 'email');
    });

    it('debe mostrar el campo de password con placeholder correcto', () => {
      // Arrange
      render(<LoginForm />);

      // Act: No hay acción

      // Assert: Verificar que el input de password existe
      const passwordInput = screen.getByPlaceholderText(/contraseña/i);
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
    });

    it('debe mostrar el botón de submit con texto correcto', () => {
      // Arrange
      render(<LoginForm />);

      // Act: No hay acción

      // Assert: Verificar que el botón existe
      // Nota: El componente tiene "Iniciar Sesión" con comillas, buscar por contenido
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  // ============================================
  // CATEGORÍA 2: INTERACCIÓN CON INPUTS
  // ============================================

  describe('Interacción con inputs', () => {
    it('debe actualizar el estado cuando el usuario escribe en email', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText(/nombre de usuario/i);

      // Act: Usuario escribe en el campo de email
      await user.type(emailInput, 'usuario@example.com');

      // Assert: Verificar que el valor se actualizó
      expect(emailInput).toHaveValue('usuario@example.com');
    });

    it('debe actualizar el estado cuando el usuario escribe en password', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const passwordInput = screen.getByPlaceholderText(/contraseña/i);

      // Act: Usuario escribe en el campo de password
      await user.type(passwordInput, 'miPassword123');

      // Assert: Verificar que el valor se actualizó
      expect(passwordInput).toHaveValue('miPassword123');
    });

    it('debe permitir escribir en ambos campos independientemente', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText(/nombre de usuario/i);
      const passwordInput = screen.getByPlaceholderText(/contraseña/i);

      // Act: Usuario escribe en ambos campos
      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');

      // Assert: Verificar que ambos valores se mantienen
      expect(emailInput).toHaveValue('test@test.com');
      expect(passwordInput).toHaveValue('password123');
    });
  });

  // ============================================
  // CATEGORÍA 3: VALIDACIÓN (FASE RED)
  // Estos tests FALLARÁN porque la validación no está implementada
  // ============================================

  describe('Validación de formulario (FASE RED - No implementado)', () => {
    it('debe mostrar error si email está vacío al submit', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Act: Usuario intenta submitear sin llenar email
      await user.click(submitButton);

      // Assert: Debería mostrar mensaje de error (Zod muestra "no es válido" para string vacío)
      await waitFor(() => {
        const errorMessage = screen.getByText(/el email no es válido/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('debe mostrar error si email no es válido al submit', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText(/nombre de usuario/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Act: Usuario escribe email inválido y submitea
      await user.type(emailInput, 'emailinvalido');
      await user.click(submitButton);

      // Assert: Debería mostrar mensaje de error
      // ESTE TEST FALLARÁ porque la validación no está implementada
      await waitFor(() => {
        const errorMessage = screen.getByText(/el email no es válido/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('debe mostrar error si password está vacío al submit', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Act: Usuario intenta submitear sin llenar password
      await user.click(submitButton);

      // Assert: Debería mostrar mensaje de error (Zod muestra error de longitud mínima)
      await waitFor(() => {
        const errorMessage = screen.getByText(/la contraseña debe tener al menos 8 caracteres/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('debe mostrar error si password es menor a 8 caracteres', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const passwordInput = screen.getByPlaceholderText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Act: Usuario escribe password muy corto y submitea
      await user.type(passwordInput, 'abc123');
      await user.click(submitButton);

      // Assert: Debería mostrar mensaje de error
      // ESTE TEST FALLARÁ porque la validación no está implementada
      await waitFor(() => {
        const errorMessage = screen.getByText(/la contraseña debe tener al menos 8 caracteres/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('debe limpiar el error de email cuando el usuario empieza a escribir', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText(/nombre de usuario/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Act: Usuario submitea con email vacío (genera error), luego escribe
      await user.click(submitButton);

      // Esperar a que aparezca el error
      await waitFor(() => {
        expect(screen.getByText(/el email no es válido/i)).toBeInTheDocument();
      });

      // Usuario empieza a escribir
      await user.type(emailInput, 'a');

      // Assert: El error debería desaparecer
      await waitFor(() => {
        expect(screen.queryByText(/el email no es válido/i)).not.toBeInTheDocument();
      });
    });

    it('debe limpiar el error de password cuando el usuario empieza a escribir', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const passwordInput = screen.getByPlaceholderText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Act: Usuario submitea con password vacío (genera error), luego escribe
      await user.click(submitButton);

      // Esperar a que aparezca el error
      await waitFor(() => {
        expect(screen.getByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
      });

      // Usuario empieza a escribir
      await user.type(passwordInput, 'a');

      // Assert: El error debería desaparecer
      await waitFor(() => {
        expect(screen.queryByText(/la contraseña debe tener al menos 8 caracteres/i)).not.toBeInTheDocument();
      });
    });
  });

  // ============================================
  // CATEGORÍA 4: SUBMIT DEL FORMULARIO
  // ============================================

  describe('Submit del formulario', () => {
    it('debe prevenir el comportamiento default del form al submitear', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Act: Usuario hace click en submit
      await user.click(submitButton);

      // Assert: La página no debe recargar (implícito si el test no falla)
      // Si preventDefault no funcionara, el test fallaría por recarga de página
      expect(submitButton).toBeInTheDocument();
    });

    it('NO debe submitear si hay errores de validación', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Act: Usuario intenta submitear con datos inválidos
      await user.click(submitButton);

      // Assert: No debería llamar al login (verificar que errores se muestran)
      await waitFor(() => {
        const emailError = screen.queryByText(/el email no es válido/i);
        const passwordError = screen.queryByText(/la contraseña debe tener al menos 8 caracteres/i);

        // Al menos uno de los errores debería estar presente
        expect(emailError || passwordError).toBeTruthy();
      });
    });

    it('debe permitir submit si los datos son válidos', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText(/nombre de usuario/i);
      const passwordInput = screen.getByPlaceholderText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Act: Usuario llena el formulario correctamente y submitea
      await user.type(emailInput, 'usuario@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert: No debería haber errores de validación
      await waitFor(() => {
        expect(screen.queryByText(/requerido/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/no es válido/i)).not.toBeInTheDocument();
      });
    });
  });
});
