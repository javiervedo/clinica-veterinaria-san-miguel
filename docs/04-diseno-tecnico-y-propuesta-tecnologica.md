# 04 – Diseño técnico y propuesta tecnológica (MVP)

## 1. Visión de solución
Se implementa una aplicación web de **arquitectura cliente-servidor**, compuesta por:
- **Frontend (panel interno)** para el personal de la clínica.
- **Backend (API REST)** con lógica de negocio y control de acceso.
- **Base de datos** (por defecto SQLite para ejecución local; alternativa PostgreSQL como opción de despliegue).

El objetivo del diseño es:
- bajo coste de adopción (open-source, despliegue sencillo)
- modularidad y mantenibilidad
- seguridad por roles y protección de datos clínicos
- escalabilidad suficiente para una clínica de tamaño medio

---

## 2. Arquitectura lógica (alto nivel)

### 2.1. Componentes
1. **Frontend**
   - SPA (Single Page Application)
   - Autenticación en cliente (gestión de token)
   - Navegación con rutas protegidas
   - Consumo de API mediante cliente HTTP (Axios)

2. **Backend**
   - API REST (Express)
   - Middlewares transversales:
     - autenticación JWT (`auth`)
     - autorización por rol (`role`)
   - Capas internas:
     - routes → controllers → services → repositories

3. **Persistencia**
   - SQLite (fichero local) en el MVP para facilitar ejecución y evaluación
   - PostgreSQL previsto como alternativa (misma capa repository con driver distinto)

---

## 3. Arquitectura técnica (detalle)

### 3.1. Backend (Node.js + Express)
**Estructura recomendada y aplicada**
- `src/backend/src/routes/`: define endpoints y aplica middlewares
- `src/backend/src/controllers/`: orquesta request/response
- `src/backend/src/services/`: reglas de negocio y validaciones
- `src/backend/src/repositories/`: acceso a datos (SQL/DB client)
- `src/backend/src/middlewares/`: auth (JWT) + role (RBAC)
- `src/backend/src/config/`: configuración de DB y entorno
- `src/backend/tests/`: tests Jest/Supertest

**Patrones y criterios**
- Separación de responsabilidades (SoC).
- Validaciones y errores controlados en capa service.
- Repositorio para desacoplar DB (SQLite vs PostgreSQL).

---

### 3.2. Frontend (React + Vite)
**Características**
- Vistas por módulo: propietarios, mascotas, citas, episodios, tratamientos, recordatorios.
- Gestión de sesión:
  - almacenamiento del token (localStorage/estado)
  - inyección del `Authorization: Bearer` en requests
- Rutas protegidas:
  - redirección a login si no hay sesión
  - página “Forbidden” (403) si rol no permitido

**Objetivo UX**
- interfaz simple y directa para personal con distintos niveles digitales
- navegación consistente (listado → detalle → acciones)

---

## 4. Seguridad por diseño (Security by Design)

### 4.1. Autenticación
- Login por `email/password`.
- Emisión de JWT con expiración configurable (`JWT_EXPIRES_IN`).
- Claims mínimos para evitar exposición de información innecesaria.

### 4.2. Autorización por rol (RBAC)
Roles del MVP:
- `admin`, `veterinario`, `auxiliar`, `administrativo`

Separación clave:
- `administrativo` puede gestionar **propietarios/mascotas/citas**
- `administrativo` **NO** puede acceder a historial clínico ni a episodios/tratamientos/recordatorios

---

## 5. Datos y persistencia

### 5.1. SQLite como DB por defecto en el repo
Motivación:
- facilita ejecución local (sin infraestructura adicional)
- ideal para evaluación académica y demos
- permite inicialización reproducible mediante scripts

Scripts:
- `node scripts/sqlite-init.js` (aplica schema + seed)
- `node scripts/sqlite-add-demo-users.js` (inserta usuarios de demo por rol sin modificar seeds)

### 5.2. PostgreSQL como alternativa (propuesta)
Para despliegues reales, PostgreSQL proporciona:
- concurrencia multiusuario
- mejor escalabilidad y tooling
- backups y administración más robusta

---

## 6. API REST (criterios)
- Endpoints agrupados por recurso: propietarios/mascotas/citas/episodios/tratamientos/recordatorios.
- Respuestas JSON consistentes.
- Códigos HTTP:
  - 200/201 OK/Created
  - 400 validación
  - 401 no autenticado
  - 403 no autorizado (RBAC)
  - 404 no encontrado

---

## 7. Calidad y pruebas (visión técnica)
- Tests automáticos en backend con Jest/Supertest centrados en:
  - login
  - middlewares de auth/role
- Recomendación para iteraciones:
  - tests de integración por módulo (CRUD + RBAC)
  - tests end-to-end de frontend (Playwright/Cypress)
  - pipelines CI (GitHub Actions)

---

## 8. Justificación tecnológica (resumen)
- **Node.js/Express**: rápido para APIs, mucha comunidad, modularidad.
- **React/Vite**: desarrollo rápido de SPA, ecosistema maduro.
- **SQLite**: ejecución local inmediata, ideal para MVP académico.
- **JWT + RBAC**: control de acceso claro y extensible, alineado con confidencialidad.
- **Jest/Supertest**: testing sencillo, integración con Express.
