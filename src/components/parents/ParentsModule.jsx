/**
 * components/parents/ParentsModule.jsx
 *
 * - Llama a parentsService.getAll() al montarse.
 * - Renderiza la lista en tabla.
 * - Botón "Nuevo acudiente" despliega ParentForm.
 * - Al crear, agrega el registro al estado local sin refetch.
 */

import { useEffect, useState } from 'react';
import { parentsService } from '@/services/api';
import ParentForm from './ParentForm';
import styles from './ParentsModule.module.css';

export default function ParentsModule() {
  const [parents,  setParents]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search,   setSearch]   = useState('');

  // Fetch al montarse
  useEffect(() => {
    parentsService
      .getAll()
      .then(setParents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (payload) => {
    const newParent = await parentsService.create(payload);
    setParents((prev) => [newParent, ...prev]);
    setShowForm(false);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este acudiente del sistema?')) return;
    try {
      await parentsService.delete(id);
      setParents((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`No se pudo eliminar: ${err.message}`);
    }
  }; 
  
  const filtered = parents.filter((p) => {
    const full = `${p.name} ${p.last_name} ${p.email} ${p.student}`.toLowerCase();
    return full.includes(search.toLowerCase());
  });

  return (
    <div className={styles.wrapper}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={`form-input ${styles.search}`}
          placeholder="🔍 Buscar por nombre, correo o estudiante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? '✕ Cancelar' : '+ Nuevo acudiente'}
        </button>
      </div>

      {/* Formulario de creación */}
      {showForm && (
        <ParentForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Estados de carga / error / vacío */}
      {loading && (
        <p className={styles.msg}>Cargando acudientes…</p>
      )}

      {error && (
        <div className={styles.errorBox}>
          No fue posible cargar los acudientes: {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className={styles.msg}>
          {search
            ? 'No se encontraron resultados para la búsqueda.'
            : 'No hay acudientes registrados en el sistema.'}
        </p>
      )}

      {/* Tabla */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo electrónico</th>
                  <th>Estudiante</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className={styles.tdId}>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.last_name}</td>
                    <td>
                      <a href={`mailto:${p.email}`} className={styles.email}>
                        {p.email}
                      </a>
                    </td>
                    <td>
                      <span className={styles.studentBadge}>{p.student}</span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${styles.btnDel}`}
                        onClick={() => handleDelete(p.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.count}>
            Mostrando {filtered.length} de {parents.length} acudientes registrados.
          </p>
        </>
      )}
    </div>
  );
}
