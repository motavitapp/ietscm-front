/**
 * components/posts/PostCard.jsx
 *
 * Cambios UI aplicados (Tarea 1 — Landing):
 *  - Eliminados los botones "Leer más" y "Compartir" del post-footer.
 *  - El área de author/date se mantiene como información contextual.
 */

import styles from './PostCard.module.css';

const CATEGORY_CLASS = {
  academico:     styles.catAcademico,
  eventos:       styles.catEventos,
  institucional: styles.catInstitucional,
};

const CATEGORY_LABEL = {
  academico:     'Académico',
  eventos:       'Eventos',
  institucional: 'Institucional',
};

/**
 * @param {Object} props
 * @param {import('@/services/api').Post} props.post
 */
export default function PostCard({ post }) {
  const { title, body, category, author, created_at, image_urls = [] } = post;

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '';

  return (
    <article className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <span className={`${styles.categoryTag} ${CATEGORY_CLASS[category] ?? ''}`}>
            {CATEGORY_LABEL[category] ?? category}
          </span>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <span className={styles.date}>{formattedDate}</span>
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <p>{body}</p>
      </div>

      {/* ── Images (opcional) ── */}
      {image_urls.length > 0 && (
        <div className={`${styles.images} ${image_urls.length === 1 ? styles.single : styles.double}`}>
          {image_urls.map((url, i) => (
            <img key={i} src={url} alt={`Imagen ${i + 1} de ${title}`} />
          ))}
        </div>
      )}

      {/* ── Footer — solo metadatos, sin botones de acción (Tarea 1) ── */}
      <div className={styles.footer}>
        <div className={styles.author}>
          <div className={styles.authorAvatar}>
            {(author ?? 'A').slice(0, 2).toUpperCase()}
          </div>
          <span>{author}</span>
        </div>
      </div>
    </article>
  );
}
