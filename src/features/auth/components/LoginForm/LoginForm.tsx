import { InputField } from "@/global/components/forms/InputField";
import { useState, ChangeEvent, FormEvent } from "react";
import { loginSchema } from "../../schemas";
import { useLogin } from "../../hooks/useLogin";
import { useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "@/global/utils";

interface LoginFormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const LoginForm = () => {
    // Estado para los datos del formulario con tipado explicito
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    // Estado para errores de validación
    const [errors, setErrors] = useState<FormErrors>({});
    // React Router
    const location = useLocation();
    const navigate = useNavigate(); 
    const from = location.state?.from?.pathname || "/dashboard";
    const loginMutation = useLogin({
        onSuccess: () => {
            navigate(from, { replace: true });
        }
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev, // Mantenemos los otro campos
            [name]: value, // Actualizamos el campo que cambió
        }));

        // Limpiamos el error del campo que si existe
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        //1. Validar con Zod
        const result = loginSchema.safeParse(formData);
        //2. Si hay errores, actualizamos el estado de errores
        if (!result.success) {
            //Crear obejto vacio para errores
            const fieldErrors: FormErrors = {};

            // Recorrer cada error de Zod
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof FormErrors;
                fieldErrors[fieldName] = issue.message;
            });

            // Actualizar el estado de errores
            setErrors(fieldErrors);

            // Detener el submit
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
                        <div>
                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                {loginMutation.isPending ? "Cargando..." : "Iniciar Sesión"}
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
