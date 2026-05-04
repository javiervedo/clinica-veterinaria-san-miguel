const db = require('../config/db');

async function obtenerTodas() {
  // SQLite schema no tiene tabla "veterinarios"; guardamos el nombre directamente en c.veterinario
  const result = await db.query(`
    SELECT
      c.*,
      m.nombre AS mascota_nombre
    FROM citas c
    INNER JOIN mascotas m ON m.id = c.mascota_id
    ORDER BY c.fecha ASC
  `);

  return result.rows;
}

async function obtenerPorId(id) {
  const result = await db.query(
    `
    SELECT
      c.*,
      m.nombre AS mascota_nombre
    FROM citas c
    INNER JOIN mascotas m ON m.id = c.mascota_id
    WHERE c.id = $1
  `,
    [id]
  );

  return result.rows[0];
}

async function crear(data) {
  // Compatibilidad SQLite:
  // - En SQLite: tabla "citas" tiene columnas (mascota_id, fecha, motivo, veterinario, estado, notas)
  // - En Postgres (si existiera): podría existir veterinario_id/tipo/observaciones
  const result = await db.query(
    `INSERT INTO citas (mascota_id, fecha, motivo, veterinario, estado, notas)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.mascota_id,
      data.fecha,
      data.motivo || data.tipo || null,
      data.veterinario || null,
      data.estado || 'programada',
      data.notas || data.observaciones || null
    ]
  );

  return result.rows[0];
}

async function actualizar(id, data) {
  const result = await db.query(
    `UPDATE citas
     SET mascota_id = $1,
         fecha = $2,
         motivo = $3,
         veterinario = $4,
         estado = $5,
         notas = $6
     WHERE id = $7
     RETURNING *`,
    [
      data.mascota_id,
      data.fecha,
      data.motivo || data.tipo || null,
      data.veterinario || null,
      data.estado || 'programada',
      data.notas || data.observaciones || null,
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

async function existeVeterinario(nombre) {
  // En SQLite no hay tabla veterinarios. Validamos "algo" si viene informado.
  return Boolean(nombre && String(nombre).trim());
}

async function existeSolape(veterinario, fecha, citaId = null) {
  // En SQLite el veterinario se guarda como texto.
  let query = `
    SELECT id
    FROM citas
    WHERE veterinario = $1
      AND fecha = $2
      AND estado <> 'cancelada'
  `;
  const params = [veterinario, fecha];

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
