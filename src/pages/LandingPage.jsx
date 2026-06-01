/**
 * pages/LandingPage.jsx
 * Feed dinámico: ejecuta postsService.getAll() al montarse,
 * sin datos mock hardcodeados.
 */

import { useEffect, useState } from 'react';
import { postsService } from '@/services/api';
import Header   from '@/components/layout/Header';
import Footer   from '@/components/layout/Footer';
import PostCard from '@/components/posts/PostCard';
import fachada  from '@/assets/fachada.jpg';
import styles   from './LandingPage.module.css';

const POSTS_PER_PAGE = 5;


export default function LandingPage() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  

  // Fetch al montarse — solo posts publicados, sin token
  useEffect(() => {
    postsService
      .getAll({ status: 'published' })
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Lógica de paginación ─────────────────────────────────────────
  const totalPages  = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex  = (currentPage - 1) * POSTS_PER_PAGE;         // ej. pág 2 → índice 5
  const endIndex    = currentPage * POSTS_PER_PAGE;                // ej. pág 2 → índice 10
  const postsInView = posts.slice(startIndex, endIndex);           // bloque visible

  const goToPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div>
      <Header />

      

      {/* Hero */}
      <div className={styles.hero}>
        <img src={fachada} alt="Fachada I.E. Técnica Santa Cruz de Motavita" className={styles.heroImg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>Institución Educativa Oficial</div>
            <h2>Formando líderes con vocación técnica y valores humanos</h2>
            <p>
              Brindamos educación de calidad en el municipio de Motavita, preparando
              a nuestros estudiantes para los retos del siglo XXI con énfasis en
              formación técnica.
            </p>
          </div>
        </div>
        <div className={styles.heroStats}>
          {[
            { num: '850+', label: 'Estudiantes' },
            { num: '45',   label: 'Docentes' },
            { num: '35',   label: 'Años de historia' },
            { num: '12',   label: 'Programas' },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className={styles.mainLayout}>

        {/* Feed */}
        <main>
          <h2 className="section-title">📰 Publicaciones Recientes</h2>

          {loading && (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
              Cargando publicaciones…
            </p>
          )}

          {error && (
            <div style={{
              background: 'var(--rojo-light)', color: 'var(--rojo)',
              padding: '14px 18px', borderRadius: 'var(--radius)',
              marginBottom: 16, fontSize: 14,
            }}>
              No fue posible cargar las publicaciones: {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
              No hay publicaciones disponibles en este momento.
            </p>
          )}

          {/* Bloque visible de posts (slice del array completo) */}
          {postsInView.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* ── Controles de paginación ── */}
          {!loading && !error && totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={goToPrev}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                ← Anterior
              </button>

              <span className={styles.pageInfo}>
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </span>

              <button
                className={styles.pageBtn}
                onClick={goToNext}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
              >
                Siguiente →
              </button>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside>
          <div className={styles.sideCard}>
            <div className={styles.sideCardHeader}>📍 Información Institucional</div>
            <div className={styles.sideCardBody}>
              {[
                { icon: '📍', label: 'Dirección',  value: 'Cl. 1 #2-3, Motavita, Boyacá' },
                { icon: '📞', label: 'Teléfono',   value: '(608) 742-0000' },
                { icon: '✉️', label: 'Correo',     value: 'motavitasantacruz@sedboyaca.gov.co' },
                { icon: '🕐', label: 'Horario',    value: 'Lun–Vie: 7:00 a.m. – 5:00 p.m.' },
                { icon: '🏫', label: 'Jornada',    value: 'Única — Presencial' },
              ].map((row) => (
                <div key={row.label} className={styles.infoRow}>
                  <span>{row.icon}</span>
                  <div>
                    <strong>{row.label}</strong>
                    <span>{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideCardHeader}>🔗 Accesos Rápidos</div>
            <div className={styles.sideCardBody}>
              {[
                'PEI Institucional',
                'Resultados Académicos',
                'Calendario Escolar',
                'Manual de Convivencia',
                'Proyección Técnica',
              ].map((item) => (
                <a key={item} href="#" className={styles.quickLink}>
                  📋 {item} <span className={styles.arrow}>›</span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
