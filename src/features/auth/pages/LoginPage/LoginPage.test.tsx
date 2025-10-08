import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import  LoginPage  from "./LoginPage";
import { useAuthStore } from "@/stores/useAuthStore/useAuthStore";

// Mock the useAuthStore hook
vi.mock("@/stores/useAuthStore/useAuthStore");

// Mock the useNavigate hook from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

/**
 * Test Suite: LoginPage Component
 *
 * Objective: Verifyy the component's behavior under different authentication states.
 *
 * Test Cases:
 * 1. Basic Rendering
 * 2. Redirects if user is authenticated.
 * 3. Redirects if afet that login is successful.
 */

describe("LoginPage Component", () => {
    beforeEach(() => {
        //Clear all mocks before each test
        vi.clearAllMocks();
    });
    //=====================================
    // Test Case 1: Basic Rendering
    //=====================================

    describe("Basic Rendering", () => {
        it("render LoginForm component", () => {
            //Arrange: mock of store
            vi.mocked(useAuthStore).mockRejectedValue({
                user: null,
                isAuthenticated: false,
                login: vi.fn(),
                logout: vi.fn(),
                updateUser: vi.fn(),
            });

            //Att: render the Page
            render(
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>,
            );

            //Assert: check if the LoginForm is in the document
            // find the title "Iniciar Sesion" that is LoginForm component
            const heading = screen.getByRole("heading", { name: /iniciar sesión/i });
            expect(heading).toBeInTheDocument();
        });

        it("Must show the title of the App", () => {
            //Arrange: mock of store
            vi.mocked(useAuthStore).mockRejectedValue({
                user: null,
                isAuthenticated: false,
                login: vi.fn(),
                logout: vi.fn(),
                updateUser: vi.fn(),
            });

            //Att
            render(
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>,
            );
            //Assert Check if the title of the App is in the document
            const title = screen.getByText(/casablancar/i);
            expect(title).toBeInTheDocument();
        });
    });

    //====================================================
    // Test Case 2: Redirects if user is authenticated.
    //====================================================

    describe("Redirects if user is authenticated", () => {
        it("Must redirect /dashboard if user is authenticated", () => {
            //Arrange: mock of store - user is authenticated
            vi.mocked(useAuthStore).mockReturnValue({
                user: {
                    id: "1",
                    name: "Test User",
                    email: "",
                    role: "user",
                    workspaces: [],
                    toke: "mock-token",
                    refreshtoken: "mock-refresh-token",
                },
                isAuthenticated: true,
                login: vi.fn(),
                logout: vi.fn(),
                updateUser: vi.fn(),
            });
            //Att
            render(
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>,
            );
            //Assert: check if navigate was called with /dashboard
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
        });
    });
});
