import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/global/components/ProtectedRoute'
import { routes } from './routes'
import { NotFoundPage } from '@/features/pages'

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    )
}

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public Routes */}
                    {routes.public.map(route => (
                        <Route key={route.path} path={route.path} element={<route.component />} />
                    ))}

                    {/* Protected Routes */}
                    {routes.protected.map(route => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <ProtectedRoute requiredRoles={route.requiredRoles}>
                                    <route.component />
                                </ProtectedRoute>
                            }
                        />
                    ))}

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}
