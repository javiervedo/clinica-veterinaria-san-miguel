INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Administrador', 'admin@sanmiguel.com', '$2b$10$yFY/hIwbr0bLMZJeKaK1IuxWzCBaSgLgFQd4RC3PpybH7WQ5RbNWC', 'admin'),
('Dra. Laura Pérez', 'laura@sanmiguel.com', '$2b$10$yFY/hIwbr0bLMZJeKaK1IuxWzCBaSgLgFQd4RC3PpybH7WQ5RbNWC', 'veterinario'),
('Auxiliar Marta', 'marta@sanmiguel.com', '$2b$10$yFY/hIwbr0bLMZJeKaK1IuxWzCBaSgLgFQd4RC3PpybH7WQ5RbNWC', 'auxiliar');

INSERT INTO propietarios (nombre, telefono, email, direccion) VALUES
('Carlos Gómez', '600111222', 'carlos@email.com', 'Calle Mayor 10'),
('Ana Ruiz', '600333444', 'ana@email.com', 'Avenida Sol 25');

INSERT INTO veterinarios (nombre, numero_colegiado, especialidad, activo) VALUES
('Laura Pérez', 'VET-1001', 'Medicina general', TRUE),
('Javier Martín', 'VET-1002', 'Cirugía menor', TRUE);

INSERT INTO mascotas (propietario_id, nombre, especie, raza, sexo, fecha_nacimiento, peso, alergias, observaciones) VALUES
(1, 'Luna', 'Perro', 'Labrador', 'Hembra', '2020-03-10', 24.50, 'Ninguna', 'Mascota tranquila'),
(1, 'Milo', 'Gato', 'Europeo', 'Macho', '2021-07-15', 4.20, 'Pollo', 'Requiere manejo suave'),
(2, 'Nala', 'Perro', 'Border Collie', 'Hembra', '2019-11-05', 18.30, NULL, 'Muy activa');

INSERT INTO citas (mascota_id, veterinario_id, fecha, tipo, estado, observaciones) VALUES
(1, 1, '2026-05-10 10:00:00', 'consulta', 'programada', 'Revisión general'),
(2, 1, '2026-05-10 11:00:00', 'vacuna', 'programada', 'Vacunación anual'),
(3, 2, '2026-05-11 09:30:00', 'revision', 'programada', 'Seguimiento de tratamiento');

INSERT INTO episodios_clinicos (mascota_id, veterinario_id, cita_id, motivo_consulta, sintomas, diagnostico, observaciones) VALUES
(1, 1, 1, 'Revisión general', 'Sin síntomas relevantes', 'Paciente estable', 'Continuar control anual');

INSERT INTO tratamientos (episodio_id, nombre, pauta, fecha_inicio, fecha_fin, estado) VALUES
(1, 'Antiparasitario', 'Administrar una dosis mensual durante 3 meses', '2026-05-10', '2026-08-10', 'activo');

INSERT INTO recordatorios (mascota_id, tipo, fecha_objetivo, estado, descripcion) VALUES
(1, 'vacunacion', '2026-06-01', 'pendiente', 'Recordatorio vacuna anual'),
(3, 'revision', '2026-05-20', 'pendiente', 'Revisión de seguimiento clínico');
