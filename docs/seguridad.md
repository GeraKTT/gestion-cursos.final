# Checklist de Seguridad

## Implementado

- [x] **Helmet**: Middleware que establece cabeceras HTTP de seguridad (X-Content-Type-Options, X-Frame-Options, etc.)
- [x] **CORS restringido**: Solo orígenes permitidos (localhost:4200, 3001, 3002, admin-panel-xi-plum.vercel.app, catalogo-publico-phi.vercel.app, portal-estudiante.vercel.app)
- [x] **JWT**: Tokens con expiry de 2 horas para autenticación
- [x] **bcrypt**: Passwords hasheados con 10 salt rounds
- [x] **Roles**: Middleware verifyRole para administrador/estudiante
- [x] **HTTPS**: Forzado por Vercel y Render en producción
- [x] **Variables de entorno**: MONGO_URI, JWT_SECRET, etc. no expuestas en el repo
- [x] **Limitación de payload**: express.json({ limit: '10kb' }) para evitar payloads grandes
- [x] **Validación de entrada**: Verificación de campos obligatorios en controladores
- [x] **Mensajes de error genéricos**: No se exponen detalles internos (ej: "Credenciales inválidas" vs "Usuario no encontrado")
- [x] **Protección de rutas frontend**: AuthGuard en Angular, PrivateRoute en React
- [x] **Sanitización**: express.json evita inyección de código

## Pendiente / Recomendaciones

- [ ] **express-rate-limit**: Implementar rate limiting para evitar ataques de fuerza bruta
- [ ] **express-mongo-sanitize**: Sanitizar inputs para NoSQL injection
- [ ] **CSRF**: Implementar tokens CSRF para formularios
- [ ] **XSS**: Agregar helmet.contentSecurityPolicy más restrictiva
- [ ] **Validación con express-validator**: Validaciones más robustas en el backend

## Reporte Lighthouse

Se realizó auditoría Lighthouse en la aplicación desplegada.
Resultados disponibles en `docs/lighthouse.pdf`.
