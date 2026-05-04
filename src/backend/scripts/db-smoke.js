const db = require('../src/config/db');

(async () => {
  try {
    // Works in both Postgres and SQLite
    const r = await db.query("SELECT datetime('now') as now");
    console.log('DB OK:', r.rows[0]);
    process.exit(0);
  } catch (e) {
    console.error('DB ERROR:', e);
    process.exit(1);
  }
})();
