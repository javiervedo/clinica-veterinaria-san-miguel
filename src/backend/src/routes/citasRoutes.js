const express = require('express');
const controller = require('../controllers/citasController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = express.Router();

// Lectura: admin/veterinario/auxiliar/administrativo
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

// Escritura/gestión:
// - admin: todo
// - veterinario/auxiliar: crear/actualizar
// - administrativo: crear/actualizar (gestión de agenda)
router.post(
  '/',
  auth,
  role('admin', 'veterinario', 'auxiliar', 'administrativo'),
  controller.crear
);
router.put(
  '/:id',
  auth,
  role('admin', 'veterinario', 'auxiliar', 'administrativo'),
  controller.actualizar
);
router.delete('/:id', auth, role('admin'), controller.eliminar);

module.exports = router;
