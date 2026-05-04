# Historias de usuario (MVP) – Clínica Veterinaria San Miguel

## 1. Propósito del documento
Este documento describe las **Historias de Usuario (HU)** que cubren el **MVP** implementado del sistema de gestión interno de la Clínica Veterinaria “San Miguel”.

El sistema está orientado a **uso interno** y contempla control de acceso mediante **JWT** y **roles** (RBAC), además de módulos de gestión administrativa y clínica.

## 2. Roles del sistema
- **ADMIN** (`admin`): acceso total (administrativo + clínico).
- **VETERINARIO** (`veterinario`): acceso a módulos clínicos y operativos.
- **AUXILIAR** (`auxiliar`): lectura + registro básico según permisos.
- **ADMINISTRATIVO** (`administrativo`): gestión de agenda y datos administrativos (**sin acceso a historial clínico**).

## 3. Épicas (visión de alto nivel)
- **EP-01 Autenticación y control de acceso (JWT + RBAC)**
- **EP-02 Gestión administrativa (Propietarios / Mascotas / Citas)**
- **EP-03 Gestión clínica (Episodios / Historial / Tratamientos)**
- **EP-04 Seguimiento y recordatorios**
- **EP-05 Operación, auditoría básica y calidad** (tests, errores, criterios de seguridad)

---

## EP-01 Autenticación y control de acceso (JWT + RBAC)

### HU-01 – Iniciar sesión (login) y obtener token JWT
**Como** usuario autorizado (admin/veterinario/auxiliar/administrativo)  
**quiero** iniciar sesión con email y contraseña  
**para** acceder al sistema según mi rol.

**Criterios de aceptación (Gherkin)**
- **Dado** un usuario registrado **cuando** envía credenciales válidas a `POST /api/auth/login` **entonces** recibe `200` con `{ token, user }`.
- **Dado** un usuario **cuando** envía credenciales inválidas **entonces** recibe `401`.
- **Dado** un usuario **cuando** omite `email` o `password` **entonces** recibe `400`.

**Prioridad:** Must  
**Tamaño:** S  
**Dependencias:** ninguna  
**Notas seguridad/privacidad:** no se devuelve `password_hash`; el token contiene solo claims mínimos (id, email, rol, nombre).

---

### HU-02 – Acceder a rutas protegidas con Bearer Token
**Como** usuario autenticado  
**quiero** usar el token JWT en la cabecera `Authorization`  
**para** consumir endpoints protegidos de la API.

**Criterios de aceptación**
- **Dado** un endpoint protegido **cuando** no se envía cabecera `Authorization` **entonces** devuelve `401`.
- **Dado** un token inválido o expirado **cuando** se intenta acceder a un endpoint protegido **entonces** devuelve `401`.
- **Dado** un token válido **cuando** se accede a un endpoint protegido permitido por rol **entonces** devuelve `200`.

**Prioridad:** Must  
**Tamaño:** S  
**Dependencias:** HU-01  
**Notas:** middleware `auth` valida firma/expiración e inyecta `req.user`.

---

### HU-03 – Restricción por rol (RBAC) en endpoints
**Como** responsable de la clínica (dirección)  
**quiero** que el acceso a cada módulo esté limitado por rol  
**para** proteger la confidencialidad y evitar acciones no autorizadas.

**Criterios de aceptación**
- **Dado** un token válido **cuando** el rol no está permitido por el endpoint **entonces** devuelve `403`.
- **Dado** un endpoint configurado para `admin|veterinario|auxiliar` **cuando** accede un `administrativo` **entonces** recibe `403`.
- **Dado** un endpoint configurado para `admin|administrativo` **cuando** accede un `administrativo` **entonces** recibe `200`.

**Prioridad:** Must  
**Tamaño:** M  
**Dependencias:** HU-02  
**Notas seguridad:** se aplica el principio de mínimo privilegio y separación “administrativo vs clínico”.

---

## EP-02 Gestión administrativa (Propietarios / Mascotas / Citas)

### HU-04 – Alta de propietario
**Como** personal administrativo  
**quiero** registrar un propietario  
**para** asociarle mascotas y poder gestionar citas y comunicaciones.

**Criterios de aceptación**
- **Dado** que estoy autenticado con rol `admin` o `administrativo` (y según reglas de escritura definidas) **cuando** creo un propietario **entonces** el propietario queda persistido y visible en el listado.
- **Dado** un alta **cuando** faltan campos requeridos **entonces** el sistema rechaza la operación con error de validación.
- **Dado** un propietario existente **cuando** intento crear otro con el mismo identificador (si aplica) **entonces** el sistema evita duplicidades según reglas de negocio.

**Prioridad:** Must  
**Tamaño:** M  
**Dependencias:** HU-02

---

### HU-05 – Consultar y listar propietarios
**Como** personal administrativo o clínico  
**quiero** consultar el listado y detalle de propietarios  
**para** localizar rápidamente información de contacto y sus mascotas.

**Criterios de aceptación**
- **Dado** un usuario autenticado **cuando** consulta propietarios **entonces** obtiene el listado de propietarios.
- **Dado** un usuario no autenticado **cuando** consulta propietarios **entonces** recibe `401`.
- **Dado** un rol permitido **cuando** consulta un propietario por id **entonces** obtiene el detalle o `404` si no existe.

**Prioridad:** Must  
**Tamaño:** S  
**Dependencias:** HU-02

---

### HU-06 – Alta de mascota asociada a propietario
**Como** personal administrativo  
**quiero** registrar una mascota asociada a un propietario  
**para** centralizar los datos del paciente.

**Criterios de aceptación**
- **Dado** un propietario existente **cuando** registro una mascota con `propietario_id` **entonces** se crea correctamente.
- **Dado** que no existe el propietario **cuando** intento crear una mascota **entonces** el sistema rechaza la operación.
- **Dado** que estoy autenticado como `administrativo` **cuando** creo/actualizo una mascota **entonces** la operación está permitida en el módulo administrativo.

**Prioridad:** Must  
**Tamaño:** M  
**Dependencias:** HU-04

---

### HU-07 – Consultar historial administrativo de una mascota (datos generales)
**Como** personal administrativo  
**quiero** ver los datos generales de la mascota (identificación y propietario)  
**para** gestionar citas y comunicaciones sin acceder a información clínica sensible.

**Criterios de aceptación**
- **Dado** un usuario `administrativo` autenticado **cuando** consulta `GET /api/mascotas/:id` **entonces** obtiene datos generales.
- **Dado** un usuario `administrativo` **cuando** intenta acceder a `GET /api/mascotas/:id/historial` **entonces** recibe `403`.
- **Dado** un usuario no autenticado **cuando** consulta mascotas **entonces** recibe `401`.

**Prioridad:** Must  
**Tamaño:** S  
**Dependencias:** HU-02

---

### HU-08 – Crear cita (gestión de agenda)
**Como** personal administrativo  
**quiero** crear una cita para una mascota  
**para** organizar la agenda de la clínica.

**Criterios de aceptación**
- **Dado** una mascota existente **cuando** creo una cita con fecha y motivo **entonces** la cita queda registrada.
- **Dado** una regla de negocio de solape **cuando** intento crear una cita incompatible **entonces** el sistema lo impide (error).
- **Dado** que estoy autenticado como `administrativo` **cuando** creo/actualizo una cita **entonces** está permitido.

**Prioridad:** Must  
**Tamaño:** M  
**Dependencias:** HU-06

---

### HU-09 – Consultar citas por fecha/estado
**Como** personal administrativo o veterinario  
**quiero** ver las citas planificadas y su estado  
**para** coordinar la atención diaria y el trabajo del equipo.

**Criterios de aceptación**
- **Dado** un usuario autenticado **cuando** consulta citas **entonces** obtiene resultados con filtros disponibles (si aplica).
- **Dado** una cita inexistente **cuando** se solicita por id **entonces** devuelve `404`.
- **Dado** un usuario no autenticado **cuando** consulta citas **entonces** recibe `401`.

**Prioridad:** Should  
**Tamaño:** M  
**Dependencias:** HU-02

---

## EP-03 Gestión clínica (Episodios / Historial / Tratamientos)

### HU-10 – Consultar historial clínico completo de una mascota
**Como** veterinario o auxiliar (o admin)  
**quiero** consultar el historial clínico completo de una mascota  
**para** atenderla con información completa y trazable.

**Criterios de aceptación**
- **Dado** un rol clínico (`admin|veterinario|auxiliar`) **cuando** consulta `GET /api/mascotas/:id/historial` **entonces** recibe episodios, tratamientos y observaciones disponibles.
- **Dado** un `administrativo` autenticado **cuando** consulta ese endpoint **entonces** recibe `403`.
- **Dado** una mascota inexistente **cuando** se consulta su historial **entonces** devuelve `404`.

**Prioridad:** Must  
**Tamaño:** M  
**Dependencias:** HU-02, HU-06  
**Notas seguridad:** historial clínico considerado dato sensible.

---

### HU-11 – Registrar episodio clínico (consulta)
**Como** veterinario  
**quiero** registrar un episodio clínico asociado a una mascota  
**para** dejar evidencia de diagnóstico, observaciones y seguimiento.

**Criterios de aceptación**
- **Dado** un veterinario autenticado **cuando** crea un episodio con campos obligatorios **entonces** el episodio queda registrado.
- **Dado** un usuario sin rol clínico **cuando** intenta crear episodios **entonces** recibe `403`.
- **Dado** una mascota inexistente **cuando** se intenta registrar un episodio **entonces** se rechaza con error.

**Prioridad:** Must  
**Tamaño:** M  
**Dependencias:** HU-10

---

### HU-12 – Registrar tratamiento
**Como** veterinario  
**quiero** registrar un tratamiento (medicamento, dosis, frecuencia, fechas)  
**para** controlar la pauta y el seguimiento del paciente.

**Criterios de aceptación**
- **Dado** un rol clínico permitido **cuando** crea un tratamiento válido **entonces** queda persistido.
- **Dado** que faltan datos clave (medicamento/fechas) **cuando** se crea un tratamiento **entonces** se rechaza.
- **Dado** un usuario `administrativo` **cuando** intenta crear tratamientos **entonces** recibe `403`.

**Prioridad:** Must  
**Tamaño:** M  
**Dependencias:** HU-10

---

## EP-04 Seguimiento y recordatorios

### HU-13 – Consultar recordatorios pendientes
**Como** auxiliar o veterinario (o admin)  
**quiero** ver recordatorios pendientes por fecha y estado  
**para** planificar llamadas, revisiones y vacunaciones.

**Criterios de aceptación**
- **Dado** un usuario clínico (`admin|veterinario|auxiliar`) **cuando** lista recordatorios **entonces** ve recordatorios con `estado` y `fecha_objetivo`.
- **Dado** un usuario `administrativo` **cuando** intenta acceder a recordatorios **entonces** recibe `403`.
- **Dado** un usuario no autenticado **cuando** consulta recordatorios **entonces** recibe `401`.

**Prioridad:** Should  
**Tamaño:** S  
**Dependencias:** HU-02

---

### HU-14 – Crear y actualizar recordatorios de seguimiento
**Como** auxiliar (o admin)  
**quiero** crear/actualizar recordatorios (vacuna anual, revisión, etc.)  
**para** asegurar la continuidad asistencial.

**Criterios de aceptación**
- **Dado** un rol permitido **cuando** crea un recordatorio asociado a una mascota **entonces** queda registrado.
- **Dado** un recordatorio existente **cuando** se actualiza su estado a “completado” **entonces** queda reflejado en el sistema.
- **Dado** un rol no permitido **cuando** intenta modificar recordatorios **entonces** recibe `403`.

**Prioridad:** Should  
**Tamaño:** M  
**Dependencias:** HU-13

---

## EP-05 Operación, auditoría básica y calidad

### HU-15 – Gestionar errores de acceso de forma clara (401/403)
**Como** usuario final  
**quiero** recibir mensajes claros cuando no tengo permiso o no estoy logueado  
**para** entender qué debo hacer (iniciar sesión o solicitar permisos).

**Criterios de aceptación**
- **Dado** una petición sin token **cuando** ocurre un `401` **entonces** el frontend redirige a login o muestra mensaje claro.
- **Dado** una petición con rol no permitido **cuando** ocurre un `403` **entonces** se muestra pantalla de “Acceso no permitido”.
- **Dado** un error backend **cuando** ocurre un fallo no controlado **entonces** se devuelve un error manejable para el frontend.

**Prioridad:** Should  
**Tamaño:** S  
**Dependencias:** HU-02, HU-03

---

### HU-16 – Disponer de tests automatizados mínimos para autenticación y middlewares
**Como** equipo de desarrollo  
**quiero** tener tests automáticos para login/auth/roles  
**para** prevenir regresiones y asegurar el control de acceso.

**Criterios de aceptación**
- **Dado** el repo **cuando** ejecuto `npm test` en backend **entonces** pasan los tests de auth y middlewares.
- **Dado** cambios en RBAC **cuando** se ejecutan los tests **entonces** detectan respuestas 401/403 esperadas.
- **Dado** un pipeline o ejecución local **cuando** corren los tests **entonces** no requieren interacción manual.

**Prioridad:** Must  
**Tamaño:** S  
**Dependencias:** HU-01, HU-02, HU-03

---

## 4. Fuera de alcance (por ahora)
- Portal para clientes (autogestión de citas, comunicación directa).
- Pasarela de pagos y facturación avanzada.
- Adjuntos/documentos clínicos (informes, pruebas) y almacenamiento seguro.
- Auditoría avanzada (logs firmados, trazabilidad completa por operación).
- Notificaciones automáticas (SMS/Email/WhatsApp) integradas con proveedor externo.
- Reporting avanzado (KPIs, ingresos, cohortes, etc.).

## 5. Siguientes iteraciones (recomendadas)
- Gestión completa de usuarios desde UI (altas/bajas/cambio de rol) con permisos.
- Refuerzo de seguridad: rate limiting en login (si no está aplicado), bloqueo por intentos, refresh tokens.
- Validación de entrada por esquema (p.ej. Zod/Joi) y normalización de errores.
- Tests E2E (Playwright/Cypress) + pruebas con BD aislada para CI.
- Exportación de datos e informes básicos para dirección.
