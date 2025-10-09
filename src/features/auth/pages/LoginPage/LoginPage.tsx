import { LoginForm } from "../../components/LoginForm";
import { useAuthStore } from "@/stores/useAuthStore/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Branding - Título de la App */}
            <div className="pt-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900">CasaBlancaR</h1>
                <p className="mt-2 text-gray-600">Gestión colaborativa de tareas</p>
            </div>

            {/* LoginForm */}
            <LoginForm />
        </div>
    );
};

export default LoginPage;
