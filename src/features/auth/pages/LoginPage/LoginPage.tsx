import { LoginForm } from "../../components/LoginForm";

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Branding - T├¡tulo de la App */}
            <div className="pt-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900">CasaBlancaR</h1>
                <p className="mt-2 text-gray-600">Gesti├│n colaborativa de tareas</p>
            </div>

            {/* LoginForm */}
            <LoginForm />
        </div>
    );
};

export default LoginPage;
