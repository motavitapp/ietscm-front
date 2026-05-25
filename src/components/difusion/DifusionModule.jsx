/**
 * components/difusion/DifusionModule.jsx
 * Módulo completo de difusión masiva por correo.
 */

import { useState, useEffect } from 'react';
import { broadcastService, parentsService } from '@/services/api';
import styles from './DifusionModule.module.css';

const TEMPLATES = [
  { id: 'urgent',    label: '📢 Comunicado urgente' },
  { id: 'meeting',   label: '📅 Convocatoria / Reunión' },
  { id: 'academic',  label: '🎓 Información académica' },
  { id: 'enrollment',label: '📋 Proceso de matrícula' },
  { id: 'alert',     label: '⚠️ Alerta o emergencia' },
  { id: 'blank',     label: '✉️ Mensaje en blanco' },
];

const SEGMENTS = [
  { value: 'all',      label: 'Todos los padres' },
  { value: 'grade_10', label: 'Solo grado 10°' },
  { value: 'grade_11', label: 'Solo grado 11°' },
  { value: 'bachillerato', label: 'Bachillerato (6°–11°)' },
  { value: 'primaria', label: 'Primaria (1°–5°)' },
];

export default function DifusionModule() {
  const [subject,    setSubject]    = useState('');
  const [body,       setBody]       = useState('');
  const [template,   setTemplate]   = useState('urgent');
  const [segment,    setSegment]    = useState('all');
  const [scheduled,  setScheduled]  = useState('now');
  const [history,    setHistory]    = useState([]);
  const [totalParents, setTotal]    = useState(null);
  const [sending,    setSending]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    parentsService.getCount().then((d) => setTotal(d.active)).catch(() => {});
    broadcastService.getHistory().then(setHistory).catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setError('El asunto y el cuerpo del comunicado son obligatorios.');
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await broadcastService.send({
        subject,
        body,
        template,
        segment,
        scheduled_at: scheduled === 'now' ? undefined : scheduled,
      });
      setResult(res);
      // Recarga historial
      broadcastService.getHistory().then(setHistory).catch(() => {});
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Intro */}
      <div className={styles.intro}>
        <span className={styles.introIcon}>⚡</span>
        <p>
          <strong>Difusión Masiva Institucional:</strong> Redacte y envíe comunicados urgentes
          o informativos directamente al correo registrado de todos los padres. El sistema notificará
          automáticamente a los <strong>{totalParents ?? '…'} destinatarios</strong> inscritos.
        </p>
      </div>

      {/* Recipients bar */}
      <div className={styles.recipientsBar}>
        <span className={styles.recipientsNum}>{totalParents ?? '…'}</span>
        <div>
          <strong>Destinatarios activos registrados</strong>
          <span>Padres/acudientes con correo verificado en el sistema</span>
        </div>
      </div>

      {/* Templates */}
      <div>
        <label className="form-label" style={{ marginBottom: 10 }}>Plantilla rápida:</label>
        <div className={styles.chips}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`${styles.chip} ${template === t.id ? styles.chipSel : ''}`}
              onClick={() => setTemplate(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="form-label">Asunto del correo *</label>
        <input
          className="form-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ej: URGENTE — Reunión de padres grado 10° y 11°"
        />
      </div>

      {/* Body */}
      <div>
        <label className="form-label">Cuerpo del comunicado *</label>
        <textarea
          className="form-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ minHeight: 160 }}
          placeholder="Redacte aquí el comunicado para los padres de familia..."
        />
      </div>

      {/* Config row */}
      <div className={styles.configRow}>
        <div>
          <label className="form-label">Segmentar destinatarios</label>
          <select className="form-select" value={segment} onChange={(e) => setSegment(e.target.value)}>
            {SEGMENTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Programar envío</label>
          <select className="form-select" value={scheduled} onChange={(e) => setScheduled(e.target.value)}>
            <option value="now">Enviar ahora</option>
            <option value="tomorrow">Mañana 7:00 a.m.</option>
            <option value="custom">Elegir fecha y hora…</option>
          </select>
        </div>
      </div>

      {/* Error / Result feedback */}
      {error  && <div className={styles.error}>{error}</div>}
      {result && (
        <div className={styles.success}>
          ✅ Comunicado enviado: <strong>{result.sent}</strong> correos enviados
          {result.failed > 0 && `, ${result.failed} fallidos`}.
        </div>
      )}

      {/* Send footer */}
      <div className={styles.sendFooter}>
        <span className={styles.warning}>
          ⚠️ Esta acción enviará correos a los destinatarios seleccionados.
          Verifique el contenido antes de enviar.
        </span>
        <button className="btn btn-outline btn-sm">👁 Vista previa</button>
        <button className={styles.sendBtn} onClick={handleSend} disabled={sending}>
          {sending ? 'Enviando…' : '📨 Enviar Comunicado'}
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <h3 className={styles.historyTitle}>📋 Historial de Difusiones</h3>
          <div className={styles.historyList}>
            {history.map((rec) => (
              <div key={rec.id} className={styles.historyItem}>
                <div className={styles.historyIcon}>📨</div>
                <div className={styles.historyInfo}>
                  <strong>{rec.subject}</strong>
                  <span>
                    Enviado el {new Date(rec.sent_at).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <div className={styles.historyMeta}>
                  <strong>{rec.recipients} enviados</strong>
                  <span>
                    {rec.recipients > 0
                      ? `${Math.round((rec.delivered / rec.recipients) * 100)}% entregados`
                      : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
