const express = require('express');
const controller = require('../controllers/propietariosController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = express.Router();

// Lectura: admin/veterinario/auxiliar/administrativo
router.get(
  '/',
  auth,
  role('admin', 'veterinario', 'auxiliar', 'administrativo'),
  controller.obtenerTodos
);
router.get(
  '/:id',
  auth,
  role('admin', 'veterinario', 'auxiliar', 'administrativo'),
  controller.obtenerPorId
);

// Escritura: admin/auxiliar/administrativo
router.post('/', auth, role('admin', 'auxiliar', 'administrativo'), controller.crear);
router.put(
  '/:id',
  auth,
  role('admin', 'auxiliar', 'administrativo'),
  controller.actualizar
);
router.delete('/:id', auth, role('admin'), controller.eliminar);

module.exports = router;
