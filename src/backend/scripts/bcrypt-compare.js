const bcrypt = require('bcrypt');

(async () => {
  const plain = process.argv[2] || 'admin123';
  const hash =
    process.argv[3] ||
    '$2b$10$y7yLvoZHornN.ZpXm9j1fOIvcgoguZZYOOVnEdBlQiR7asVE3BfRy';

  const ok = await bcrypt.compare(plain, hash);
  console.log(ok ? 'MATCH' : 'NO_MATCH');
})();
