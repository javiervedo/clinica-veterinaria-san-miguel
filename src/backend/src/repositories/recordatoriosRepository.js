const db = require('../config/db');

async function obtenerTodos() {
  const result = await db.query(`
    SELECT
      r.*,
      m.nombre AS mascota_nombre
    FROM recordatorios r
    INNER JOIN mascotas m ON m.id = r.mascota_id
    ORDER BY r.fecha_objetivo ASC
  `);

  return result.rows;
}

async function crear(data) {
  const result = await db.query(
    `INSERT INTO recordatorios
      (mascota_id, tipo, fecha_objetivo, estado, descripcion)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.mascota_id,
      data.tipo,
      data.fecha_objetivo,
      data.estado || 'pendiente',
      data.descripcion || null
    ]
  );

  return result.rows[0];
}

async function existeMascota(id) {
  const result = await db.query(
    'SELECT id FROM mascotas WHERE id = $1',
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  obtenerTodos,
  crear,
  existeMascota
};
