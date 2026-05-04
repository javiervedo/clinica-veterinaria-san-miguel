const bcrypt = require('bcrypt');

(async () => {
  const password = process.argv[2] || 'admin123';
  const rounds = Number(process.argv[3] || 10);
  const hash = await bcrypt.hash(password, rounds);
  console.log(hash);
})();
