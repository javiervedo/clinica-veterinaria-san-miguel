const express = require('express');
const controller = require('../controllers/propietariosController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = express.Router();

// Lectura: admin/veterinario/auxiliar
router.get('/', auth, role('admin', 'veterinario', 'auxiliar'), controller.obtenerTodos);
router.get('/:id', auth, role('admin', 'veterinario', 'auxiliar'), controller.obtenerPorId);

// Escritura: admin/auxiliar
router.post('/', auth, role('admin', 'auxiliar'), controller.crear);
router.put('/:id', auth, role('admin', 'auxiliar'), controller.actualizar);
router.delete('/:id', auth, role('admin'), controller.eliminar);

module.exports = router;
