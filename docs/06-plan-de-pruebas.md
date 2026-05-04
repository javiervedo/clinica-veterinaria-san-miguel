# 06 – Plan de pruebas (MVP)

## 1. Objetivo
Validar que el MVP cumple:
- funcionalidad principal (CRUD por módulos)
- reglas de negocio clave (coherencia de citas, integridad de relaciones)
- **seguridad**: autenticación JWT + autorización por rol (RBAC)
- estabilidad mínima (no regresiones básicas)

Este plan cubre pruebas **unitarias**, de **integración API**, y una propuesta de pruebas **funcionales** para el frontend.

---

## 2. Alcance de pruebas
### Incluido (MVP)
- Autenticación: `POST /api/auth/login`
- Middlewares:
  - `auth` (JWT)
  - `role` (RBAC)
- Endpoints protegidos por módulo:
  - propietarios
  - mascotas (incluye historial clínico por endpoint dedicado)
  - citas
  - episodios
  - tratamientos
  - recordatorios

### Fuera de alcance (MVP)
- Pruebas E2E automatizadas de UI (propuesta para iteración futura)
- Pruebas de carga / estrés
- Auditoría avanzada (logs firmados, correlación completa)

---

## 3. Entorno de pruebas
- **Backend local:** `http://localhost:3001`
- **DB:** SQLite local (`src/backend/data/clinica.sqlite`)
- Inicialización:
  - `cd src/backend`
  - `node scripts/sqlite-init.js`
  - (opcional) `node scripts/sqlite-add-demo-users.js`

### Usuarios de prueba (roles)
- ADMIN: `admin@sanmiguel.com / admin123`
- VETERINARIO: `vet@sanmiguel.com / vet123`
- AUXILIAR: `aux@sanmiguel.com / aux123`
- ADMINISTRATIVO: `admini@sanmiguel.com / admini123`

---

## 4. Estrategia de pruebas
### 4.1 Unitarias
- Validación de funciones de servicio (reglas y errores esperados).
- Validación de middlewares (`auth`, `role`) ante tokens y roles.

### 4.2 Integración (API)
- Validar flujo request/response real contra Express.
- Verificar códigos HTTP y estructura de respuestas.
- Verificar RBAC por rol y endpoint (401/403).

### 4.3 Funcionales (manuales o semiautomáticas)
- Ejecución de flujos desde frontend:
  - login
  - navegación por módulos
  - alta y consulta de registros
  - verificación de pantallas de “Forbidden” y redirección a login

---

## 5. Casos de prueba (detallados)

## 5.1 Autenticación (login)
- **LOGIN-001**: credenciales válidas  
  **Dado** `{email,password}` correctos  
  **Cuando** `POST /api/auth/login`  
  **Entonces** `200` y devuelve `{ token, user }` (sin `password_hash`)

- **LOGIN-002**: campos incompletos  
  **Dado** falta `email` o `password`  
  **Cuando** se llama a login  
  **Entonces** `400`

- **LOGIN-003**: credenciales inválidas  
  **Dado** credenciales incorrectas  
  **Cuando** se llama a login  
  **Entonces** `401`

---

## 5.2 JWT – Middleware `auth`
- **AUTH-001**: acceso sin token  
  **Dado** endpoint protegido  
  **Cuando** no se envía `Authorization`  
  **Entonces** `401`

- **AUTH-002**: token inválido  
  **Dado** endpoint protegido  
  **Cuando** se envía `Authorization: Bearer <token_invalido>`  
  **Entonces** `401`

- **AUTH-003**: token válido  
  **Dado** token válido  
  **Cuando** se consulta un endpoint protegido  
  **Entonces** `200` y se dispone de `req.user` (id, email, rol, nombre)

---

## 5.3 RBAC – Middleware `role`
- **ROLE-001**: rol no permitido  
  **Dado** token válido  
  **Cuando** el rol no pertenece al conjunto permitido por el endpoint  
  **Entonces** `403`

- **ROLE-002**: rol permitido  
  **Dado** token válido  
  **Cuando** el rol está permitido por el endpoint  
  **Entonces** `200`

---

## 5.4 Validación de segregación administrativo vs clínico (casos críticos)
- **SEC-ADM-001**: administrativo puede gestionar propietarios  
  **Dado** token rol `administrativo`  
  **Cuando** `GET /api/propietarios` y operaciones de alta/edición (según endpoint)  
  **Entonces** respuesta `200/201` según corresponda

- **SEC-ADM-002**: administrativo NO accede a historial clínico  
  **Dado** token rol `administrativo`  
  **Cuando** `GET /api/mascotas/:id/historial`  
  **Entonces** `403`

- **SEC-ADM-003**: rol clínico accede a historial  
  **Dado** token `veterinario` o `auxiliar` o `admin`  
  **Cuando** `GET /api/mascotas/:id/historial`  
  **Entonces** `200`

- **SEC-ADM-004**: administrativo NO accede a módulos clínicos  
  **Dado** token rol `administrativo`  
  **Cuando** intenta `GET/POST /api/episodios` (o tratamientos/recordatorios)  
  **Entonces** `403`

---

## 5.5 Casos funcionales por módulo (API)
> Nota: los endpoints exactos pueden variar por implementación, pero el objetivo es validar CRUD + RBAC + integridad.

### PROPIETARIOS
- **PROP-001**: crear propietario (rol permitido) → `201`
- **PROP-002**: listar propietarios (rol permitido) → `200`
- **PROP-003**: actualizar propietario existente → `200`
- **PROP-004**: consultar propietario inexistente → `404`

### MASCOTAS
- **MAS-001**: crear mascota con `propietario_id` válido → `201`
- **MAS-002**: crear mascota con `propietario_id` inválido → error (validación/integridad)
- **MAS-003**: listar mascotas → `200`
- **MAS-004**: obtener mascota por id inexistente → `404`
- **MAS-005**: historial clínico (roles clínicos) → `200`
- **MAS-006**: historial clínico (administrativo) → `403`

### CITAS
- **CIT-001**: crear cita válida → `201`
- **CIT-002**: impedir cita solapada (si aplica regla) → error controlado
- **CIT-003**: listar citas → `200`
- **CIT-004**: actualizar estado de cita → `200`

### EPISODIOS
- **EPI-001**: crear episodio (rol clínico) → `201`
- **EPI-002**: crear episodio (administrativo) → `403`
- **EPI-003**: listar episodios (rol clínico) → `200`

### TRATAMIENTOS
- **TRA-001**: crear tratamiento (rol clínico) → `201`
- **TRA-002**: crear tratamiento (administrativo) → `403`
- **TRA-003**: listar tratamientos (rol clínico) → `200`

### RECORDATORIOS
- **REC-001**: crear recordatorio (rol clínico) → `201`
- **REC-002**: actualizar estado a completado (rol clínico) → `200`
- **REC-003**: listar pendientes → `200`
- **REC-004**: acceso por administrativo → `403`

---

## 6. Evidencias y criterios de salida
### Evidencias esperadas
- Capturas/outputs de requests (curl o Postman) para los casos críticos (401/403).
- Resultado de `npm test` (backend) en verde.
- Registro de incidencias encontradas y su resolución.

### Criterios de salida (Definition of Done de pruebas)
- 0 fallos críticos en login y RBAC.
- Los casos críticos de segregación administrativo vs clínico pasan.
- CRUD principal operativo sin errores de integridad.
- Suite mínima automatizada ejecutable por terceros.

---

## 7. Automatización existente y propuesta
### Existente (MVP)
- Jest + Supertest con tests de autenticación y middlewares.

### Propuesta (iteración siguiente)
- Tests de integración completos por módulo (CRUD + RBAC).
- Tests E2E (Playwright/Cypress) para flujos de usuario en frontend.
- Pipeline CI que ejecute tests con BD aislada.
