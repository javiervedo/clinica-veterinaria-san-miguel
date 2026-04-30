# Análisis funcional y requisitos

## Objetivo general

Modernizar y centralizar la gestión de información clínica y administrativa de la clínica.

## Stakeholders

- dirección
- veterinarios
- auxiliares
- personal administrativo
- clientes
- equipo de desarrollo

## Requisitos funcionales

### RF01. Gestión de propietarios
- alta, edición, consulta y listado de propietarios

### RF02. Gestión de mascotas
- alta, edición, consulta y listado de mascotas asociadas a un propietario

### RF03. Gestión de citas
- creación, modificación, cancelación y consulta de citas
- control de solapamientos por veterinario

### RF04. Historial clínico
- registro y consulta de episodios clínicos por mascota

### RF05. Tratamientos
- creación y seguimiento de tratamientos

### RF06. Recordatorios
- consulta de revisiones, vacunas o seguimientos pendientes

### RF07. Autenticación y autorización
- acceso con login
- permisos por rol

### RF08. Búsqueda
- búsqueda rápida por mascota o propietario

## Requisitos no funcionales

### RNF01. Usabilidad
- interfaz sencilla y clara

### RNF02. Seguridad
- autenticación
- control de acceso
- protección de datos personales y clínicos

### RNF03. Disponibilidad
- implantación sin detener la actividad habitual

### RNF04. Rendimiento
- respuesta rápida en consultas comunes

### RNF05. Mantenibilidad
- arquitectura modular
- código testeable

## Restricciones

- presupuesto limitado
- personal con distinto nivel de competencia digital
- necesidad de preservar la confidencialidad
- transición sin interrupción del servicio
