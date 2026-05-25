# I.E. Técnica Santa Cruz de Motavita — Plataforma Web de Información

Frontend modular construido con **React 18 + Vite + CSS Modules**.

### Variables de entorno

Crear `.env.local` en la raíz del proyecto:

```env
# URL base del backend FastAPI (en producción reemplazar por la URL real)
VITE_API_URL=http://localhost:8000
```

---

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar servidor de desarrollo
npm run dev
# → http://localhost:5173

# 3. Build para producción
npm run build
```

---

## Tecnologías

| Tecnología | Versión | Rol |
|------------|---------|-----|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool + dev server |
| React Router DOM | 6.26 | Enrutamiento SPA |
| CSS Modules | — | Estilos encapsulados por componente |
