# 05 – Modelo de datos (MVP)

## 1. Objetivo
Definir el modelo de datos del MVP y sus relaciones principales para soportar:
- gestión administrativa (propietarios, mascotas, citas)
- gestión clínica (episodios, tratamientos, recordatorios)
- control de acceso (usuarios y roles)

En el repositorio se incluyen:
- Esquema SQLite: `database/schema.sqlite.sql`
- Seed SQLite: `database/seed.sqlite.sql`
- (Alternativa) Esquema PostgreSQL: `database/schema.sql` y `database/seed.sql`

---

## 2. Entidades principales

### 2.1. usuarios
Representa los usuarios internos del sistema.
- `id`
- `nombre`
- `email` (único)
- `password_hash` (bcrypt)
- `rol` (enum lógico: `admin`, `veterinario`, `auxiliar`, `administrativo`)

**Notas**
- El hash no se expone en respuestas API.
- El rol determina acceso a módulos (administrativo vs clínico).

---

### 2.2. propietarios
Datos administrativos del propietario/cliente.
- `id`
- `nombre`
- `telefono`
- `email`
- `direccion`

---

### 2.3. mascotas
Pacientes de la clínica (asociados a propietario).
- `id`
- `propietario_id` (FK → propietarios.id)
- `nombre`
- `especie`
- `raza`
- `fecha_nacimiento`
- `sexo`
- `observaciones` (nota general no necesariamente clínica detallada)

---

### 2.4. citas
Agenda de atención.
- `id`
- `mascota_id` (FK → mascotas.id)
- `fecha` (datetime)
- `motivo` (texto)
- `veterinario` (texto en MVP)
- `estado` (programada, cancelada, completada, etc.)
- `notas`

**Nota de diseño**
En el MVP (SQLite) se modela el veterinario como **texto** para simplificar la ejecución local y evitar una tabla adicional. En despliegues reales podría normalizarse a una tabla `veterinarios` o asociarse a `usuarios` con rol veterinario.

---

### 2.5. episodios
Registro clínico por consulta/episodio.
- `id`
- `mascota_id` (FK → mascotas.id)
- `fecha`
- `descripcion`
- `diagnostico`
- `notas`

**Seguridad**
El acceso a episodios forma parte del historial clínico y se restringe a roles clínicos.

---

### 2.6. tratamientos
Tratamientos asociados a una mascota (o derivados de episodios).
- `id`
- `mascota_id` (FK → mascotas.id)
- `fecha_inicio`
- `fecha_fin`
- `medicamento`
- `dosis`
- `frecuencia`
- `observaciones`

---

### 2.7. recordatorios
Seguimientos planificados (vacunas, revisiones).
- `id`
- `mascota_id` (FK → mascotas.id)
- `tipo` (texto: “Vacuna anual”, “Revisión”, etc.)
- `fecha_objetivo`
- `estado` (pendiente/completado, etc.)
- `notas`

---

## 3. Relaciones (cardinalidades)

- **propietarios (1) → (N) mascotas**  
  Un propietario puede tener múltiples mascotas.
- **mascotas (1) → (N) citas**  
  Una mascota puede tener múltiples citas en el tiempo.
- **mascotas (1) → (N) episodios**  
  Historial clínico por mascota.
- **mascotas (1) → (N) tratamientos**  
  Tratamientos activos o finalizados por mascota.
- **mascotas (1) → (N) recordatorios**  
  Seguimientos planificados por mascota.

---

## 4. Integridad y reglas relevantes
- No puede existir mascota sin propietario (FK obligatoria).
- No puede existir cita/episodio/tratamiento/recordatorio sin mascota (FK obligatoria).
- El `email` del usuario es único.
- La segregación de acceso no se implementa en BD sino en capa API (JWT/RBAC).

---

## 5. Evolución prevista del modelo (no MVP)
- Normalizar **veterinario** a:
  - tabla `veterinarios`, o
  - asociación a `usuarios` con rol `veterinario`
- Añadir:
  - auditoría de accesos a historial (tabla logs)
  - adjuntos clínicos (documentos)
  - facturación/pagos
  - catálogos (vacunas, medicamentos, servicios)
