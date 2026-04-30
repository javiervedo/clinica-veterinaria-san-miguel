const db = require('../config/db');

async function obtenerTodos() {
  const result = await db.query(`
    SELECT
      ec.*,
      m.nombre AS mascota_nombre,
      v.nombre AS veterinario_nombre
    FROM episodios_clinicos ec
    INNER JOIN mascotas m ON m.id = ec.mascota_id
    INNER JOIN veterinarios v ON v.id = ec.veterinario_id
    ORDER BY ec.fecha DESC
  `);

  return result.rows;
}

async function crear(data) {
  const result = await db.query(
    `INSERT INTO episodios_clinicos
      (mascota_id, veterinario_id, cita_id, motivo_consulta, sintomas, diagnostico, observaciones)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.mascota_id,
      data.veterinario_id,
      data.cita_id || null,
      data.motivo_consulta,
      data.sintomas || null,
      data.diagnostico || null,
      data.observaciones || null
    ]
  );

  return result.rows[0];
}

async function existeMascota(id) {
  const result = await db.query('SELECT id FROM mascotas WHERE id = $1', [id]);
  return result.rowCount > 0;
}

async function existeVeterinario(id) {
  const result = await db.query('SELECT id FROM veterinarios WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = {
  obtenerTodos,
  crear,
  existeMascota,
  existeVeterinario
};
