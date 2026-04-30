const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20, // 20 intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos, inténtalo de nuevo más tarde' }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 * response: { token, user }
 */
router.post('/login', loginLimiter, authController.login);

module.exports = router;
