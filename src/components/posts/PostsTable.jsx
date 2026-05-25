/**
 * components/posts/PostsTable.jsx
 * onSubmit de PostForm ahora recibe un objeto plano JSON.
 */

import { useState } from 'react';
import PostForm from './PostForm';
import styles from './PostsTable.module.css';

const STATUS_CLASS = { published: 'tag-publicado', draft: 'tag-borrador' };
const STATUS_LABEL = { published: 'Publicado',     draft: 'Borrador' };
const CAT_CLASS    = { academico: 'tag-academico', eventos: 'tag-eventos', institucional: 'tag-institucional' };
const CAT_LABEL    = { academico: 'Académico',     eventos: 'Eventos',     institucional: 'Institucional' };

export default function PostsTable({ posts, loading, onCreate, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [search,   setSearch]   = useState('');
  const [catFilter,setCatFilter]= useState('');

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  // onCreate/onUpdate reciben el objeto JSON directamente desde PostForm
  const handleCreate = async (payload) => { await onCreate(payload);          setShowForm(false); };
  const handleUpdate = async (payload) => { await onUpdate(editPost.id, payload); setEditPost(null); };
  const handleEdit   = (post)           => { setEditPost(post); setShowForm(false); };
  const handleNew    = ()               => { setEditPost(null); setShowForm(true); };

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
        <button className="btn btn-primary btn-sm" onClick={handleNew}>
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
                      <button className={`btn btn-sm ${styles.btnEdit}`} onClick={() => handleEdit(post)}>
                        ✏️ Editar
                      </button>
                      <button className={`btn btn-sm ${styles.btnDel}`} onClick={() => handleDelete(post.id)}>
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

      {showForm  && <PostForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      {editPost  && <PostForm post={editPost} onSubmit={handleUpdate} onCancel={() => setEditPost(null)} />}
    </div>
  );
}
