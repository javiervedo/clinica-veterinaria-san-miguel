# Seguridad, calidad y deuda técnica (MVP)

## 1. Objetivo y alcance
Este documento describe las medidas de **seguridad**, prácticas de **calidad** y principales puntos de **deuda técnica** identificados en el MVP del sistema de gestión de la Clínica Veterinaria “San Miguel”.

**Alcance MVP implementado**
- Autenticación basada en credenciales + **JWT**
- Autorización por **roles (RBAC)** con middlewares
- Rutas protegidas por módulo (administrativo vs clínico)
- Persistencia local con **SQLite** (por defecto) y alternativa conceptual con PostgreSQL
- Tests automatizados básicos para autenticación y middlewares

---

## 2. Autenticación y autorización (JWT + RBAC)

### 2.1. Login (emisión de token)
- **Endpoint:** `POST /api/auth/login`
- **Body:**
  - `email` (string, requerido)
  - `password` (string, requerido)
- **Respuesta (200):**
  - `token` (JWT)
  - `user`: `{ id, nombre, email, rol }`

**Comportamiento**
- Credenciales válidas → `200`
- Credenciales inválidas → `401`
- Campos incompletos → `400`

> Nota: el login no expone en ningún caso `password_hash`.

---

### 2.2. Uso del token (Bearer)
Para consumir endpoints protegidos:
- Header: `Authorization: Bearer <token>`

**Respuestas esperadas**
- Sin cabecera → `401`
- Token inválido/expirado → `401`
- Token válido, rol no permitido → `403`
- Token válido, rol permitido → `200`

---

### 2.3. Middleware de autenticación
- **Fichero:** `src/backend/src/middlewares/auth.js`
- **Responsabilidad:**
  - Verifica firma y expiración del JWT usando `JWT_SECRET`
  - Inyecta `req.user` con claims mínimos: `{ id, email, rol, nombre }`
- **Errores:**
  - JWT ausente o inválido → `401`

---

### 2.4. Middleware de autorización por rol (RBAC)
- **Fichero:** `src/backend/src/middlewares/role.js`
- **Responsabilidad:**
  - Restringe acceso a un conjunto de roles permitido por endpoint
- **Roles contemplados en el MVP:**
  - `admin`
  - `veterinario`
  - `auxiliar`
  - `administrativo`

---

## 3. Matriz de permisos (MVP) y separación “administrativo vs clínico”

### 3.1. Principio aplicado
Se aplica **mínimo privilegio** y segregación de información:
- El rol **administrativo** puede operar sobre agenda y datos administrativos (propietarios/mascotas/citas).
- El acceso a **historial clínico** y módulos clínicos queda restringido a roles clínicos (`admin`, `veterinario`, `auxiliar`).

### 3.2. Rutas protegidas (resumen)
- `/api/auth/*` → login público (con validación) y utilidades relacionadas
- `/api/propietarios` → protegido (administrativo incluido según reglas)
- `/api/mascotas` → protegido (administrativo incluido en CRUD general)
- `/api/mascotas/:id/historial` → **NO permitido** para `administrativo`
- `/api/citas` → protegido (administrativo incluido)
- `/api/episodios` → protegido (solo roles clínicos)
- `/api/tratamientos` → protegido (solo roles clínicos)
- `/api/recordatorios` → protegido (solo roles clínicos)

> Esta separación responde directamente al requisito de confidencialidad: el personal no clínico no debe acceder a diagnósticos, tratamientos o notas clínicas.

---

## 4. Gestión de secretos y configuración
Variables de entorno principales (backend):
- `JWT_SECRET` (**obligatoria**): clave para firmar/verificar JWT
- `JWT_EXPIRES_IN` (opcional): expiración del token (por defecto `8h`)
- `DB_CLIENT`: `sqlite` (recomendado en local) o `pg`
- `SQLITE_FILE`: ruta al fichero SQLite (por defecto `./data/clinica.sqlite`)

Buenas prácticas aplicadas:
- El fichero `.env` no debe subirse al repositorio (se proporciona `.env.example`).
- Las claves y configuración sensible se inyectan en runtime (no hardcode).

---

## 5. Usuarios demo y seguridad en entornos locales
Para facilitar evaluación sin modificar seeds, existe un script idempotente que inserta usuarios de demo en SQLite:

- `src/backend/scripts/sqlite-add-demo-users.js`
- Uso: `node scripts/sqlite-add-demo-users.js`

**Usuarios demo**
- ADMIN: `admin@sanmiguel.com / admin123`
- VETERINARIO: `vet@sanmiguel.com / vet123`
- AUXILIAR: `aux@sanmiguel.com / aux123`
- ADMINISTRATIVO: `admini@sanmiguel.com / admini123`

> Nota: estas credenciales son **solo para entorno académico/local**.

---

## 6. Recomendaciones de seguridad para producción (no MVP)
- **HTTPS obligatorio** (evitar exposición del token en tránsito).
- **Rotación** y almacenamiento seguro de `JWT_SECRET` (vault/secret manager).
- **Rate limiting** en `POST /api/auth/login` y bloqueo temporal por intentos (mitigación fuerza bruta).
- Considerar **refresh tokens** si se requiere sesión prolongada con mayor control de revocación.
- Auditoría de accesos a historial clínico (logs con usuario/rol/acción/marca temporal).
- Hardening de cabeceras (helmet), CORS restringido por entorno y lista de orígenes.

---

## 7. Calidad (estado actual)
- Arquitectura modular backend (routes/controllers/services/repositories).
- Separación de responsabilidades y testabilidad.
- Tests automatizados presentes para:
  - login (`/api/auth/login`)
  - middlewares `auth` y `role`

Comandos:
- `cd src/backend && npm test`

---

## 8. Deuda técnica identificada (y racional)
1. **Cobertura de tests limitada** a auth/middlewares y flujos mínimos.  
   - Próximo paso: tests de integración por módulo (CRUD + RBAC) y E2E para frontend.
2. **Auditoría avanzada** no implementada (quién accede a historial clínico).  
   - Próximo paso: logs estructurados + trazabilidad por request.
3. **Validación por esquema** (p.ej. Zod/Joi) no homogénea.  
   - Próximo paso: normalizar validación de entrada y respuestas de error.
4. **Dependencias (npm audit)**: posibles vulnerabilidades en transitivas (ej. `tar` vía `@mapbox/node-pre-gyp`).  
   - Decisión MVP: evitar `npm audit fix --force` para no introducir breaking changes.
5. **Gestión de usuarios desde UI** no implementada (altas/bajas/roles).  
   - Próximo paso: módulo de administración de usuarios y políticas de contraseña.
