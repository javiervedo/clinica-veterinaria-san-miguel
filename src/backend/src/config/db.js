require('dotenv').config();

const DB_CLIENT = (process.env.DB_CLIENT || 'pg').toLowerCase();

/**
 * This module exposes a minimal `query(sql, params)` API used by repositories.
 * It supports:
 * - PostgreSQL via `pg` (default)
 * - SQLite via `sqlite3` (when DB_CLIENT=sqlite)
 */
if (DB_CLIENT === 'sqlite') {
  const path = require('path');
  const sqlite3 = require('sqlite3').verbose();

  const dbFile =
    process.env.SQLITE_FILE ||
    path.join(process.cwd(), 'data', 'clinica.sqlite');

  // Ensure directory exists
  const fs = require('fs');
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });

  const db = new sqlite3.Database(dbFile);

  function query(sql, params = []) {
    const trimmed = String(sql).trim().toLowerCase();

    // SELECT-like queries
    if (
      trimmed.startsWith('select') ||
      trimmed.startsWith('with') ||
      trimmed.startsWith('pragma')
    ) {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          resolve({ rows: rows || [] });
        });
      });
    }

    // INSERT/UPDATE/DELETE
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({
          rows: [],
          rowCount: this.changes,
          lastID: this.lastID
        });
      });
    });
  }

  module.exports = {
    query,
    __client: 'sqlite',
    __dbFile: dbFile
  };
} else {
  const { Pool } = require('pg');

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  module.exports = pool;
}
