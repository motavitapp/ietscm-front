/**
 * components/layout/DashboardSidebar.jsx
 *
 * Cambios UI aplicados (Tarea 1 — Dashboard):
 *  - Eliminados: "Mi Perfil", "Historial Envíos", "Eventos", "Configuración"
 *  - Solo permanecen: Dashboard, Publicaciones, Difusión Masiva, Padres de Familia
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import escudo from '@/assets/escudoietscm.png';
import styles from './DashboardSidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard',           label: 'Dashboard',         icon: '📊', section: 'Principal' },
  { to: '/dashboard/posts',     label: 'Publicaciones',     icon: '📝', section: 'Contenido', badge: null },
  { to: '/dashboard/difusion',  label: 'Difusión Masiva',   icon: '📨', section: 'Comunicaciones' },
  { to: '/dashboard/parents',   label: 'Padres de Familia', icon: '👥', section: 'Comunidad' },
];

export default function DashboardSidebar({ activeSection, onSectionChange }) {
  const { logout } = useAuth();

  // Agrupa items por section para renderizar los separadores
  const sections = NAV_ITEMS.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brand}>
        <img src={escudo} alt="Escudo" />
        <span>IETSCM<br />Panel Admin</span>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {Object.entries(sections).map(([section, items]) => (
          <div key={section}>
            <p className={styles.sectionLabel}>{section}</p>
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.icon}>{item.icon}</span>
                {item.label}
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className={styles.user}>
        <div className={styles.avatar}>A</div>
        <div className={styles.userInfo}>
          <strong>Administrador/a</strong>
          <span>Sesión activa</span>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={logout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          ↩
        </button>
      </div>
    </aside>
  );
}
