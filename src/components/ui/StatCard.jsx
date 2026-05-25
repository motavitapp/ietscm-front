/**
 * components/ui/StatCard.jsx
 * Tarjeta de métrica reutilizable para el dashboard.
 */

import styles from './StatCard.module.css';

/**
 * @param {Object} props
 * @param {string} props.icon    - Emoji o ícono
 * @param {string} props.label   - Etiqueta descriptiva
 * @param {string|number} props.value - Valor principal
 * @param {string} [props.sub]   - Subtexto secundario
 * @param {'green'|'gold'|'red'} [props.variant]
 */
export default function StatCard({ icon, label, value, sub, variant = 'green' }) {
  return (
    <div className={styles.card}>
      <div className={styles.labelRow}>
        <span className={`${styles.iconBadge} ${styles[variant]}`}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>{value}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}
