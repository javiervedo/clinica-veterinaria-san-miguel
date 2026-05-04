const db = require('../config/db');

async function obtenerTodos() {
  // SQLite: tratamientos cuelga directamente de mascota_id
  const result = await db.query(`
    SELECT
      t.*,
      m.nombre AS mascota_nombre
    FROM tratamientos t
    INNER JOIN mascotas m ON m.id = t.mascota_id
    ORDER BY t.id DESC
  `);

  return result.rows;
}

async function crear(data) {
  const result = await db.query(
    `INSERT INTO tratamientos
      (mascota_id, fecha_inicio, fecha_fin, medicamento, dosis, frecuencia, observaciones)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.mascota_id,
      data.fecha_inicio,
      data.fecha_fin || null,
      data.medicamento || data.nombre,
      data.dosis || null,
      data.frecuencia || data.pauta || null,
      data.observaciones || null
    ]
  );

  return result.rows[0];
}

async function existeEpisodio(id) {
  // En SQLite no existe episodios_clinicos ni episodio_id.
  // Mantenemos la firma para no romper el service y devolvemos true si viene null/undefined.
  // Si viene un id numérico, lo consideramos inválido en modo SQLite.
  if (id === null || id === undefined) return true;
  return false;
}

module.exports = {
  obtenerTodos,
  crear,
  existeEpisodio
};
