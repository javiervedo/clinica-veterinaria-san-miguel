const express = require('express');
const controller = require('../controllers/episodiosController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = express.Router();

// Lectura: admin/veterinario/auxiliar
router.get('/', auth, role('admin', 'veterinario', 'auxiliar'), controller.obtenerTodos);

// Escritura clínica: admin/veterinario
router.post('/', auth, role('admin', 'veterinario'), controller.crear);

module.exports = router;
