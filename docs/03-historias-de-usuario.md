# HISTORIAS DE USUARIO
## Clínica Veterinaria “San Miguel”

---

## Contenido

1. Introducción  
2. Historias de usuario  
   - HU-01 Inicio de sesión en el sistema  
   - HU-02 Cierre de sesión  
   - HU-03 Control de acceso mediante token  
   - HU-04 Control de acceso por rol  
   - HU-05 Alta de propietarios  
   - HU-06 Consulta de propietarios  
   - HU-07 Modificación de propietarios  
   - HU-08 Alta de mascotas  
   - HU-09 Consulta de mascotas  
   - HU-10 Modificación de mascotas  
   - HU-11 Gestión de citas  
   - HU-12 Consulta del historial clínico de la mascota  
   - HU-13 Registro de episodios clínicos  
   - HU-14 Modificación de episodios clínicos  
   - HU-15 Registro de tratamientos  
   - HU-16 Consulta y actualización de tratamientos  
   - HU-17 Registro de recordatorios  
   - HU-18 Seguimiento de recordatorios  
   - HU-19 Protección de rutas y respuestas 401/403  
   - HU-20 Validación básica mediante pruebas  
3. Fuera de alcance (por ahora)  
4. Siguientes iteraciones  

---

## 1. Introducción

El presente documento recoge las historias de usuario que describen las necesidades funcionales cubiertas por el sistema interno desarrollado para la Clínica Veterinaria “San Miguel”.

El objetivo de este documento es servir como base clara y estructurada para documentar el **MVP implementado**, asegurando que la solución responda a los problemas detectados en la operativa diaria: uso de papel y hojas de cálculo, duplicidades de datos, dificultad para localizar historiales, gestión manual de recordatorios y ausencia de un control centralizado y seguro de la información.

La solución desarrollada consiste en un sistema interno compuesto por **panel web + API**, con autenticación mediante **JWT**, control de acceso por rol y módulos de gestión administrativa y clínica.

---

## 2. Historias de usuario

### HU-01 Inicio de sesión en el sistema

**Descripción de la Historia de Usuario:**  
Como usuario del sistema quiero iniciar sesión con mis credenciales para acceder a las funcionalidades permitidas según mi perfil.

**Criterios de aceptación:**
- El usuario debe autenticarse mediante email y contraseña.
- El sistema debe devolver un token JWT válido cuando las credenciales son correctas.
- El sistema debe devolver la información básica del usuario autenticado.
- Solo los usuarios con credenciales válidas pueden acceder al sistema.

**Priorización:**  
Alta

**Dependencias:**  
Gestión de usuarios, autenticación JWT.

**Flujo del usuario (Workflow):**
1. El usuario accede a la pantalla de login.
2. Introduce su email y contraseña.
3. Confirma el acceso.
4. El sistema valida las credenciales.
5. El sistema devuelve token y datos del usuario.

**Consideraciones técnicas:**  
La autenticación se realiza mediante `POST /api/auth/login`. El backend valida credenciales y genera un JWT.

**Detalles adicionales:**  
El acceso al resto de módulos depende de la autenticación previa y del rol del usuario.

---

### HU-02 Cierre de sesión

**Descripción de la Historia de Usuario:**  
Como usuario autenticado quiero cerrar sesión para finalizar mi acceso al sistema de forma segura.

**Criterios de aceptación:**
- El sistema debe permitir al usuario cerrar sesión desde la interfaz.
- Al cerrar sesión, el token debe dejar de estar disponible en cliente.
- Una vez cerrada la sesión, el usuario no puede acceder a rutas protegidas sin volver a autenticarse.

**Priorización:**  
Alta

**Dependencias:**  
Autenticación JWT, gestión de sesión en frontend.

**Flujo del usuario (Workflow):**
1. El usuario accede al sistema autenticado.
2. Selecciona la opción de cerrar sesión.
3. El sistema elimina la sesión local.
4. El usuario vuelve al estado no autenticado.

**Consideraciones técnicas:**  
El logout se resuelve invalidando la sesión en cliente mediante eliminación del token almacenado.

**Detalles adicionales:**  
Si el usuario desea continuar operando, debe volver a iniciar sesión.

---

### HU-03 Control de acceso mediante token

**Descripción de la Historia de Usuario:**  
Como sistema quiero validar que todas las rutas protegidas requieran un token válido para evitar accesos no autorizados.

**Criterios de aceptación:**
- Si una petición no incluye token, el sistema debe responder con 401.
- Si el token es inválido o ha expirado, el sistema debe responder con 401.
- Si el token es válido, el sistema debe permitir continuar con la operación solicitada.

**Priorización:**  
Alta

**Dependencias:**  
Autenticación JWT, middleware `auth`.

**Flujo del usuario (Workflow):**
1. El usuario realiza una petición a una ruta protegida.
2. El sistema valida la presencia del token.
3. El sistema valida la integridad y vigencia del token.
4. Si es válido, permite la operación; si no, la rechaza.

**Consideraciones técnicas:**  
La validación del token se realiza en backend mediante middleware de autenticación.

**Detalles adicionales:**  
La protección debe aplicarse de forma consistente en todos los módulos internos.

---

### HU-04 Control de acceso por rol

**Descripción de la Historia de Usuario:**  
Como usuario del sistema quiero que el acceso a módulos y operaciones dependa de mi rol para evitar acciones no autorizadas.

**Criterios de aceptación:**
- El acceso a módulos administrativos debe respetar los permisos del rol.
- El acceso a módulos clínicos debe estar restringido a los roles autorizados.
- Cuando un usuario autenticado no tenga permisos suficientes, el sistema debe responder con 403.

**Priorización:**  
Alta

**Dependencias:**  
Gestión de usuarios, middleware `role`, autenticación JWT.

**Flujo del usuario (Workflow):**
1. El usuario autenticado accede a una funcionalidad.
2. El sistema identifica su rol.
3. El sistema comprueba si el rol está autorizado.
4. Si el rol es válido, permite el acceso; si no, lo deniega.

**Consideraciones técnicas:**  
La autorización se implementa mediante middleware de rol en backend.

**Detalles adicionales:**  
El rol `administrativo` no puede acceder a información clínica.

---

### HU-05 Alta de propietarios

**Descripción de la Historia de Usuario:**  
Como administrativo quiero registrar propietarios para disponer de sus datos en un sistema único y asociarlos a mascotas.

**Criterios de aceptación:**
- Solo los usuarios autorizados pueden crear propietarios.
- El sistema debe almacenar correctamente los datos del propietario.
- El propietario debe quedar disponible para su consulta y asociación a mascotas.

**Priorización:**  
Alta

**Dependencias:**  
Autenticación, autorización por rol.

**Flujo del usuario (Workflow):**
1. El usuario accede al módulo de propietarios.
2. Selecciona la opción de nuevo propietario.
3. Introduce los datos requeridos.
4. Guarda la información.

**Consideraciones técnicas:**  
Validaciones obligatorias en frontend y backend sobre los campos requeridos.

**Detalles adicionales:**  
Esta funcionalidad forma parte del módulo administrativo.

---

### HU-06 Consulta de propietarios

**Descripción de la Historia de Usuario:**  
Como usuario autorizado quiero consultar propietarios para revisar su información administrativa.

**Criterios de aceptación:**
- Solo los usuarios autorizados pueden consultar propietarios.
- El sistema debe mostrar la información registrada de cada propietario.
- La consulta debe estar disponible para los perfiles con acceso administrativo.

**Priorización:**  
Media

**Dependencias:**  
Gestión de propietarios, autenticación y roles.

**Flujo del usuario (Workflow):**
1. El usuario accede al módulo de propietarios.
2. Visualiza el listado de propietarios.
3. Selecciona un propietario para ver su detalle.

**Consideraciones técnicas:**  
Consultas básicas protegidas por middleware de autenticación y autorización.

**Detalles adicionales:**  
La información consultada es de carácter interno de la clínica.

---

### HU-07 Modificación de propietarios

**Descripción de la Historia de Usuario:**  
Como administrativo quiero modificar propietarios para mantener sus datos actualizados.

**Criterios de aceptación:**
- Solo los usuarios autorizados pueden editar propietarios.
- Los cambios deben guardarse correctamente.
- La información actualizada debe reflejarse de forma inmediata en la consulta.

**Priorización:**  
Media

**Dependencias:**  
Gestión de propietarios, control de acceso por rol.

**Flujo del usuario (Workflow):**
1. El usuario localiza un propietario.
2. Edita los datos permitidos.
3. Guarda los cambios.
4. El sistema actualiza la información.

**Consideraciones técnicas:**  
La actualización debe validarse en backend antes de persistirse.

**Detalles adicionales:**  
No aplica acceso clínico en esta funcionalidad.

---

### HU-08 Alta de mascotas

**Descripción de la Historia de Usuario:**  
Como administrativo quiero registrar mascotas para asociarlas a sus propietarios y gestionar su atención en la clínica.

**Criterios de aceptación:**
- La mascota debe poder asociarse a un propietario existente.
- Solo los usuarios autorizados pueden crear mascotas.
- El sistema debe almacenar la información correctamente.

**Priorización:**  
Alta

**Dependencias:**  
Gestión de propietarios, autenticación, autorización por rol.

**Flujo del usuario (Workflow):**
1. El usuario accede al módulo de mascotas.
2. Selecciona la opción de nueva mascota.
3. Introduce la información y la asocia a un propietario.
4. Guarda el registro.

**Consideraciones técnicas:**  
Validaciones obligatorias en frontend y backend.

**Detalles adicionales:**  
El rol administrativo puede operar sobre este módulo en lectura, creación y actualización.

---

### HU-09 Consulta de mascotas

**Descripción de la Historia de Usuario:**  
Como usuario autorizado quiero consultar mascotas para revisar sus datos administrativos y operativos.

**Criterios de aceptación:**
- El sistema debe permitir consultar mascotas a los roles autorizados.
- La información administrativa de la mascota debe estar disponible.
- El acceso al historial clínico no forma parte de esta consulta general para el rol administrativo.

**Priorización:**  
Alta

**Dependencias:**  
Gestión de mascotas, control por rol.

**Flujo del usuario (Workflow):**
1. El usuario accede al listado de mascotas.
2. Busca o selecciona una mascota.
3. Consulta su información general.

**Consideraciones técnicas:**  
La información clínica sensible debe permanecer separada del acceso administrativo.

**Detalles adicionales:**  
La consulta del historial clínico se documenta en una historia específica.

---

### HU-10 Modificación de mascotas

**Descripción de la Historia de Usuario:**  
Como administrativo quiero modificar mascotas para mantener actualizada su información.

**Criterios de aceptación:**
- Solo usuarios autorizados pueden editar mascotas.
- Los cambios deben guardarse correctamente.
- La mascota actualizada debe quedar disponible para futuras operaciones.

**Priorización:**  
Media

**Dependencias:**  
Gestión de mascotas, autenticación, autorización.

**Flujo del usuario (Workflow):**
1. El usuario selecciona una mascota existente.
2. Modifica los datos permitidos.
3. Guarda los cambios.

**Consideraciones técnicas:**  
La validación de datos debe realizarse en backend.

**Detalles adicionales:**  
La edición administrativa no implica acceso a módulos clínicos restringidos.

---

### HU-11 Gestión de citas

**Descripción de la Historia de Usuario:**  
Como administrativo quiero crear, consultar y actualizar citas para organizar la agenda diaria de la clínica.

**Criterios de aceptación:**
- Solo usuarios autorizados pueden gestionar citas.
- Debe ser posible registrar nuevas citas.
- Debe ser posible consultar citas existentes.
- Debe ser posible actualizar citas ya registradas.

**Priorización:**  
Alta

**Dependencias:**  
Gestión de mascotas, autenticación, autorización por rol.

**Flujo del usuario (Workflow):**
1. El usuario accede al módulo de citas.
2. Registra una nueva cita o consulta una ya existente.
3. Si corresponde, modifica la información.
4. Guarda los cambios.

**Consideraciones técnicas:**  
Las operaciones CRUD deben protegerse por token y rol.

**Detalles adicionales:**  
La gestión de agenda está separada del contenido clínico.

---

### HU-12 Consulta del historial clínico de la mascota

**Descripción de la Historia de Usuario:**  
Como veterinario, auxiliar o administrador del sistema quiero consultar el historial clínico de una mascota para disponer del contexto asistencial.

**Criterios de aceptación:**
- El endpoint `GET /mascotas/:id/historial` solo debe estar accesible para `admin`, `veterinario` y `auxiliar`.
- El rol `administrativo` no debe poder acceder a esta funcionalidad.
- Si un usuario no autorizado accede, el sistema debe responder con 403.

**Priorización:**  
Alta

**Dependencias:**  
Gestión de mascotas, episodios clínicos, middleware `role`.

**Flujo del usuario (Workflow):**
1. El usuario autorizado accede a la ficha de una mascota.
2. Selecciona la opción de historial clínico.
3. El sistema valida el rol.
4. El sistema muestra la información clínica asociada.

**Consideraciones técnicas:**  
Se debe proteger específicamente el endpoint de historial mediante autorización por rol.

**Detalles adicionales:**  
Esta funcionalidad es crítica por motivos de confidencialidad.

---

### HU-13 Registro de episodios clínicos

**Descripción de la Historia de Usuario:**  
Como veterinario quiero registrar episodios clínicos asociados a una mascota para documentar consultas e intervenciones realizadas.

**Criterios de aceptación:**
- Solo los roles clínicos autorizados pueden registrar episodios.
- El episodio debe quedar asociado a una mascota.
- El sistema debe almacenar correctamente la información clínica registrada.

**Priorización:**  
Alta

**Dependencias:**  
Gestión de mascotas, autenticación, autorización por rol.

**Flujo del usuario (Workflow):**
1. El usuario accede al módulo clínico.
2. Selecciona una mascota.
3. Registra un nuevo episodio clínico.
4. Guarda la información.

**Consideraciones técnicas:**  
Validaciones obligatorias y protección por rol en backend.

**Detalles adicionales:**  
El rol administrativo queda excluido de este módulo.

---

### HU-14 Modificación de episodios clínicos

**Descripción de la Historia de Usuario:**  
Como usuario clínico autorizado quiero modificar episodios clínicos para corregir o completar información asistencial.

**Criterios de aceptación:**
- Solo los roles clínicos autorizados pueden modificar episodios.
- Los cambios deben persistirse correctamente.
- El usuario administrativo no debe tener acceso a esta operación.

**Priorización:**  
Media

**Dependencias:**  
Gestión de episodios clínicos, control por rol.

**Flujo del usuario (Workflow):**
1. El usuario localiza un episodio existente.
2. Modifica la información permitida.
3. Guarda los cambios.

**Consideraciones técnicas:**  
La validación debe ejecutarse en backend y respetar el middleware de autorización.

**Detalles adicionales:**  
Debe mantenerse la integridad del historial clínico.

---

### HU-15 Registro de tratamientos

**Descripción de la Historia de Usuario:**  
Como usuario clínico autorizado quiero registrar tratamientos para documentar la atención terapéutica de la mascota.

**Criterios de aceptación:**
- Solo `admin`, `veterinario` y `auxiliar` pueden acceder a tratamientos.
- El sistema debe permitir registrar tratamientos correctamente.
- El tratamiento debe quedar vinculado a la mascota o contexto clínico correspondiente.

**Priorización:**  
Alta

**Dependencias:**  
Gestión clínica, autenticación, autorización por rol.

**Flujo del usuario (Workflow):**
1. El usuario accede al módulo de tratamientos.
2. Registra un nuevo tratamiento.
3. Guarda la información.

**Consideraciones técnicas:**  
Protección por middleware `auth` y `role`.

**Detalles adicionales:**  
El rol administrativo no tiene acceso a este módulo.

---

### HU-16 Consulta y actualización de tratamientos

**Descripción de la Historia de Usuario:**  
Como usuario clínico autorizado quiero consultar y actualizar tratamientos para mantener la información terapéutica al día.

**Criterios de aceptación:**
- Solo los roles clínicos autorizados pueden consultar tratamientos.
- Solo los roles autorizados pueden modificar tratamientos.
- Los cambios deben reflejarse correctamente en el sistema.

**Priorización:**  
Media

**Dependencias:**  
Gestión de tratamientos, control por rol.

**Flujo del usuario (Workflow):**
1. El usuario accede al módulo de tratamientos.
2. Consulta un tratamiento existente.
3. Si es necesario, actualiza la información.
4. Guarda los cambios.

**Consideraciones técnicas:**  
Debe mantenerse coherencia entre permisos de lectura y actualización.

**Detalles adicionales:**  
La información es de carácter clínico y restringido.

---

### HU-17 Registro de recordatorios

**Descripción de la Historia de Usuario:**  
Como usuario clínico autorizado quiero registrar recordatorios de vacunas, revisiones y seguimientos para facilitar la continuidad asistencial.

**Criterios de aceptación:**
- Solo los roles clínicos autorizados pueden crear recordatorios.
- El sistema debe permitir registrar recordatorios de vacunas, revisiones y seguimiento.
- El recordatorio debe quedar asociado a la mascota correspondiente.

**Priorización:**  
Alta

**Dependencias:**  
Gestión de mascotas, autenticación, autorización por rol.

**Flujo del usuario (Workflow):**
1. El usuario accede al módulo de recordatorios.
2. Selecciona la mascota.
3. Registra el tipo de recordatorio.
4. Guarda la información.

**Consideraciones técnicas:**  
La funcionalidad debe estar restringida a `admin`, `veterinario` y `auxiliar`.

**Detalles adicionales:**  
No se contemplan envíos automáticos en este MVP.

---

### HU-18 Seguimiento de recordatorios

**Descripción de la Historia de Usuario:**  
Como usuario clínico autorizado quiero gestionar el estado de los recordatorios para controlar si están pendientes o completados.

**Criterios de aceptación:**
- El sistema debe permitir identificar recordatorios pendientes.
- El sistema debe permitir marcar un recordatorio como completado.
- El nuevo estado debe quedar reflejado en la consulta posterior.

**Priorización:**  
Alta

**Dependencias:**  
Gestión de recordatorios.

**Flujo del usuario (Workflow):**
1. El usuario accede al listado de recordatorios.
2. Consulta el estado actual.
3. Actualiza el recordatorio correspondiente.
4. El sistema guarda el nuevo estado.

**Consideraciones técnicas:**  
La actualización del estado debe estar protegida por permisos clínicos.

**Detalles adicionales:**  
El seguimiento es interno y no implica notificación automática al propietario.

---

### HU-19 Protección de rutas y respuestas 401/403

**Descripción de la Historia de Usuario:**  
Como responsable del sistema quiero que las rutas protegidas devuelvan respuestas consistentes 401 y 403 para garantizar seguridad y comportamiento uniforme.

**Criterios de aceptación:**
- Si no se envía token, la respuesta debe ser 401.
- Si el rol no tiene permisos suficientes, la respuesta debe ser 403.
- Las rutas protegidas deben comportarse de manera consistente en todos los módulos.

**Priorización:**  
Alta

**Dependencias:**  
Middleware `auth`, middleware `role`.

**Flujo del usuario (Workflow):**
1. El usuario accede a una ruta protegida.
2. El sistema valida autenticación.
3. El sistema valida autorización.
4. Devuelve acceso o error según corresponda.

**Consideraciones técnicas:**  
Debe aplicarse una política homogénea en API para manejo de errores de seguridad.

**Detalles adicionales:**  
Esta historia impacta transversalmente a todo el sistema.

---

### HU-20 Validación básica mediante pruebas

**Descripción de la Historia de Usuario:**  
Como equipo técnico quiero disponer de pruebas unitarias y de integración básicas para comprobar el correcto funcionamiento del MVP.

**Criterios de aceptación:**
- Deben existir pruebas unitarias o de integración para flujos básicos.
- Deben validarse casos de autenticación y acceso protegido.
- Deben validarse respuestas esperadas en operaciones principales del sistema.

**Priorización:**  
Media

**Dependencias:**  
Implementación de autenticación, autorización y módulos funcionales.

**Flujo del usuario (Workflow):**
1. El equipo ejecuta la batería de pruebas.
2. El sistema valida los casos definidos.
3. Se obtiene evidencia del comportamiento básico esperado.

**Consideraciones técnicas:**  
Las pruebas se implementan con Jest y Supertest.

**Detalles adicionales:**  
La cobertura actual es básica y podrá ampliarse en futuras iteraciones.

---

## 3. Fuera de alcance (por ahora)

Quedan fuera del alcance actual del MVP las siguientes funcionalidades:

- Facturación y cobros.
- Gestión de stock o farmacia.
- Envío automático de recordatorios por email o SMS.
- Portal externo para propietarios.
- Informes avanzados y cuadros de mando.
- Gestión documental con adjuntos clínicos.
- Auditoría avanzada de acciones de usuario.
- Integraciones con terceros.

---

## 4. Siguientes iteraciones

Como evolución futura del sistema, se propone valorar:

- Envío automático de recordatorios.
- Cuadros de mando e indicadores básicos de negocio.
- Auditoría de accesos y cambios sobre datos clínicos.
- Gestión de documentación adjunta en episodios clínicos.
- Mejora de cobertura de pruebas automatizadas.
- Refuerzo de políticas de sesión y seguridad.
