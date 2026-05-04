/* eslint-disable no-console */
require('dotenv').config();

const path = require('path');
const Database = require('better-sqlite3');

/**
 * Adds demo users to the local SQLite DB used by the backend.
 *
 * Goal: allow testing role-based access without modifying seed files.
 *
 * Usage:
 *   node scripts/sqlite-add-demo-users.js
 *
 * Notes:
 * - Uses INSERT OR IGNORE so it is idempotent.
 * - Default SQLite file follows the backend default: ./data/clinica.sqlite
 */

const sqliteFile = process.env.SQLITE_FILE || path.resolve(__dirname, '..', 'data', 'clinica.sqlite');

const demoUsers = [
  {
    nombre: 'Veterinario Demo',
    email: 'vet@sanmiguel.com',
    password: 'vet123',
    // bcrypt hash for 'vet123' (10 rounds)
    password_hash: '$2b$10$BoOT7gTSbDKSgYK54sXMYOkMcETmu5m6PymtMZ.JWymIeMTiyVvQq',
    rol: 'veterinario'
  },
  {
    nombre: 'Auxiliar Demo',
    email: 'aux@sanmiguel.com',
    password: 'aux123',
    // bcrypt hash for 'aux123' (10 rounds)
    password_hash: '$2b$10$X5R7.wUBZr8lzaI1bGe33O.21MP8H0lpiECyNGoRKhObQRA3r1Bvi',
    rol: 'auxiliar'
  },
  {
    nombre: 'Administrativo Demo',
    email: 'admini@sanmiguel.com',
    password: 'admini123',
    // bcrypt hash for 'admini123' (10 rounds)
    password_hash: '$2b$10$VdFr674P/swsB3L21g0auevRM7tSFSRI56rcBdNDOX/Jn2/fVWzKe',
    rol: 'administrativo'
  }
];

function main() {
  console.log('SQLite file:', sqliteFile);

  const db = new Database(sqliteFile);
  db.pragma('foreign_keys = ON');

  const stmt = db.prepare(
    'INSERT OR IGNORE INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)'
  );

  const tx = db.transaction(() => {
    for (const u of demoUsers) {
      stmt.run(u.nombre, u.email, u.password_hash, u.rol);
    }
  });

  tx();

  const rows = db.prepare('SELECT id, nombre, email, rol FROM usuarios ORDER BY id').all();
  console.table(rows);

  console.log('\nDemo credentials:');
  for (const u of demoUsers) {
    console.log(`- ${u.rol}: ${u.email} / ${u.password}`);
  }
}

main();
