const usuariosRepository = require('../src/repositories/usuariosRepository');

(async () => {
  const email = process.argv[2] || 'admin@sanmiguel.com';
  const user = await usuariosRepository.findByEmail(email);
  console.log(user);
})();
