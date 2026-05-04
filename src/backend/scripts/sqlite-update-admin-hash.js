const sqlite3 = require('sqlite3').verbose();

(async () => {
  const file = process.env.SQLITE_FILE || './data/clinica.sqlite';
  const email = process.argv[2] || 'admin@sanmiguel.com';
  const hash =
    process.argv[3] ||
    '$2b$10$y7yLvoZHornN.ZpXm9j1fOIvcgoguZZYOOVnEdBlQiR7asVE3BfRy';

  const db = new sqlite3.Database(file);

  db.run(
    'UPDATE usuarios SET password_hash = ? WHERE email = ?',
    [hash, email],
    function (err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log('UPDATED', this.changes);
      db.close();
    }
  );
})();
