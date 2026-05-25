/**
 * components/layout/Header.jsx
 *
 * Cambios UI aplicados (Tarea 1):
 *  - Se eliminaron los enlaces: "Inicio", "Institución", "Académico", "Noticias"
 *  - Se conservan únicamente: "Contacto" e "Ingresar"
 */

import { Link } from 'react-router-dom';
import escudo from '@/assets/escudo.png';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <img src={escudo} alt="Escudo I.E. Técnica Santa Cruz de Motavita" className={styles.logo} />
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>I.E. Técnica Santa Cruz de Motavita</h1>
          <span className={styles.subtitle}>Municipio de Motavita — Boyacá</span>
        </div>
      </Link>

      <nav className={styles.nav}>
        {/* Solo Contacto e Ingresar (Tarea 1 — Landing nav) */}
        <a href="#contacto" className={styles.navLink}>Contacto</a>
        <Link to="/login" className={styles.loginBtn}>Ingresar</Link>
      </nav>
    </header>
  );
}
