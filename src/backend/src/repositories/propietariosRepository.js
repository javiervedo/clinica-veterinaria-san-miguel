const db = require('../config/db');

async function obtenerTodos() {
  const result = await db.query(
    'SELECT * FROM propietarios ORDER BY id ASC'
  );
  return result.rows;
}

async function obtenerPorId(id) {
  const result = await db.query(
    'SELECT * FROM propietarios WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function crear({ nombre, telefono, email, direccion }) {
  const result = await db.query(
    `INSERT INTO propietarios (nombre, telefono, email, direccion)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [nombre, telefono, email || null, direccion || null]
  );
  return result.rows[0];
}

async function actualizar(id, { nombre, telefono, email, direccion }) {
  const result = await db.query(
    `UPDATE propietarios
     SET nombre = $1,
         telefono = $2,
         email = $3,
         direccion = $4
     WHERE id = $5
     RETURNING *`,
    [nombre, telefono, email || null, direccion || null, id]
  );
  return result.rows[0];
}

async function eliminar(id) {
  const result = await db.query(
    'DELETE FROM propietarios WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
