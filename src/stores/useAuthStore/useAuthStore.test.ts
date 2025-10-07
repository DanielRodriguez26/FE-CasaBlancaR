import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "./useAuthStore";
import { AuthUser } from "@/types";

// ========================================
// MOCK DE LOCALSTORAGE
// ========================================
const mockLocalStorage = (() => {
    // Almacén interno (como la "memoria" del localStorage)
    let store: Record<string, string> = {}

    return {
        // Obtener un valor
        getItem: (key: string) => store[key] || null,

        // Guardar un valor
        setItem: (key: string, value: string) => {
            store[key] = value
        },

        // Eliminar un valor
        removeItem: (key: string) => {
            delete store[key]
        },

        // Limpiar TODO
        clear: () => {
            store = {}
        },
    }
})()

// Reemplazar el localStorage global con nuestro mock
vi.stubGlobal('localStorage', mockLocalStorage)

describe('useAuthStore', () => {
    beforeEach(() => {
        mockLocalStorage.clear()

        useAuthStore.setState({
            user: null,
            isAuthenticated: false
        })
    })

    it('debe inicializar con el usuario null y no auntenticado', () => {
        // Act obtenemos el estado actual
        const state = useAuthStore.getState()

        //ASSERT verificamos
        expect(state.user).toBeNull()
        expect(state.isAuthenticated).toBe(false)
    })
    it('debe autenticar usuario al hacer login', () => {
        // ARRANGE - Preparar datos de prueba
        const mockUser: AuthUser = {
            id: 1,
            email: 'ana@casablanca.com',
            name: 'Ana García',
            role: 'user',
            workspaces: [],
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
        }

        // ACT - Ejecutar el método login
        useAuthStore.getState().login(mockUser)

        // ASSERT - Verificar el estado
        const state = useAuthStore.getState()
        expect(state.user).toEqual(mockUser)
        expect(state.isAuthenticated).toBe(true)
    })
    it('debe limpiar el estado al hacer logout', () => {
        const mockUser: AuthUser = {
            id: 1,
            email: 'ana@casablanca.com',
            name: 'Ana García',
            role: 'user',
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            workspaces: [],
        }

        useAuthStore.setState({
            user: mockUser,
            isAuthenticated: true,
        })

        // ACT - Hacer logout
        useAuthStore.getState().logout()

        // ASSERT - Verificar limpieza
        const state = useAuthStore.getState()
        expect(state.user).toBeNull()
        expect(state.isAuthenticated).toBe(false)
    })
})
