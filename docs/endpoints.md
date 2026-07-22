# Endpoints de la API REST

Base URL: `https://gestion-cursos-final.onrender.com/api`

## Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Registrar nuevo usuario |
| POST | `/auth/login` | No | Iniciar sesión, devuelve JWT |

### POST /auth/register
```json
// Request
{ "nombre": "Juan Pérez", "email": "juan@isil.pe", "password": "123456", "rol": "estudiante" }
// Response 201
{ "message": "Usuario registrado exitosamente" }
```

### POST /auth/login
```json
// Request
{ "email": "admin@isil.pe", "password": "admin123" }
// Response 200
{ "token": "jwt...", "user": { "id": "...", "nombre": "...", "email": "...", "rol": "administrador" } }
```

## Cursos

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/courses` | No | Listar cursos (con búsqueda ?search=) |
| GET | `/courses/:id` | No | Detalle de curso |
| POST | `/courses` | Admin | Crear curso |
| PUT | `/courses/:id` | Admin | Actualizar curso |
| DELETE | `/courses/:id` | Admin | Eliminar curso |
| POST | `/courses/:id/enroll` | Estudiante | Inscribirse a curso |
| GET | `/courses/student/my-enrollments` | Estudiante | Mis inscripciones |

## Profesores

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/profesores` | No | Listar profesores |
| GET | `/profesores/:id` | No | Detalle de profesor |
| POST | `/profesores` | Admin | Crear profesor |
| PUT | `/profesores/:id` | Admin | Actualizar profesor |
| DELETE | `/profesores/:id` | Admin | Eliminar profesor |

## Health Check

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/health` | No | Estado del servidor |
