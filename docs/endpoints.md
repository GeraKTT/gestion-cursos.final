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
| GET | `/courses` | No | Listar cursos (con búsqueda `?search=`) |
| GET | `/courses/:id` | No | Detalle de curso |
| POST | `/courses` | Admin | Crear curso |
| PUT | `/courses/:id` | Admin | Actualizar curso |
| DELETE | `/courses/:id` | Admin | Eliminar curso |
| POST | `/courses/:id/enroll` | Estudiante | Inscribirse a curso |
| GET | `/courses/student/my-enrollments` | Estudiante | Mis inscripciones |

### GET /courses
```json
// Response 200
[{ "_id": "...", "titulo": "Álgebra Lineal", "descripcion": "...", "profesor": { "_id": "...", "nombre": "Carlos Mendoza", "especialidad": "Matemáticas" }, "estudiantes": ["..."], "createdAt": "...", "updatedAt": "..." }]
```

### GET /courses?search=python
```json
// Response 200 — filtra cursos por título
[{ "_id": "...", "titulo": "Programación en Python", ... }]
```

### POST /courses (Admin)
```json
// Request
{ "titulo": "Nuevo Curso", "descripcion": "Descripción del curso", "profesor": "ID_DEL_PROFESOR" }
// Response 201
{ "_id": "...", "titulo": "Nuevo Curso", "descripcion": "...", "profesor": "ID_DEL_PROFESOR", "estudiantes": [] }
```

### POST /courses/:id/enroll (Estudiante)
```json
// Request (body vacío, usa token JWT)
// Response 200
{ "message": "Inscripción exitosa" }
```

### GET /courses/student/my-enrollments (Estudiante)
```json
// Response 200
[{ "_id": "...", "titulo": "Álgebra Lineal", "profesor": { "nombre": "Carlos Mendoza" }, ... }]
```

## Profesores

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/profesores` | No | Listar profesores |
| GET | `/profesores/:id` | No | Detalle de profesor |
| POST | `/profesores` | Admin | Crear profesor |
| PUT | `/profesores/:id` | Admin | Actualizar profesor |
| DELETE | `/profesores/:id` | Admin | Eliminar profesor |

### GET /profesores
```json
// Response 200
[{ "_id": "...", "nombre": "Carlos Mendoza", "especialidad": "Matemáticas", "correo": "carlos@isil.pe" }]
```

### POST /profesores (Admin)
```json
// Request
{ "nombre": "Nuevo Profesor", "especialidad": "Redes", "correo": "profesor@isil.pe" }
// Response 201
{ "_id": "...", "nombre": "Nuevo Profesor", "especialidad": "Redes", "correo": "profesor@isil.pe" }
```

## Health Check

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/health` | No | Estado del servidor |

```json
// Response 200
{ "status": "ok", "timestamp": "2026-07-22T06:00:00.000Z" }
```
