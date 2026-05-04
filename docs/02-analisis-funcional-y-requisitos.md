# Análisis funcional y requisitos (MVP)

## 1. Objetivo general
Modernizar y centralizar la gestión de información **clínica y administrativa** de la Clínica Veterinaria “San Miguel”, reduciendo errores y tiempos administrativos, y garantizando la **confidencialidad** de los datos.

El MVP entregado implementa una solución **cliente-servidor** (panel web + API) con control de acceso por roles y módulos de:
- propietarios
- mascotas
- citas
- episodios/historial clínico
- tratamientos
- recordatorios/seguimiento

---

## 2. Stakeholders
- **Dirección de la clínica**: busca eficiencia, control y capacidad de análisis.
- **Veterinarios**: necesitan acceso rápido al historial clínico y registrar episodios/tratamientos.
- **Auxiliares**: realizan soporte clínico, seguimiento y tareas operativas.
- **Administrativos**: gestionan agenda, propietarios, datos generales y coordinación.
- **Clientes**: reciben indirectamente mejor servicio (menos errores/olvidos, mejor coordinación).
- **Equipo de desarrollo**: mantiene y evoluciona el sistema.

---

## 3. Alcance del MVP (qué cubre)
### Funcional
- Autenticación por credenciales y emisión de **JWT**.
- Autorización por **roles** (RBAC) con rutas protegidas (401/403).
- CRUD de propietarios.
- CRUD de mascotas (incluye consulta de historial clínico para roles clínicos).
- CRUD de citas (gestión de agenda).
- CRUD de episodios clínicos.
- CRUD de tratamientos.
- CRUD/consulta de recordatorios.

### Técnico
- Backend Node.js/Express con arquitectura modular por capas.
- Persistencia local por defecto en **SQLite** (para ejecución simple).
- Tests automatizados básicos (Jest/Supertest) para login y middlewares.

---

## 4. Requisitos funcionales (RF)

### RF-01 Gestión de propietarios
**Descripción:** Alta, consulta, actualización, listado y (si aplica) borrado de propietarios.  
**Actores:** administrativo, admin; consulta también por roles clínicos cuando corresponda.

**Criterios clave**
- Un propietario debe poder crearse con datos de contacto mínimos.
- Se debe poder listar y consultar detalle de un propietario.
- Debe mantenerse integridad referencial con mascotas asociadas.

---

### RF-02 Gestión de mascotas
**Descripción:** Alta, consulta, actualización, listado de mascotas asociadas a un propietario.  
**Actores:** administrativo, admin; consulta por roles clínicos.

**Criterios clave**
- No se permite crear una mascota sin propietario.
- Se deben registrar datos básicos (nombre, especie, etc.).

---

### RF-03 Gestión de citas
**Descripción:** Crear, modificar, cancelar/actualizar estado y consultar citas.  
**Actores:** administrativo, admin; consulta por veterinario/auxiliar.

**Criterios clave**
- Las citas se asocian a una mascota.
- Se registra fecha/hora y motivo.
- Control de coherencia de agenda (p.ej. solape) según reglas de negocio configuradas.

---

### RF-04 Historial clínico por mascota
**Descripción:** Consultar episodios clínicos y tratamientos asociados a una mascota.  
**Actores:** admin, veterinario, auxiliar.  
**Restricción crítica:** el rol **administrativo** no puede acceder al historial clínico completo.

**Criterios clave**
- Acceso al endpoint de historial solo para roles clínicos.
- Debe permitir atención por sustitución (otro veterinario accede al historial si está autorizado).

---

### RF-05 Gestión de episodios clínicos
**Descripción:** Registrar y consultar episodios (consulta, diagnóstico, notas) por mascota.  
**Actores:** admin, veterinario, auxiliar (según endpoint).

**Criterios clave**
- Un episodio siempre está asociado a una mascota.
- El episodio registra fecha y descripción clínica.

---

### RF-06 Gestión de tratamientos
**Descripción:** Registrar tratamientos con medicamento, dosis, frecuencia y fechas.  
**Actores:** roles clínicos (admin, veterinario, auxiliar según permisos).

**Criterios clave**
- Tratamiento asociado a mascota.
- Permitir seguimiento y cierre (fecha fin / observaciones).

---

### RF-07 Gestión de recordatorios
**Descripción:** Registrar y consultar recordatorios (vacunas, revisiones, seguimiento) por mascota, con estado (pendiente/completado).  
**Actores:** roles clínicos (admin, veterinario, auxiliar).

**Criterios clave**
- Listado por estado y fecha objetivo.
- Cambio de estado para marcar completados.

---

### RF-08 Autenticación y autorización (seguridad)
**Descripción:** Login y control de acceso por rol a todos los módulos.  
**Actores:** todos los roles internos.

**Criterios clave**
- Login devuelve JWT y datos mínimos de usuario.
- Endpoints protegidos responden con 401/403 según corresponda.
- Separación administrativo vs clínico aplicada.

---

### RF-09 Búsqueda y acceso rápido
**Descripción:** Facilitar localización rápida de propietario/mascota/cita.  
**Actores:** todos los roles internos.

**Nota MVP:** el sistema contempla listados y detalle; el refinamiento de búsqueda avanzada se deja como mejora.

---

## 5. Requisitos no funcionales (RNF)

### RNF-01 Usabilidad
- Interfaz clara y con navegación simple (panel interno).
- Flujos consistentes (listado → detalle → acciones).
- Mensajes claros ante errores de autenticación/autorización (401/403).

### RNF-02 Seguridad y privacidad
- Autenticación y autorización obligatoria.
- **Confidencialidad**: el rol administrativo no accede a información clínica.
- Secrets por variables de entorno (`JWT_SECRET`).
- No exposición de hashes de contraseña.

### RNF-03 Disponibilidad y adopción progresiva
- Implantación sin detener actividad: enfoque MVP por módulos y ejecución local sencilla.
- Base de datos local (SQLite) para pruebas y formación interna.

### RNF-04 Rendimiento
- Respuestas rápidas en consultas comunes (listados y detalle).
- Diseño apto para optimizaciones posteriores (índices en BD, paginación).

### RNF-05 Mantenibilidad y calidad
- Arquitectura modular por capas: routes/controllers/services/repositories.
- Código testeable con tests automatizados básicos.
- Documentación funcional y técnica en `docs/`.

---

## 6. Restricciones y supuestos
- Presupuesto limitado → stack open-source (Node/React/SQLite).
- Diferente alfabetización digital → UI simple y flujo predecible.
- Confidencialidad obligatoria → RBAC y separación de módulos.
- No se interrumpe actividad → adopción incremental, pruebas con datos de demo y migración gradual.

---

## 7. Criterios de aceptación del MVP (globales)
- Un usuario puede **loguearse** y obtener token JWT.
- Las rutas protegidas devuelven **401/403** correctamente.
- `administrativo` gestiona propietarios/mascotas/citas pero **no** ve historial clínico.
- Roles clínicos consultan historial y registran episodios/tratamientos/recordatorios.
- Los tests de auth y middlewares pasan (`npm test` en backend).
