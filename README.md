# Sistema de Gestión de Cursos y Portal Académico

Proyecto integral desarrollado como evaluación para el ciclo de Programación Web Avanzada. Consiste en una plataforma modular que incluye un panel de administración, un backend robusto con API REST y autenticación segura, un catálogo público y un portal para estudiantes.

---

## Tecnologías Utilizadas

* **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT (JSON Web Tokens).
* **Frontend / Panel Administrativo:** Angular, Bootstrap 5.
* **Herramientas de Pruebas:** Postman.

---

## Estructura del Proyecto

El repositorio está organizado en los siguientes módulos principales:

```text
Gestion_de_Cursos/
│
├── backend/                # API REST, modelos de datos, rutas y controladores (Node.js)
├── admin-panel/            # Panel de administración (Angular / Frontend)
├── catalogo-publico/       # Vista pública de cursos disponibles
└── portal-estudiante/      # Interfaz orientada al estudiante


---
```
# Instalación y Ejecución Local
## 1. Clonar el repositorio
```
git clone [https://github.com/GeraKTT/gestion-cursos-final.git](https://github.com/GeraKTT/gestion-cursos-final.git)
cd Gestion_de_Cursos
```
## 2. Configurar y ejecutar el Backend
### 1. Entra a la carpeta del backend:
```
cd backend
```
### 2. Instala las dependencias necesarias:
```
npm install
```
### 3. Crea un archivo .env en la raíz de la carpeta backend basándote en el archivo de ejemplo (.env.example) y configura tus variables de entorno:
```
PORT=3000
MONGO_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
```
### 4. Inicia el servidor backend:
```
npm run dev
```

## 3. Ejecutar el Panel Administrativo (Frontend)
### 1. Abre otra terminal y dirígete a la carpeta del panel:
```
cd admin-panel
```
### 2. Instala las dependencias:
```
npm install
```
### 3. Inicia la aplicación de Angular:
```
ng serve
```
# Endpoints Principales de la API
- Autenticación: POST /api/auth/login (Generación de token JWT para acceso autorizado).

- Cursos: GET /api/courses (Listar cursos) / POST /api/courses (Crear curso protegido por token).

- Profesores: Gestión y asignación de docentes a cargo de los módulos.
