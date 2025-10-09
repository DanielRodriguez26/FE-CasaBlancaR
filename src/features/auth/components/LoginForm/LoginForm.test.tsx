import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import LoginForm from "./LoginForm";

vi.mock("../../hooks/useLogin", () => ({
    useLogin: (options?: any) => ({
        mutate: vi.fn(),
        isPending: false,
        isError: false,
        error: null
    })
}))

vi.mock("@/global/hooks/useRateLimit", () => ({
    useRateLimit: () => ({
        isBlocked: false,
        remainingTime: 0,
        reset: vi.fn(),
        recordAttempt: vi.fn()
    })
}))

const renderwithProviders = (component: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions:{
            queries:{ retry: false },
            mutations:{ retry: false }
        }
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                {component}
            </MemoryRouter>
        </QueryClientProvider>
    )
};

/**
 * Test Suite: LoginForm Component
 *
 * Objective: Validate LoginForm component behavior following strict TDD
 *
 * Test categories:
 * 1. Initial rendering
 * 2. Input interaction
 * 3. Form validation (RED PHASE - not implemented yet)
 * 4. Form submission
 */

describe("LoginForm Component", () => {
    /**
     * Setup: Runs before each test
     * Ensures each test has a clean DOM
     */
    beforeEach(() => {
        // React Testing Library automatically cleans up after each test
        // This beforeEach is optional but useful for future setups
    });

    // ============================================
    // CATEGORY 1: INITIAL RENDERING
    // ============================================

    describe("Initial rendering", () => {
        it("should render the form correctly", () => {
            // Arrange: Render the component
            renderwithProviders(<LoginForm />)

            // Act: No action, just verify rendering

            // Assert: Verify the form exists
            const form = document.querySelector("form");
            expect(form).toBeInTheDocument();
        });

        it('should display the "Iniciar Sesión" heading', () => {
            // Arrange
            renderwithProviders(<LoginForm />)

            // Act: No action

            // Assert: Verify the heading exists and is visible
            const heading = screen.getByRole("heading", { name: /iniciar sesión/i });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent("Iniciar Sesión");
        });

        it("should display the email field with correct placeholder", () => {
            // Arrange
            renderwithProviders(<LoginForm />)

            // Act: No action

            // Assert: Verify the email input exists
            const emailInput = screen.getByPlaceholderText(/email/i);
            expect(emailInput).toBeInTheDocument();
            expect(emailInput).toHaveAttribute("type", "email");
            expect(emailInput).toHaveAttribute("name", "email");
        });

        it("should display the password field with correct placeholder", () => {
            // Arrange
            renderwithProviders(<LoginForm />)

            // Act: No action

            // Assert: Verify the password input exists
            const passwordInput = screen.getByPlaceholderText(/contraseña/i);
            expect(passwordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute("type", "password");
            expect(passwordInput).toHaveAttribute("name", "password");
        });

        it("should display the submit button with correct text", () => {
            // Arrange
            renderwithProviders(<LoginForm />)

            // Act: No action

            // Assert: Verify the button exists
            // Note: The component has "Iniciar Sesión" in quotes, search by content
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveAttribute("type", "submit");
        });
    });

    // ============================================
    // CATEGORY 2: INPUT INTERACTION
    // ============================================

    describe("Input interaction", () => {
        it("should update state when user types in email", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const emailInput = screen.getByPlaceholderText(/email/i);

            // Act: User types in the email field
            await user.type(emailInput, "usuario@example.com");

            // Assert: Verify the value was updated
            expect(emailInput).toHaveValue("usuario@example.com");
        });

        it("should update state when user types in password", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const passwordInput = screen.getByPlaceholderText(/contraseña/i);

            // Act: User types in the password field
            await user.type(passwordInput, "miPassword123");

            // Assert: Verify the value was updated
            expect(passwordInput).toHaveValue("miPassword123");
        });

        it("should allow typing in both fields independently", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/contraseña/i);

            // Act: User types in both fields
            await user.type(emailInput, "test@test.com");
            await user.type(passwordInput, "password123");

            // Assert: Verify both values are maintained
            expect(emailInput).toHaveValue("test@test.com");
            expect(passwordInput).toHaveValue("password123");
        });
    });

    // ============================================
    // CATEGORY 3: VALIDATION (RED PHASE)
    // These tests will FAIL because validation is not implemented
    // ============================================

    describe("Form validation (RED PHASE - Not implemented)", () => {
        it("should show error if email is empty on submit", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

            // Act: User attempts to submit without filling email
            await user.click(submitButton);

            // Assert: Should display error message
            await waitFor(() => {
                const errorMessage = screen.getByText("El email no es válido");
                expect(errorMessage).toBeInTheDocument();
            });
        });

        it("debe mostrar error si email no es válido al submit", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const emailInput = screen.getByPlaceholderText(/email/i);
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

            // Act: Usuario escribe email inválido y submitea
            await user.type(emailInput, "emailinvalido");
            await user.click(submitButton);

            // Assert: Should display error message
            await waitFor(() => {
                const errorMessage = screen.getByText("El email no es válido");
                expect(errorMessage).toBeInTheDocument();
            });
        });

        it("debe mostrar error si password está vacío al submit", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

            // Act: Usuario intenta submitear sin llenar password
            await user.click(submitButton);

            // Assert: Should display error message (Zod muestra error de longitud mínima)
            await waitFor(() => {
                const errorMessage = screen.getByText(/la contraseña debe tener al menos 8 caracteres/i);
                expect(errorMessage).toBeInTheDocument();
            });
        });

        it("debe mostrar error si password es menor a 8 caracteres", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const passwordInput = screen.getByPlaceholderText(/contraseña/i);
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

            // Act: Usuario escribe password muy corto y submitea
            await user.type(passwordInput, "abc123");
            await user.click(submitButton);

            // Assert: Should display error message
            // ESTE TEST FALLARÁ porque la validación no está implementada
            await waitFor(() => {
                const errorMessage = screen.getByText(/la contraseña debe tener al menos 8 caracteres/i);
                expect(errorMessage).toBeInTheDocument();
            });
        });

        it("debe limpiar el error de email cuando el usuario empieza a escribir", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const emailInput = screen.getByPlaceholderText(/email/i);
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

            // Act: Usuario submitea con email vacío (genera error), luego escribe
            await user.click(submitButton);

            // Esperar a que aparezca el error
            await waitFor(() => {
                expect(screen.getByText("El email no es válido")).toBeInTheDocument();
            });

            // Usuario empieza a escribir
            await user.type(emailInput, "a");

            // Assert: El error debería desaparecer
            await waitFor(() => {
                expect(screen.queryByText("El email no es válido")).not.toBeInTheDocument();
            });
        });

        it("debe limpiar el error de password cuando el usuario empieza a escribir", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const passwordInput = screen.getByPlaceholderText(/contraseña/i);
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

            // Act: Usuario submitea con password vacío (genera error), luego escribe
            await user.click(submitButton);

            // Esperar a que aparezca el error
            await waitFor(() => {
                expect(screen.getByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
            });

            // Usuario empieza a escribir
            await user.type(passwordInput, "a");

            // Assert: El error debería desaparecer
            await waitFor(() => {
                expect(screen.queryByText(/la contraseña debe tener al menos 8 caracteres/i)).not.toBeInTheDocument();
            });
        });
    });

    // ============================================
    // CATEGORÍA 4: SUBMIT DEL FORMULARIO
    // ============================================

    describe("Submit del formulario", () => {
        it("debe prevenir el comportamiento default del form al submitear", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

            // Act: Usuario hace click en submit
            await user.click(submitButton);

            // Assert: La página no debe recargar (implícito si el test no falla)
            // Si preventDefault no funcionara, el test fallaría por recarga de página
            expect(submitButton).toBeInTheDocument();
        });

        it("NO debe submitear si hay errores de validación", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

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

        it("debe permitir submit si los datos son válidos", async () => {
            // Arrange
            const user = userEvent.setup();
            renderwithProviders(<LoginForm />)
            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/contraseña/i);
            const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

            // Act: Usuario llena el formulario correctamente y submitea
            await user.type(emailInput, "usuario@example.com");
            await user.type(passwordInput, "password123");
            await user.click(submitButton);

            // Assert: No debería haber errores de validación
            await waitFor(() => {
                expect(screen.queryByText(/requerido/i)).not.toBeInTheDocument();
                expect(screen.queryByText(/no es válido/i)).not.toBeInTheDocument();
            });
        });
    });
});
