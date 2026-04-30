const express = require('express');
const controller = require('../controllers/recordatoriosController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = express.Router();

// Lectura: admin/veterinario/auxiliar
router.get('/', auth, role('admin', 'veterinario', 'auxiliar'), controller.obtenerTodos);

// Creación/gestión: admin/auxiliar
router.post('/', auth, role('admin', 'auxiliar'), controller.crear);

module.exports = router;
