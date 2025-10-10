import { LoginForm } from '../../components/LoginForm';
import { useAuthStore } from '@/stores/useAuthStore/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginPage = () => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
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

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
