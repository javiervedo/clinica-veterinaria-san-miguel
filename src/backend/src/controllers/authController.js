const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'email y password son obligatorios' });
    }

    const result = await authService.login({ email, password });

    if (!result.ok) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json(result.data);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  login
};
