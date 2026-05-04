-- SQLite seed data for local/dev usage without PostgreSQL
PRAGMA foreign_keys = ON;

-- NOTE: password_hash generated with bcrypt (10 rounds) for 'admin123'
-- If you need to regenerate: use bcrypt.hashSync('admin123', 10)

INSERT OR IGNORE INTO usuarios (id, nombre, email, password_hash, rol) VALUES
  (1, 'Administrador', 'admin@sanmiguel.com', '$2b$10$y7yLvoZHornN.ZpXm9j1fOIvcgoguZZYOOVnEdBlQiR7asVE3BfRy', 'admin');

INSERT OR IGNORE INTO propietarios (id, nombre, telefono, email, direccion) VALUES
  (1, 'Juan Pérez', '600111222', 'juan.perez@email.com', 'C/ Mayor 1'),
  (2, 'María López', '600333444', 'maria.lopez@email.com', 'Av. Central 20');

INSERT OR IGNORE INTO mascotas (id, propietario_id, nombre, especie, raza, fecha_nacimiento, sexo, observaciones) VALUES
  (1, 1, 'Luna', 'Perro', 'Labrador', '2020-03-10', 'Hembra', 'Vacunación al día'),
  (2, 2, 'Milo', 'Gato', 'Europeo', '2019-08-22', 'Macho', 'Alergia estacional');

INSERT OR IGNORE INTO citas (id, mascota_id, fecha, motivo, veterinario, estado, notas) VALUES
  (1, 1, '2026-05-10T10:00:00', 'Vacunación', 'Dr. Sánchez', 'programada', 'Recordar cartilla'),
  (2, 2, '2026-05-11T12:30:00', 'Revisión', 'Dra. García', 'programada', '');

INSERT OR IGNORE INTO episodios (id, mascota_id, fecha, descripcion, diagnostico, notas) VALUES
  (1, 2, '2026-04-15', 'Picor y estornudos', 'Alergia', 'Se pauta antihistamínico');

INSERT OR IGNORE INTO tratamientos (id, mascota_id, fecha_inicio, fecha_fin, medicamento, dosis, frecuencia, observaciones) VALUES
  (1, 2, '2026-04-15', '2026-05-15', 'Antihistamínico', '5mg', '1 vez al día', 'Controlar evolución');

INSERT OR IGNORE INTO recordatorios (id, mascota_id, tipo, fecha_objetivo, estado, notas) VALUES
  (1, 1, 'Vacuna anual', '2026-06-01', 'pendiente', ''),
  (2, 2, 'Revisión', '2026-06-15', 'pendiente', '');
