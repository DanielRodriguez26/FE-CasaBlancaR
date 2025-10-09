import { InputField } from '@/global/components/forms/InputField';
import { useState, ChangeEvent, FormEvent } from 'react';
import { loginSchema } from '../../schemas';
import { useLogin } from '../../hooks/useLogin';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/global/utils';
import { useRateLimit } from '@/global/hooks/useRateLimit';

interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const LoginForm = () => {
    // State for form data with explicit typing
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        rememberMe: false,
    });
    // State for validation errors
    const [errors, setErrors] = useState<FormErrors>({});
    // React Router
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/dashboard';

    // Rate limiting - prevent brute force attacks
    const rateLimit = useRateLimit('login', {
        maxAttempts: 5,
        windowMs: 60000, // 1 minute
        blockDurationMs: 300000, // 5 minutes
    });

    const loginMutation = useLogin({
        onSuccess: () => {
            rateLimit.reset(); // Reset counter on successful login
            navigate(from, { replace: true });
        },
        onError: () => {
            rateLimit.recordAttempt(); // Increment counter on error
        },
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev, // Keep other fields
            [name]: value, // Update the changed field
        }));

        // Clear the field error if it exists
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // 0. Check rate limiting
        if (rateLimit.isBlocked) {
            setErrors({
                email: `Too many attempts. Wait ${rateLimit.remainingTime} seconds.`,
            });
            return;
        }

        // 1. Validate with Zod
        const result = loginSchema.safeParse(formData);
        // 2. If there are errors, update error state
        if (!result.success) {
            // Create empty object for errors
            const fieldErrors: FormErrors = {};

            // Iterate through each Zod error
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof FormErrors;
                fieldErrors[fieldName] = issue.message;
            });

            // Update error state
            setErrors(fieldErrors);

            // Stop the submit
            return;
        }

        loginMutation.mutate(result.data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="card card-xs sm:max-w-sm">
                <div className="max-w-md w-full space-y-8 sm:w-96">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">Accede a tu cuenta para continuar</p>
                    </div>

                    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                        <div className="mb-1 flex flex-col gap-6">
                            <InputField
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                error={errors.email}
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <InputField
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                error={errors.password}
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Additional options: Remember me and Forgot password */}
                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            rememberMe: e.target.checked,
                                        }))
                                    }
                                    className="w-4 h-4 text-slate-800 bg-gray-100 border-gray-300 rounded focus:ring-slate-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                            </label>

                            <a
                                href="/forgot-password"
                                className="text-sm text-slate-800 hover:text-slate-600 hover:underline"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                        <div>
                            {rateLimit.isBlocked && (
                                <div className="mb-3 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                                    🔒 Demasiados intentos fallidos. Por seguridad, espera{' '}
                                    <strong>{rateLimit.remainingTime} segundos</strong> antes de intentar nuevamente.
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loginMutation.isPending || rateLimit.isBlocked}
                                className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                {rateLimit.isBlocked
                                    ? `Bloqueado (${rateLimit.remainingTime}s)`
                                    : loginMutation.isPending
                                      ? 'Cargando...'
                                      : 'Iniciar Sesión'}
                            </button>
                            {loginMutation.isError && (
                                <div className="mt-2 text-sm text-red-600">
                                    {getApiErrorMessage(loginMutation.error)}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
