import { useMutation } from "@tanstack/react-query";
import { authService } from "@/global/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore/useAuthStore";
import { LoginCredencials } from "@/types/api.type";
import { AxiosError } from "axios";

interface UseLoginOptions {
    onSuccess?: () => void;
    onError?: (error: AxiosError) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
    const login = useAuthStore((state) => state.login)

    return useMutation({
        mutationFn: (credentials: LoginCredencials) => authService.login(credentials),
        onSuccess: (data) => {
            login({
                ...data.user,
                token: data.token,
                refreshToken: data.refreshToken
            })
            options?.onSuccess?.()
        },
        onError: (error: AxiosError) => {
            // Manage error (opcional: logging, analytics)
            console.error('Login Failed:', error)
            options?.onError?.(error)
        }
    })
}