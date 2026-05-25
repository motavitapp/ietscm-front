/**
 * pages/DashboardPage.jsx
 *
 * Cambios UI aplicados (Tarea 1):
 *  ✓ Sidebar: solo Dashboard, Publicaciones, Difusión Masiva, Padres de Familia
 *    (implementado en DashboardSidebar.jsx)
 *  ✓ Stat-cards: solo Publicaciones, Padres Registrados, Correos Enviados
 *    (se eliminó "Visitas Hoy")
 */

import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { statsService } from '@/services/api';
import { usePosts } from '@/hooks/usePosts';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import StatCard         from '@/components/ui/StatCard';
import PostsTable       from '@/components/posts/PostsTable';
import DifusionModule   from '@/components/difusion/DifusionModule';
import styles from './DashboardPage.module.css';

// ── Vistas internas ──────────────────────────────────────────────────

function OverviewPane({ stats }) {
  return (
    <>
      {/* Stat-cards — solo 3 (Tarea 1: eliminado "Visitas Hoy") */}
      <div className={styles.statsRow}>
        <StatCard
          icon="📝"
          label="Publicaciones"
          value={stats?.total_posts ?? '—'}
          sub="↑ 3 este mes"
          variant="green"
        />
        <StatCard
          icon="👨‍👩‍👧"
          label="Padres Registrados"
          value={stats?.total_parents ?? '—'}
          sub="Activos en el sistema"
          variant="gold"
        />
        <StatCard
          icon="📨"
          label="Correos Enviados"
          value={stats?.total_broadcasts ?? '—'}
          sub="Difusiones este año"
          variant="red"
        />
      </div>

      <div className={styles.welcome}>
        <h3>Bienvenido al Panel de Administración</h3>
        <p>
          Desde aquí puede gestionar las publicaciones del sitio web institucional y
          enviar comunicados masivos a los padres de familia. Use el menú lateral
          para navegar entre los módulos.
        </p>
      </div>
    </>
  );
}

function PostsPane() {
  const { posts, loading, create, update, remove } = usePosts();
  return (
    <PostsTable
      posts={posts}
      loading={loading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  );
}

function ParentsPane() {
  return (
    <div className={styles.placeholder}>
      <span>👥</span>
      <p>Módulo de Padres de Familia</p>
      <small>Listado, búsqueda y gestión de correos de padres registrados.<br />
        Conectar con el endpoint <code>GET /api/v1/parents</code></small>
    </div>
  );
}

// ── Página principal del Dashboard ──────────────────────────────────

const SECTION_TITLES = {
  '/dashboard':          'Dashboard',
  '/dashboard/posts':    'Módulo de Publicaciones',
  '/dashboard/difusion': 'Módulo de Difusión Masiva',
  '/dashboard/parents':  'Padres de Familia',
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    statsService.get().then(setStats).catch(() => {});
  }, []);

  return (
    <div className={styles.layout}>
      <DashboardSidebar />

      <div className={styles.main}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <h2>Panel de Administración</h2>
          <div className={styles.topbarActions}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/dashboard/difusion')}
            >
              📨 Nueva Difusión
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/dashboard/posts')}
            >
              + Nueva Publicación
            </button>
          </div>
        </div>

        {/* Content area — sub-routes */}
        <div className={styles.content}>
          <Routes>
            <Route index                  element={<OverviewPane stats={stats} />} />
            <Route path="posts"           element={<PostsPane />} />
            <Route path="difusion"        element={<DifusionModule />} />
            <Route path="parents"         element={<ParentsPane />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
