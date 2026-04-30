# Clínica Veterinaria San Miguel

Proyecto de digitalización y modernización de la gestión interna de la Clínica Veterinaria “San Miguel”.

## Descripción

La clínica actualmente gestiona citas, historiales clínicos y seguimientos mediante agendas en papel, hojas de cálculo y archivos físicos. Esto provoca errores, duplicidades, pérdida de tiempo y dificultades en el acceso a la información clínica.

Este proyecto propone e implementa una solución software centralizada para gestionar:

- propietarios
- mascotas
- citas
- historiales clínicos
- tratamientos
- seguimientos y recordatorios
- acceso por roles
- informes básicos

## Objetivos

- centralizar la información clínica y administrativa
- reducir errores y duplicidades
- facilitar el acceso rápido al historial de cada mascota
- mejorar el seguimiento de vacunaciones y tratamientos
- optimizar el tiempo del personal
- aumentar la trazabilidad y la seguridad de la información

## Alcance del MVP

La primera versión incluye:

- autenticación (login) con JWT
- middleware de autenticación (auth)
- middleware de autorización por rol (role)
- rutas protegidas por rol
- gestión de propietarios
- gestión de mascotas
- gestión de citas
- historial clínico básico
- tratamientos
- recordatorios
- API REST documentable
- tests unitarios e integración básicos

## Estructura del repositorio

```text
docs/         -> documentación funcional y técnica
database/     -> esquema y datos semilla
src/backend/  -> API backend en Node.js + Express
src/frontend/ -> frontend (pendiente de generación)
tests/        -> pruebas globales
```text

## Stack tecnológico

### Backend
- Node.js
- Express
- PostgreSQL
- Jest
- Supertest

### Frontend
- React
- Vite

### Calidad y despliegue
- Docker
- GitHub Actions
- ESLint

## Cómo ejecutar el backend

### 1. Entrar al backend (Windows CMD)
```bat
cd src\backend
```

### 2. Instalar dependencias
```bat
npm install
```

### 3. Configurar variables de entorno
Copiar `.env.example` a `.env` y ajustar valores.

Variables relevantes:
- `JWT_SECRET`: clave para firmar/verificar JWT
- `JWT_EXPIRES_IN` (opcional): expiración del token (por defecto `8h`)

### 4. Ejecutar en desarrollo
```bat
npm run dev
```

Alternativa (desde la raíz del repo, en una sola línea):
```bat
cmd /c "cd /d src\backend && npm run dev"
```

## Base de datos

Los scripts SQL se encuentran en:

- `database/schema.sql`
- `database/seed.sql`

## Cómo probar (demo rápida)

### 1) Healthcheck
```bat
curl http://localhost:3001/health
```

### 2) Login (JWT)
```bat
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@sanmiguel.com\",\"password\":\"admin123\"}"
```
Copia el campo `token` de la respuesta.

### 3) Endpoint protegido (ejemplo)
```bat
curl http://localhost:3001/api/propietarios ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

Comportamiento esperado:
- sin `Authorization` -> 401
- token válido + rol permitido -> 200
- token válido + rol no permitido -> 403

## Documentación

La documentación funcional y técnica está en la carpeta `docs/`.

## Estado del proyecto

En desarrollo.

## Autoría

Proyecto académico para análisis, diseño y desarrollo de una solución de gestión veterinaria.
