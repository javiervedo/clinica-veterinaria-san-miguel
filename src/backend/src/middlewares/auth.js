const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación JWT.
 * - Espera header: Authorization: Bearer <token>
 * - Si es válido: expone req.user = { id, email, rol, nombre }
 */
module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const token = header.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({ error: 'JWT_SECRET no configurado' });
    }

    const payload = jwt.verify(token, secret);

    req.user = {
      id: payload.id,
      email: payload.email,
      rol: payload.rol,
      nombre: payload.nombre
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
