# Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Atlas                           │
│            (gestion-cursos-1 database)                      │
│  Collections: users, courses, profesors                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ mongoose.connect()
                       ▼
┌──────────────────────────────────────────────────────────────┐
│              Backend (Node.js + Express)                      │
│  Render: gestion-cursos-final.onrender.com                 │
│                                                               │
│  Middlewares: helmet, cors, express.json                      │
│  Auth: JWT (2h), bcrypt, verifyToken, verifyRole             │
│                                                               │
│  /api/auth → register, login                                 │
│  /api/courses → CRUD + enroll + my-enrollments               │
│  /api/profesores → CRUD                                      │
│  /api/health → health check                                  │
└────┬─────────────────────┬───────────────────┬────────────────┘
     │                     │                   │
     │ HTTPS               │ HTTPS             │ HTTPS
     ▼                     ▼                   ▼
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ Angular  │     │   Next.js    │     │    React     │
│ Admin    │     │ Public       │     │ Student      │
│ Panel    │     │ Catalog      │     │ Portal       │
│          │     │              │     │              │
│ Vercel   │     │ Vercel       │     │ Vercel       │
│          │     │ (SSR)        │     │ (SPA)        │
│ /login   │     │ / → catalog  │     │ /login       │
│ /dashboard│    │ /cursos/[id] │     │ /dashboard   │
└──────────┘     └──────────────┘     └──────────────┘
```

## Estrategia de Renderizado (Next.js)
- Catálogo público (/) usa SSR con `cache: 'no-store'` para datos siempre frescos.
- Detalle de curso (/cursos/[id]) usa SSR generado dinámicamente.
- Estrategia: Server-Side Rendering (SSR) porque los datos cambian frecuentemente
  (inscripciones, nuevos cursos) y se necesita información actualizada.
