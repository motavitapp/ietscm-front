/**
 * pages/LoginPage.jsx
 *
 * Cambios UI aplicados (Tarea 1):
 *  ✓ Botón "Volver" debajo de "Iniciar Sesión" → redirige a la Landing
 *  ✓ Eliminado el aviso "Conexión cifrada SSL/TLS · Solo personal autorizado"
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import escudo from '@/assets/escudo.png';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login({ email, password });
    if (ok) navigate('/dashboard', { replace: true });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.topStripe} />
      <div className={styles.bgPattern} />

      <div className={styles.card}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <img src={escudo} alt="Escudo Institucional" className={styles.logo} />
          <h2>I.E. Técnica Santa Cruz de Motavita</h2>
          <span>Acceso Administrativo</span>
        </div>

        {/* Body */}
        <div className={styles.cardBody}>
          <div className={styles.divider}><span>Ingrese sus credenciales</span></div>

          <form onSubmit={handleSubmit} noValidate>
            {error && <div className={styles.error}>{error}</div>}

            <div className="form-group">
              <label className="form-label">Correo electrónico institucional</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>📧</span>
                <input
                  type="email"
                  className={`form-input ${styles.withIcon}`}
                  placeholder="usuario@ietscm.edu.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  type="password"
                  className={`form-input ${styles.withIcon}`}
                  placeholder="Contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Iniciar sesión */}
            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión…' : 'Iniciar Sesión →'}
            </button>

            {/* Volver — Tarea 1: botón justo debajo de "Iniciar Sesión" */}
            <Link to="/" className={styles.backBtn}>
              ← Volver a la página principal
            </Link>
          </form>

          <div className={styles.forgotLink}>
            ¿Olvidó su contraseña?{' '}
            <a href="#">Restablecer acceso</a>
          </div>

          {/* Aviso SSL eliminado (Tarea 1) */}
        </div>
      </div>

      <p className={styles.footerNote}>
        © {new Date().getFullYear()} I.E. Técnica Santa Cruz de Motavita — Plataforma de Gestión Institucional
      </p>
    </div>
  );
}
