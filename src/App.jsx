/**
 * App.jsx — Enrutador raíz de la aplicación.
 *
 * Rutas públicas:
 *   /          → LandingPage
 *   /login     → LoginPage
 *
 * Rutas protegidas (requieren token):
 *   /dashboard → DashboardPage
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LandingPage   from '@/pages/LandingPage';
import LoginPage     from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';

/** Guard: redirige a /login si no hay sesión activa. */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        {/* Ruta catch-all → Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
