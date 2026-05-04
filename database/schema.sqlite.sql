-- SQLite schema equivalent (simplified) for local/dev usage without PostgreSQL
-- Notes:
-- - Uses INTEGER PRIMARY KEY AUTOINCREMENT instead of SERIAL/UUID.
-- - Uses TEXT for timestamps (ISO strings).
-- - Foreign keys enabled via PRAGMA.
-- - Keeps table/column names used by the repositories.

PRAGMA foreign_keys = ON;

-- Usuarios (para login JWT)
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin','veterinario','auxiliar','administrativo'))
);

-- Propietarios
CREATE TABLE IF NOT EXISTS propietarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  direccion TEXT
);

-- Mascotas
CREATE TABLE IF NOT EXISTS mascotas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  propietario_id INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  especie TEXT,
  raza TEXT,
  fecha_nacimiento TEXT,
  sexo TEXT,
  observaciones TEXT,
  FOREIGN KEY (propietario_id) REFERENCES propietarios(id) ON DELETE CASCADE
);

-- Citas
CREATE TABLE IF NOT EXISTS citas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mascota_id INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  motivo TEXT,
  veterinario TEXT,
  estado TEXT,
  notas TEXT,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
);

-- Episodios clínicos
CREATE TABLE IF NOT EXISTS episodios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mascota_id INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  descripcion TEXT,
  diagnostico TEXT,
  notas TEXT,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
);

-- Tratamientos
CREATE TABLE IF NOT EXISTS tratamientos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mascota_id INTEGER NOT NULL,
  fecha_inicio TEXT NOT NULL,
  fecha_fin TEXT,
  medicamento TEXT NOT NULL,
  dosis TEXT,
  frecuencia TEXT,
  observaciones TEXT,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
);

-- Recordatorios (vacunas/revisiones)
CREATE TABLE IF NOT EXISTS recordatorios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mascota_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  fecha_objetivo TEXT NOT NULL,
  estado TEXT,
  notas TEXT,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
);
