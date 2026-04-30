const db = require('../config/db');

async function obtenerTodos() {
  const result = await db.query(`
    SELECT
      t.*,
      ec.mascota_id
    FROM tratamientos t
    INNER JOIN episodios_clinicos ec ON ec.id = t.episodio_id
    ORDER BY t.id DESC
  `);

  return result.rows;
}

async function crear(data) {
  const result = await db.query(
    `INSERT INTO tratamientos
      (episodio_id, nombre, pauta, fecha_inicio, fecha_fin, estado)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.episodio_id,
      data.nombre,
      data.pauta,
      data.fecha_inicio,
      data.fecha_fin || null,
      data.estado || 'activo'
    ]
  );

  return result.rows[0];
}

async function existeEpisodio(id) {
  const result = await db.query(
    'SELECT id FROM episodios_clinicos WHERE id = $1',
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  obtenerTodos,
  crear,
  existeEpisodio
};
