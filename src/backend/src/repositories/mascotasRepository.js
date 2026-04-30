const db = require('../config/db');

async function obtenerTodas() {
  const result = await db.query(`
    SELECT 
      m.*,
      p.nombre AS propietario_nombre
    FROM mascotas m
    INNER JOIN propietarios p ON p.id = m.propietario_id
    ORDER BY m.id ASC
  `);

  return result.rows;
}

async function obtenerPorId(id) {
  const result = await db.query(`
    SELECT 
      m.*,
      p.nombre AS propietario_nombre
    FROM mascotas m
    INNER JOIN propietarios p ON p.id = m.propietario_id
    WHERE m.id = $1
  `, [id]);

  return result.rows[0];
}

async function crear(data) {
  const result = await db.query(
    `INSERT INTO mascotas
      (propietario_id, nombre, especie, raza, sexo, fecha_nacimiento, peso, alergias, observaciones)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.propietario_id,
      data.nombre,
      data.especie,
      data.raza || null,
      data.sexo || null,
      data.fecha_nacimiento || null,
      data.peso || null,
      data.alergias || null,
      data.observaciones || null
    ]
  );

  return result.rows[0];
}

async function actualizar(id, data) {
  const result = await db.query(
    `UPDATE mascotas
     SET propietario_id = $1,
         nombre = $2,
         especie = $3,
         raza = $4,
         sexo = $5,
         fecha_nacimiento = $6,
         peso = $7,
         alergias = $8,
         observaciones = $9
     WHERE id = $10
     RETURNING *`,
    [
      data.propietario_id,
      data.nombre,
      data.especie,
      data.raza || null,
      data.sexo || null,
      data.fecha_nacimiento || null,
      data.peso || null,
      data.alergias || null,
      data.observaciones || null,
      id
    ]
  );

  return result.rows[0];
}

async function eliminar(id) {
  const result = await db.query(
    'DELETE FROM mascotas WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
}

async function existePropietario(propietarioId) {
  const result = await db.query(
    'SELECT id FROM propietarios WHERE id = $1',
    [propietarioId]
  );
  return result.rowCount > 0;
}

async function obtenerHistorial(mascotaId) {
  const result = await db.query(`
    SELECT
      ec.id,
      ec.fecha,
      ec.motivo_consulta,
      ec.sintomas,
      ec.diagnostico,
      ec.observaciones,
      v.nombre AS veterinario_nombre
    FROM episodios_clinicos ec
    INNER JOIN veterinarios v ON v.id = ec.veterinario_id
    WHERE ec.mascota_id = $1
    ORDER BY ec.fecha DESC
  `, [mascotaId]);

  return result.rows;
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  existePropietario,
  obtenerHistorial
};
