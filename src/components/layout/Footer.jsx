import escudo from '@/assets/escudo.png';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="contacto">
      <div className={styles.grid}>
        <div className={styles.brand}>
          <img src={escudo} alt="Escudo" className={styles.logo} />
          <h3>I.E. Técnica Santa Cruz de Motavita</h3>
          <p>
            Institución oficial de educación básica y media con énfasis técnico,
            al servicio de la comunidad de Motavita y municipios aledaños del
            departamento de Boyacá, Colombia.
          </p>
        </div>

        <div className={styles.col}>
          <h4>La Institución</h4>
          <a href="#">Nuestra Historia</a>
          <a href="#">Misión y Visión</a>
          <a href="#">Proyecto Educativo</a>
          <a href="#">Gobierno Escolar</a>
          <a href="#">Planta Docente</a>
        </div>

        <div className={styles.col}>
          <h4>Contacto</h4>
          <a href="https://maps.app.goo.gl/DJDuRhh14RWJjgZn8" target="_blank" rel="noopener noreferrer">📍 Cómo llegar</a>
          <a href="tel:+5760874200000">📞 (608) 742-0000</a>
          <a href="mailto:motavitasantacruz@sedboyaca.gov.co">✉️ motavitasantacruz@sedboyaca.gov.co</a>
          <a href="https://compucol.co/colegios/motavitaiescruz/" target="_blank" rel="noopener noreferrer">🌐 IETSCM Compucol</a>
        </div> 
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} I.E. Técnica Santa Cruz de Motavita — Motavita, Boyacá, Colombia</span>
        <span>Plataforma Web Institucional v1.0</span>
      </div>
    </footer>
  );
}
