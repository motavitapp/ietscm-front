/**
 * hooks/useAuth.js
 * Hook de autenticación — gestiona sesión con React Context.
 * Expone: { user, isAuthenticated, login, logout, loading }
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const isAuthenticated = authService.isAuthenticated();

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(credentials);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    // Fuerza re-render redirigiendo al root
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
