# Sistema de Gestión de Cursos y Portal Académico

Proyecto integral desarrollado como evaluación para el curso de Programación Web Avanzada (ISIL). Consiste en una plataforma modular con panel administrativo, catálogo público, portal del estudiante y API REST.

---

## Problema
Las instituciones educativas necesitan una plataforma centralizada que permita a los estudiantes consultar cursos, inscribirse y visualizar sus inscripciones, mientras que los administradores gestionan la información académica.

## Objetivos
- Proveer autenticación segura con JWT y roles (administrador/estudiante)
- Facilitar la inscripción y consulta de cursos
- Centralizar la gestión de cursos y profesores
- Desplegar la solución en la nube con escalabilidad

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt |
| Admin Panel | Angular 21, Bootstrap 5, TypeScript |
| Catálogo Público | Next.js 16 (SSR), TypeScript, Tailwind CSS |
| Portal Estudiante | React 19, React Router, Context API, Bootstrap 5 |
| Seguridad | Helmet, CORS, JWT, bcrypt, Auth Guards |
| Despliegue | Vercel (frontends), Render (backend), MongoDB Atlas |

---

## Arquitectura

Visitar [docs/arquitectura.md](docs/arquitectura.md) para el diagrama completo.

---

## URLs Desplegadas

| Aplicación | URL |
|---|---|
| Admin Panel (Angular) | https://admin-panel-xi-plum.vercel.app |
| Catálogo Público (Next.js) | https://catalogo-publico-phi.vercel.app |
| Portal Estudiante (React) | https://portal-estudiante.vercel.app |
| Backend API (Express) | https://gestion-cursos-final.onrender.com |
| Health Check | https://gestion-cursos-final.onrender.com/api/health |

---

## Credenciales de Prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@isil.pe | admin123 |
| Estudiante | estudiante@isil.pe | estudiante123 |

---

## Instalación Local

### 1. Clonar e instalar backend
```bash
git clone https://github.com/GeraKTT/gestion-cursos-final.git
cd gestion-cursos-final/backend
npm install
cp .env.example .env  # Configurar MONGO_URI y JWT_SECRET
npm run dev
```

### 2. Admin Panel (Angular)
```bash
cd admin-panel
npm install
ng serve  # http://localhost:4200
```

### 3. Catálogo Público (Next.js)
```bash
cd catalogo-publico
npm install
npm run dev  # http://localhost:3002
```

### 4. Portal Estudiante (React)
```bash
cd portal-estudiante
npm install
npm start  # http://localhost:3001
```

---

## Variables de Entorno

Ver `.env.example` en cada módulo:

| Módulo | Variable | Descripción |
|---|---|---|
| backend | `MONGO_URI` | Cadena de conexión MongoDB Atlas |
| backend | `JWT_SECRET` | Clave secreta para firmar tokens |
| backend | `FRONTEND_URL` | URL del frontend desplegado para CORS |
| catalogo-publico | `API_URL` | URL base de la API |
| portal-estudiante | `REACT_APP_API_URL` | URL base de la API |
| admin-panel | `ANGULAR_API_URL` | URL base de la API (en environment.ts) |

---

## Endpoints Principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/courses` | Listar cursos (?search=) |
| GET | `/api/courses/:id` | Detalle de curso |
| POST | `/api/courses` | Crear curso (admin) |
| POST | `/api/courses/:id/enroll` | Inscribirse (estudiante) |
| GET | `/api/courses/student/my-enrollments` | Mis inscripciones |
| GET/POST/PUT/DELETE | `/api/profesores` | CRUD profesores (admin) |

Ver [docs/endpoints.md](docs/endpoints.md) para la documentación completa.

---

## Integrantes

| Nombre | Rol |
|---|---|
| Geraldine Tudela | Backend + Angular |
| [Nombre 2] | React + Context API |
| [Nombre 3] | Next.js + Despliegue |
| [Nombre 4] | Documentación + Seguridad |

---

## Video de Sustentación

[Enlace de YouTube](https://youtube.com) (12-15 min, no listado)

---

## Capturas

*(Agregar capturas de las aplicaciones desplegadas)*

---

## Licencia

Proyecto académico - ISIL 2026
