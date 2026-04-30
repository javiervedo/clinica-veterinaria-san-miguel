const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosRepository = require('../repositories/usuariosRepository');

async function login({ email, password }) {
  const user = await usuariosRepository.findByEmail(email);

  if (!user) {
    return { ok: false, status: 401, error: 'Credenciales inválidas' };
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return { ok: false, status: 401, error: 'Credenciales inválidas' };
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return { ok: false, status: 500, error: 'JWT_SECRET no configurado' };
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '8h';

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombre: user.nombre
    },
    secret,
    { expiresIn }
  );

  return {
    ok: true,
    status: 200,
    data: {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    }
  };
}

module.exports = {
  login
};
