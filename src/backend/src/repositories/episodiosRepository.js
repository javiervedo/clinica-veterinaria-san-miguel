const db = require('../config/db');

async function obtenerTodos() {
  // SQLite: la tabla se llama "episodios" y no hay tabla "veterinarios"
  const result = await db.query(`
    SELECT
      e.*,
      m.nombre AS mascota_nombre
    FROM episodios e
    INNER JOIN mascotas m ON m.id = e.mascota_id
    ORDER BY e.fecha DESC
  `);

  return result.rows;
}

async function crear(data) {
  const result = await db.query(
    `INSERT INTO episodios
      (mascota_id, fecha, descripcion, diagnostico, notas)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.mascota_id,
      data.fecha,
      data.descripcion || data.motivo_consulta || null,
      data.diagnostico || null,
      data.notas || data.observaciones || null
    ]
  );

  return result.rows[0];
}

async function existeMascota(id) {
  const result = await db.query('SELECT id FROM mascotas WHERE id = $1', [id]);
  return result.rowCount > 0;
}

async function existeVeterinario(nombre) {
  // En SQLite no existe tabla veterinarios.
  return Boolean(nombre && String(nombre).trim());
}

module.exports = {
  obtenerTodos,
  crear,
  existeMascota,
  existeVeterinario
};
