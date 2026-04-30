const express = require('express');
const controller = require('../controllers/mascotasController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = express.Router();

// Lectura: admin/veterinario/auxiliar
router.get('/', auth, role('admin', 'veterinario', 'auxiliar'), controller.obtenerTodas);
router.get('/:id', auth, role('admin', 'veterinario', 'auxiliar'), controller.obtenerPorId);
router.get('/:id/historial', auth, role('admin', 'veterinario', 'auxiliar'), controller.obtenerHistorial);

// Escritura: admin/auxiliar
router.post('/', auth, role('admin', 'auxiliar'), controller.crear);
router.put('/:id', auth, role('admin', 'auxiliar'), controller.actualizar);
router.delete('/:id', auth, role('admin'), controller.eliminar);

module.exports = router;
