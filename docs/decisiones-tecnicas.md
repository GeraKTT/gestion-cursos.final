# Decisiones Técnicas

## Arquitectura Monorepo
Se optó por un monorepo para facilitar la gestión del código y el despliegue. Cada
módulo (backend, admin-panel, catalogo-publico, portal-estudiante) está en su propia
carpeta con su propio package.json.

## Angular 21 Standalone Components
Se usaron standalone components (sin NgModules) para alinearse con las prácticas
modernas de Angular. Esto elimina la complejidad de los módulos y facilita el
lazy loading.

## Next.js App Router con SSR
El catálogo público usa Server-Side Rendering (SSR) porque los datos de cursos
cambian dinámicamente con cada inscripción. Se usó `cache: 'no-store'` para
garantizar datos siempre frescos.

## React 19 con Create React App
El portal del estudiante usa CRA por su configuración zero. El estado global
se maneja con Context API (sin dependencias externas como Redux) dado que el
alcance del estado compartido es limitado (solo autenticación).

## Context API vs Redux
Se eligió Context API sobre Redux porque:
- El estado global es solo autenticación (user + token)
- Menos boilerplate
- Sin dependencias adicionales
- Suficiente para 2 componentes

## Autenticación JWT
Se almacena el token en localStorage con expiry de 2 horas. En producción se
recomienda usar HttpOnly cookies para mayor seguridad contra XSS.

## Bootstrap 5
Se usó Bootstrap en los 3 frontends por consistencia visual y velocidad de
desarrollo. Next.js usa Tailwind CSS adicionalmente.
