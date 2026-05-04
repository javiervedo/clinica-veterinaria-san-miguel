require('dotenv').config();

process.env.DB_CLIENT = process.env.DB_CLIENT || 'sqlite';

const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function runSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');

  // Naive splitter by ';' for our simple schema/seed files.
  // It ignores empty statements.
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await db.query(stmt);
  }
}

(async () => {
  try {
    if (db.__client !== 'sqlite') {
      console.error(
        'This init script is for SQLite only. Set DB_CLIENT=sqlite in src/backend/.env'
      );
      process.exit(1);
    }

    const schemaFile = path.resolve(
      process.cwd(),
      '..',
      '..',
      'database',
      'schema.sqlite.sql'
    );
    const seedFile = path.resolve(
      process.cwd(),
      '..',
      '..',
      'database',
      'seed.sqlite.sql'
    );

    console.log('SQLite file:', db.__dbFile);
    console.log('Applying schema:', schemaFile);
    await runSqlFile(schemaFile);
    console.log('Applying seed:', seedFile);
    await runSqlFile(seedFile);

    console.log('SQLite init OK');
    process.exit(0);
  } catch (e) {
    console.error('SQLite init ERROR:', e);
    process.exit(1);
  }
})();
