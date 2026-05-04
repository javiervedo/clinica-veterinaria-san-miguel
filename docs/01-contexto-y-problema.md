# 01 – Contexto y problema

## 1. Contexto organizativo
La **Clínica Veterinaria “San Miguel”** es un centro privado de tamaño medio ubicado en una ciudad de ~80.000 habitantes. Cuenta con:

- **6 veterinarios** (consulta general, vacunaciones, cirugía menor, seguimientos)
- **4 auxiliares** (soporte, seguimiento, tareas clínicas delegadas)
- **2 administrativos** (agenda, coordinación, atención telefónica, documentación)

La clínica atiende a pacientes (mascotas) con propietario responsable y requiere registrar información de carácter **administrativo** (contacto, agenda) y **clínico** (episodios, tratamientos, vacunaciones, observaciones).

---

## 2. Situación actual (AS-IS)
La gestión actual se apoya en una combinación de:
- **agenda en papel** (citas por profesional/fecha)
- **hojas de cálculo aisladas**
- **carpetas físicas** archivadas por mascota

Cada veterinario anota la información durante la consulta y posteriormente parte de esos datos se transcriben de forma manual a registros digitales básicos, sin un formato uniforme.

---

## 3. Problemas detectados
### 3.1. Operativos
- **Duplicidad de citas** y/o errores por transcripción manual.
- Dificultad para evitar **solapes** de agenda.
- Pérdida de tiempo en coordinación: llamadas, confirmaciones, revisiones.

### 3.2. Clínicos
- Historiales **incompletos**, dispersos o difíciles de localizar.
- Cuando un veterinario sustituye a otro, es complejo acceder rápido a la información completa del paciente.
- El seguimiento de tratamientos prolongados depende de recordatorios manuales.

### 3.3. Información y toma de decisiones
- Falta de un repositorio central para analizar:
  - frecuencia de visitas
  - tratamientos más comunes
  - evolución de determinados casos
  - cargas de trabajo por profesional
- Limitación para reportar/monitorizar el negocio de forma fiable.

---

## 4. Impacto
- **Riesgo** de errores en la atención (información incompleta o tardía).
- **Disminución de la satisfacción** del cliente por fallos de agenda o seguimiento.
- **Ineficiencia** y sobrecarga administrativa.
- Baja capacidad de control y análisis del negocio.

---

## 5. Objetivo del proyecto (TO-BE)
Diseñar e implementar una solución centralizada que permita:

- gestionar **propietarios**, **mascotas** y **citas**
- disponer de **historial clínico** accesible por personal autorizado
- registrar **episodios clínicos** y **tratamientos**
- gestionar **recordatorios** para vacunaciones y revisiones
- garantizar **confidencialidad** mediante control de acceso por roles
- reducir errores y duplicidades y mejorar la coordinación interna

---

## 6. Restricciones y condicionantes
- **Presupuesto limitado** (solución de bajo coste y alta mantenibilidad).
- **Transición sin interrupción** de actividad (implantación incremental).
- **Confidencialidad obligatoria** (datos personales y clínicos).
- Personal con **distintos niveles de familiaridad digital** (interfaz y flujos sencillos).

---

## 7. Alcance del MVP implementado (resumen)
El MVP entregado consiste en un **panel interno** (frontend) + **API** (backend) con:
- autenticación por credenciales + **JWT**
- autorización por **roles** (RBAC)
- módulos de gestión administrativa (propietarios/mascotas/citas)
- módulos clínicos (episodios/historial, tratamientos, recordatorios)
- separación “administrativo vs clínico” aplicada en endpoints sensibles
