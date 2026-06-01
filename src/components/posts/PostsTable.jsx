/**
 * components/posts/PostsTable.jsx
 *
 * Cambios respecto a la versión anterior:
 *  - Eliminado: estado editPost
 *  - Eliminado: función handleEdit
 *  - Eliminado: función handleUpdate
 *  - Eliminado: prop onUpdate
 *  - Eliminado: botón "✏️ Editar" en cada fila
 *  - Eliminado: <PostForm> condicional para edición
 *  - Simplificado: <PostForm> solo se usa para crear nuevos posts
 */

import { useState } from 'react';
import PostForm from './PostForm';
import styles from './PostsTable.module.css';

const STATUS_CLASS = { published: 'tag-publicado', draft: 'tag-borrador' };
const STATUS_LABEL = { published: 'Publicado',     draft: 'Borrador' };
const CAT_CLASS    = { academico: 'tag-academico', eventos: 'tag-eventos', institucional: 'tag-institucional' };
const CAT_LABEL    = { academico: 'Académico',     eventos: 'Eventos',     institucional: 'Institucional' };

/**
 * @param {Object}   props
 * @param {Post[]}   props.posts
 * @param {boolean}  props.loading
 * @param {Function} props.onCreate  - (payload) => Promise
 * @param {Function} props.onDelete  - (id) => Promise
 */
export default function PostsTable({ posts, loading, onCreate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [search,   setSearch]   = useState('');
  const [catFilter,setCatFilter]= useState('');

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleCreate = async (payload) => {
    await onCreate(payload);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    await onDelete(id);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={`form-input ${styles.search}`}
          placeholder="🔍 Buscar publicaciones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          style={{ width: 180 }}
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="academico">Académico</option>
          <option value="eventos">Eventos</option>
          <option value="institucional">Institucional</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          + Crear post
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className={styles.empty}>Cargando publicaciones…</p>
      ) : filtered.length === 0 ? (
        <p className={styles.empty}>No se encontraron publicaciones.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td>
                    <strong className={styles.postTitle}>{post.title}</strong>
                    <span className={styles.postAuthor}>{post.author}</span>
                  </td>
                  <td>
                    <span className={`tag ${CAT_CLASS[post.category] ?? ''}`}>
                      {CAT_LABEL[post.category] ?? post.category}
                    </span>
                  </td>
                  <td>
                    <span className={`tag ${STATUS_CLASS[post.status] ?? ''}`}>
                      {STATUS_LABEL[post.status] ?? post.status}
                    </span>
                  </td>
                  <td className={styles.date}>
                    {new Date(post.created_at).toLocaleDateString('es-CO')}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`btn btn-sm ${styles.btnDel}`}
                        onClick={() => handleDelete(post.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulario para creación */}
      {showForm && (
        <PostForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
