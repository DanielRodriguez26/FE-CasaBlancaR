import { InputField } from "@/global/components/forms/InputField";
import { useState } from "react";
import { loginSchema } from "../../schemas";
import { useAuthStore } from "@/stores/useAuthStore/useAuthStore";

interface LoginFormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const LoginForm: React.FC = () => {
    // Estado para los datos del formulario con tipado explicito
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    // Estado para errores de validación
    const [errors, setErrors] = useState<FormErrors>({});

    const login = useAuthStore((state) => state.login);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = (e: React.FormEvent) => {
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
        else{
            login({
                id: 1,
                email: result.data.email,
                name: "Usuario",
                role: "user",
                workspaces: [],
                token: "mock-token",
                refreshToken: "mock-refresh-token",
            });
        }

        console.log("Form submitted:", result.data);
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
                                type="text"
                                error={errors.email}
                                placeholder="Nombre de usuario"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <InputField
                                id="password"
                                name="password"
                                type="password"
                                error={errors.password}
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
