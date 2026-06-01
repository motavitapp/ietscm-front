/**
 * components/parents/ParentForm.jsx
 * Formulario para registrar un nuevo acudiente.
 *
 * onSubmit recibe: { name, last_name, email, student }
 */

import { useState } from 'react';
import styles from './ParentForm.module.css';

/**
 * @param {Object}   props
 * @param {Function} props.onSubmit  - (payload) => Promise
 * @param {Function} props.onCancel
 */
export default function ParentForm({ onSubmit, onCancel }) {
  const [name,      setName]      = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [student,   setStudent]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación manual (necesaria porque el form usa noValidate)
    if (!name.trim()) {
      setError('El nombre del acudiente es obligatorio.');
      setLoading(false);
      return;
    }
    if (!lastName.trim()) {
      setError('El apellido del acudiente es obligatorio.');
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.');
      setLoading(false);
      return;
    }
    if (!student.trim()) {
      setError('El nombre completo del estudiante es obligatorio.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);


    const payload = {
      name:      name.trim(),
      last_name: lastName.trim(),
      email:     email.trim(),
      student:   student.trim(),
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
      <div className={styles.title}>👤 Registrar nuevo acudiente</div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid2}>
        <div>
          <label className="form-label">Nombre del acudiente *</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Maria Fernanda"
            required
          />
        </div>
        <div>
          <label className="form-label">Apellido del acudiente *</label>
          <input
            className="form-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Ej: González Pérez"
            required
          />
        </div>
      </div>

      <div>
        <label className="form-label">Correo electrónico *</label>
        <input
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ej: acudiente@gmail.com"
          required
        />
      </div>

      <div>
        <label className="form-label">Nombre completo del estudiante *</label>
        <input
          className="form-input"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
          placeholder="Ej: Laura Díaz"
          required
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando…' : '💾 Guardar'}
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
