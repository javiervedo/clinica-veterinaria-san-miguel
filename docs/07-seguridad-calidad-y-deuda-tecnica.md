# Seguridad, calidad y deuda técnica

## Autenticación y autorización (JWT + RBAC)

### Login (emisión de token)
- Endpoint: `POST /api/auth/login`
- Body:
  - `email` (string)
  - `password` (string)
- Respuesta (200):
  - `token` (JWT)
  - `user`: `{ id, nombre, email, rol }`

### Uso del token (Bearer)
Para acceder a endpoints protegidos, se debe enviar:
- Header: `Authorization: Bearer <token>`

### Middleware de autenticación
- `src/backend/src/middlewares/auth.js`
- Valida firma y expiración del JWT con `JWT_SECRET`
- Inyecta en `req.user`: `{ id, email, rol, nombre }`

### Middleware de autorización por rol (RBAC)
- `src/backend/src/middlewares/role.js`
- Permite restringir acceso por roles:
  - `admin`
  - `veterinario`
  - `auxiliar`

### Mapa de permisos (MVP)
Regla general aplicada:
- Lecturas (GET): `admin`, `veterinario`, `auxiliar`
- Escrituras clínicas (episodios/tratamientos - POST): `admin`, `veterinario`
- Altas/modificaciones administrativas (propietarios/mascotas/recordatorios - POST/PUT): `admin`, `auxiliar`
- Borrado (DELETE): solo `admin`

Rutas protegidas:
- `/api/propietarios`
- `/api/mascotas` (incluye `/api/mascotas/:id/historial`)
- `/api/citas`
- `/api/episodios`
- `/api/tratamientos`
- `/api/recordatorios`

### Variables de entorno
- `JWT_SECRET` (obligatoria): clave de firmado/verificación
- `JWT_EXPIRES_IN` (opcional): expiración del token (por defecto `8h`)

### Recomendaciones (producción)
- Usar HTTPS siempre (evitar exposición del token en tránsito).
- Rotación y almacenamiento seguro de `JWT_SECRET`.
- Añadir rate limiting en `/api/auth/login` para mitigar fuerza bruta.
- Considerar refresh tokens si se requiere sesión prolongada con mayor seguridad.
- Auditar accesos (logs) para trazabilidad (quién consulta/modifica información clínica).

## Confidencialidad y minimización
- Respuestas de login no devuelven `password_hash`.
- El token solo contiene información mínima (id, email, rol, nombre).

## Calidad y deuda técnica (notas)
- Tests unitarios añadidos para `auth` y `role`, y tests básicos para `/api/auth/login`.
- Mejora pendiente recomendada: tests end-to-end con base de datos (o testcontainers/docker-compose).
- Mejora pendiente recomendada: validación de entrada (schema validation) para endpoints.

## Seguridad

- autenticación con credenciales
- autorización por rol
- uso de variables de entorno
- validación de entradas
- protección frente a errores comunes
- futura activación de HTTPS en despliegue

## Calidad

- estructura modular
- pruebas automatizadas
- separación de responsabilidades
- posibilidad de integración continua

## Deuda técnica identificada

- frontend aún no implementado
- notificaciones reales pendientes
- informes avanzados pendientes
- gestión documental adjunta pendiente
- **Dependencias (npm audit)**: existen vulnerabilidades de severidad alta en dependencias transitivas de `bcrypt` (vía `@mapbox/node-pre-gyp` -> `tar`).  
  - Fix propuesto por npm: `npm audit fix --force` (sube `bcrypt` a v6, *breaking change*).  
  - Decisión en MVP: **no aplicar** el fix automático con `--force` para evitar roturas; se deja como deuda técnica planificada.
