const pool = require('../config/db');

async function findByEmail(email) {
  const result = await pool.query(
    `SELECT id, nombre, email, password_hash, rol
     FROM usuarios
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
}

module.exports = {
  findByEmail
};
