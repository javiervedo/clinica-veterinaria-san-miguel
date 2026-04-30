const db = require('../config/db');

async function obtenerTodas() {
  const result = await db.query(`
    SELECT
      c.*,
      m.nombre AS mascota_nombre,
      v.nombre AS veterinario_nombre
    FROM citas c
    INNER JOIN mascotas m ON m.id = c.mascota_id
    INNER JOIN veterinarios v ON v.id = c.veterinario_id
    ORDER BY c.fecha ASC
  `);

  return result.rows;
}

async function obtenerPorId(id) {
  const result = await db.query(`
    SELECT
      c.*,
      m.nombre AS mascota_nombre,
      v.nombre AS veterinario_nombre
    FROM citas c
    INNER JOIN mascotas m ON m.id = c.mascota_id
    INNER JOIN veterinarios v ON v.id = c.veterinario_id
    WHERE c.id = $1
  `, [id]);

  return result.rows[0];
}

async function crear(data) {
  const result = await db.query(
    `INSERT INTO citas (mascota_id, veterinario_id, fecha, tipo, estado, observaciones)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.mascota_id,
      data.veterinario_id,
      data.fecha,
      data.tipo,
      data.estado || 'programada',
      data.observaciones || null
    ]
  );

  return result.rows[0];
}

async function actualizar(id, data) {
  const result = await db.query(
    `UPDATE citas
     SET mascota_id = $1,
         veterinario_id = $2,
         fecha = $3,
         tipo = $4,
         estado = $5,
         observaciones = $6
     WHERE id = $7
     RETURNING *`,
    [
      data.mascota_id,
      data.veterinario_id,
      data.fecha,
      data.tipo,
      data.estado || 'programada',
      data.observaciones || null,
      id
    ]
  );

  return result.rows[0];
}

async function eliminar(id) {
  const result = await db.query(
    'DELETE FROM citas WHERE id = $1 RETURNING id',
    [id]
  );

  return result.rowCount > 0;
}

async function existeMascota(id) {
  const result = await db.query(
    'SELECT id FROM mascotas WHERE id = $1',
    [id]
  );
  return result.rowCount > 0;
}

async function existeVeterinario(id) {
  const result = await db.query(
    'SELECT id FROM veterinarios WHERE id = $1',
    [id]
  );
  return result.rowCount > 0;
}

async function existeSolape(veterinarioId, fecha, citaId = null) {
  let query = `
    SELECT id
    FROM citas
    WHERE veterinario_id = $1
      AND fecha = $2
      AND estado <> 'cancelada'
  `;
  const params = [veterinarioId, fecha];

  if (citaId) {
    query += ' AND id <> $3';
    params.push(citaId);
  }

  const result = await db.query(query, params);
  return result.rowCount > 0;
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  existeMascota,
  existeVeterinario,
  existeSolape
};
