# Plan de pruebas

## Objetivo

Verificar el correcto funcionamiento del sistema y la integridad de la información.

## Tipos de pruebas

- unitarias
- integración
- funcionales
- seguridad
- usabilidad básica

## Casos clave

### Funcionalidad (MVP)
- crear propietario
- crear mascota
- crear cita sin solape
- impedir cita solapada
- consultar historial
- registrar tratamiento
- consultar recordatorios

### Seguridad / Control de acceso (JWT + roles)

#### Autenticación (login)
- **LOGIN-001**: `POST /api/auth/login` con `{ email, password }` válidos  
  - Esperado: **200**, devuelve `{ token, user }` (sin `password_hash`)
- **LOGIN-002**: login sin `email` o sin `password`  
  - Esperado: **400**
- **LOGIN-003**: login con credenciales inválidas  
  - Esperado: **401**

#### JWT (middleware auth)
- **AUTH-001**: acceso a endpoint protegido sin header `Authorization`  
  - Esperado: **401**
- **AUTH-002**: acceso con `Authorization: Bearer <token>` inválido  
  - Esperado: **401**
- **AUTH-003**: acceso con token válido  
  - Esperado: **200** y `req.user` disponible (id, email, rol, nombre)

#### Roles (middleware role)
- **ROLE-001**: token válido pero rol NO permitido para el endpoint  
  - Esperado: **403**
- **ROLE-002**: token válido y rol permitido para el endpoint  
  - Esperado: **200**

#### Endpoints protegidos a verificar
- `GET /api/propietarios` (requiere login; roles permitidos: admin/veterinario/auxiliar)
- `DELETE /api/propietarios/:id` (solo admin)
- `POST /api/episodios` (admin/veterinario)
- `POST /api/recordatorios` (admin/auxiliar)
