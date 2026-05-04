const authService = require('../src/services/authService');

(async () => {
  const email = process.argv[2] || 'admin@sanmiguel.com';
  const password = process.argv[3] || 'admin123';

  const result = await authService.login({ email, password });
  console.log(JSON.stringify(result, null, 2));
})();
