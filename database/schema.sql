DROP TABLE IF EXISTS tratamientos CASCADE;
DROP TABLE IF EXISTS episodios_clinicos CASCADE;
DROP TABLE IF EXISTS recordatorios CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS mascotas CASCADE;
DROP TABLE IF EXISTS veterinarios CASCADE;
DROP TABLE IF EXISTS propietarios CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL CHECK (rol IN ('admin', 'veterinario', 'auxiliar')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE propietarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(120),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE veterinarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    numero_colegiado VARCHAR(50),
    especialidad VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE mascotas (
    id SERIAL PRIMARY KEY,
    propietario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(80),
    sexo VARCHAR(20),
    fecha_nacimiento DATE,
    peso DECIMAL(6,2),
    alergias TEXT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mascota_propietario
        FOREIGN KEY (propietario_id) REFERENCES propietarios(id)
        ON DELETE CASCADE
);

CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    mascota_id INT NOT NULL,
    veterinario_id INT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'programada' CHECK (estado IN ('programada', 'completada', 'cancelada')),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cita_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cita_veterinario
        FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id)
        ON DELETE RESTRICT
);

CREATE TABLE episodios_clinicos (
    id SERIAL PRIMARY KEY,
    mascota_id INT NOT NULL,
    veterinario_id INT NOT NULL,
    cita_id INT,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo_consulta TEXT NOT NULL,
    sintomas TEXT,
    diagnostico TEXT,
    observaciones TEXT,
    CONSTRAINT fk_episodio_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_episodio_veterinario
        FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_episodio_cita
        FOREIGN KEY (cita_id) REFERENCES citas(id)
        ON DELETE SET NULL
);

CREATE TABLE tratamientos (
    id SERIAL PRIMARY KEY,
    episodio_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    pauta TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'finalizado', 'cancelado')),
    CONSTRAINT fk_tratamiento_episodio
        FOREIGN KEY (episodio_id) REFERENCES episodios_clinicos(id)
        ON DELETE CASCADE
);

CREATE TABLE recordatorios (
    id SERIAL PRIMARY KEY,
    mascota_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    fecha_objetivo DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'gestionado', 'cancelado')),
    descripcion TEXT,
    CONSTRAINT fk_recordatorio_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE CASCADE
);
