const express = require('express');
const controller = require('../controllers/mascotasController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = express.Router();

// Lectura (general): admin/veterinario/auxiliar/administrativo
router.get(
  '/',
  auth,
  role('admin', 'veterinario', 'auxiliar', 'administrativo'),
  controller.obtenerTodas
);
router.get(
  '/:id',
  auth,
  role('admin', 'veterinario', 'auxiliar', 'administrativo'),
  controller.obtenerPorId
);

// Historial clínico: NO administrativo
router.get(
  '/:id/historial',
  auth,
  role('admin', 'veterinario', 'auxiliar'),
  controller.obtenerHistorial
);

// Escritura (datos administrativos): admin/auxiliar/administrativo
router.post('/', auth, role('admin', 'auxiliar', 'administrativo'), controller.crear);
router.put(
  '/:id',
  auth,
  role('admin', 'auxiliar', 'administrativo'),
  controller.actualizar
);
router.delete('/:id', auth, role('admin'), controller.eliminar);

module.exports = router;
