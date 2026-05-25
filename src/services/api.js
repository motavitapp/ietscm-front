/**
 * services/api.js — Capa de red centralizada para FastAPI
 *
 * Reglas de autenticación:
 *   PUBLIC  → postsService.getAll, postsService.getById
 *   AUTH    → postsService.create/update/delete, broadcastService.*, parentsService.*, statsService.*
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

// ── Token helpers ────────────────────────────────────────────────────

const getToken = () => sessionStorage.getItem('ietscm_token');

/**
 * @param {boolean} requiresAuth - inyecta Bearer si true
 * @param {boolean} isJson       - adjunta Content-Type: application/json si true
 */
const buildHeaders = (requiresAuth = false, isJson = true) => {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (requiresAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Wrapper central de fetch.
 * @param {string}  endpoint     - Ruta relativa, ej. '/posts'
 * @param {object}  opts         - Opciones fetch estándar
 * @param {boolean} requiresAuth - Inyecta Bearer token si true
 */
const request = async (endpoint, opts = {}, requiresAuth = false) => {
  const config = {
    ...opts,
    headers: {
      ...buildHeaders(requiresAuth, opts.body !== undefined),
      ...(opts.headers ?? {}),
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.detail ?? `Error HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

// ════════════════════════════════════════════════════════════════════
//  AUTH SERVICE
// ════════════════════════════════════════════════════════════════════

export const authService = {
  // FastAPI OAuth2PasswordRequestForm exige x-www-form-urlencoded
  login: async ({ email, password }) => {
    const payload = {
      user_name: email,
      user_password: password
    };

    const data = await request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Persiste el token para las siguientes peticiones
    sessionStorage.setItem('ietscm_token', data.access_token);
    return data;
  },


  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' }, true);
    } finally {
      sessionStorage.removeItem('ietscm_token');
    }
  },

  isAuthenticated: () => Boolean(getToken()),
};

// ════════════════════════════════════════════════════════════════════
//  POSTS SERVICE
// ════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} Post
 * @property {number}   id
 * @property {string}   title
 * @property {string}   body
 * @property {string}   category    - 'academico' | 'eventos' | 'institucional'
 * @property {string}   status      - 'published' | 'draft'
 * @property {string[]} image_urls
 * @property {string}   author
 * @property {string}   created_at  - ISO 8601
 *
* @typedef {Object} PostPayload
 * @property {string} title
 * @property {string} body
 * @property {string} category
 * @property {string} author  - 'Rectoría'|'Coordinación'|'Consejo Académico'|
 *                              'Cuerpo Docente'|'Representante Estudiantil'|
 *                              'Contralor Estudiantil'|'Asociación de Padres'
 */

export const postsService = {
  /**
   * PÚBLICO — sin token.
   * GET /posts?category=&status=
   * Respuesta: Post[]
   */
  getAll: (filters = {}) => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    ).toString();
    return request(`/posts${params ? `?${params}` : ''}`, {}, false);
  },

  /**
   * PÚBLICO — sin token.
   * GET /posts/:id
   * Respuesta: Post
   */
  getById: (id) => request(`/posts/${id}`, {}, false),

  /**
   * PROTEGIDO — requiere token.
   * POST /posts
   * Content-Type: application/json
   *
   * Payload: { title, body, category, status }
   * Respuesta: Post (con id y created_at asignados por el servidor)
   */
  create: (payload) =>
    request('/posts', { method: 'POST', body: JSON.stringify(payload) }, true),

  /**
   * PROTEGIDO — requiere token.
   * PUT /posts/:id
   * Content-Type: application/json
   *
   * Payload: Partial<PostPayload>
   * Respuesta: Post actualizado
   */
  update: (id, payload) =>
    request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, true),

  /**
   * PROTEGIDO — requiere token.
   * DELETE /posts/:id
   * Respuesta: 204 No Content
   */
  delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }, true),
};

// ════════════════════════════════════════════════════════════════════
//  PARENTS SERVICE
// ════════════════════════════════════════════════════════════════════

export const parentsService = {
  getAll:   () => request('/parents',       {}, true),
  getCount: () => request('/parents/count', {}, true),
};

// ════════════════════════════════════════════════════════════════════
//  BROADCAST SERVICE
// ════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} BroadcastPayload
 * @property {string}  subject
 * @property {string}  body
 * @property {string}  segment       - 'all'|'grade_10'|'grade_11'|'bachillerato'|'primaria'
 * @property {string}  template      - 'urgent'|'meeting'|'academic'|'enrollment'|'alert'|'blank'
 * @property {string}  [scheduled_at]- ISO 8601; omitir para envío inmediato
 *
 * @typedef {Object} BroadcastResult
 * @property {number} sent
 * @property {number} failed
 * @property {string} sent_at
 */

export const broadcastService = {
  /**
   * PROTEGIDO — requiere token.
   * POST /broadcast
   * Content-Type: application/json
   *
   * Payload: BroadcastPayload
   * Respuesta: BroadcastResult
   */
  send: (payload) =>
    request('/broadcast', { method: 'POST', body: JSON.stringify(payload) }, true),

  /**
   * PROTEGIDO — requiere token.
   * GET /broadcast/history
   * Respuesta: BroadcastRecord[]
   */
  getHistory: () => request('/broadcast/history', {}, true),
};

// ════════════════════════════════════════════════════════════════════
//  STATS SERVICE
// ════════════════════════════════════════════════════════════════════

export const statsService = {
  /** PROTEGIDO. GET /stats → { total_posts, total_parents, total_broadcasts } */
  get: () => request('/stats', {}, true),
};
