/**
 * components/posts/PostForm.jsx
 * Campo 'estado' reemplazado por 'autor' (selector desplegable).
 */

import { useState } from 'react';
import styles from './PostForm.module.css';

const CATEGORIES = [
  { value: 'academico',     label: 'Académico' },
  { value: 'eventos',       label: 'Eventos' },
  { value: 'institucional', label: 'Institucional' },
  { value: 'deportes',      label: 'Deportes' },
  { value: 'convivencia',   label: 'Convivencia' },
];

const AUTHORS = [
  'Rectoría',
  'Coordinación',
  'Consejo Académico',
  'Secretaría',
  'Cuerpo Docente',
  'Representante Estudiantil',
  'Contralor Estudiantil',
  'Asociación de Padres',
];

/**
 * @param {Object}    props
 * @param {Post|null} props.post      - null → crear nuevo
 * @param {Function}  props.onSubmit  - ({ title, body, category, author }) => Promise
 * @param {Function}  props.onCancel
 */
export default function PostForm({ post = null, onSubmit, onCancel }) {
  const [title,    setTitle]    = useState(post?.title    ?? '');
  const [body,     setBody]     = useState(post?.body     ?? '');
  const [category, setCategory] = useState(post?.category ?? 'academico');
  const [author,   setAuthor]   = useState(post?.author   ?? AUTHORS[0]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title:    title.trim(),
      body:     body.trim(),
      category,
      author,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.title}>
        {post ? '✏️ Editar Publicación' : '✨ Nueva Publicación'}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Título */}
      <div>
        <label className="form-label">Título *</label>
        <input
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Resultados académicos primer periodo 2025"
          required
        />
      </div>

      {/* Categoría + Autor — misma posición y diseño que antes tenía Categoría + Estado */}
      <div className={styles.grid2}>
        <div>
          <label className="form-label">Categoría *</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Autor *</label>
          <select
            className="form-select"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          >
            {AUTHORS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cuerpo */}
      <div>
        <label className="form-label">Contenido / Descripción *</label>
        <textarea
          className="form-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escriba aquí el cuerpo del comunicado o noticia..."
          style={{ minHeight: 120 }}
          required
        />
      </div>

      {/* Acciones */}
      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando…' : '💾 Publicar'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
