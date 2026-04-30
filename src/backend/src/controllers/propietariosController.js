const service = require('../services/propietariosService');

async function obtenerTodos(req, res, next) {
  try {
    const propietarios = await service.obtenerTodos();
    res.json(propietarios);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const propietario = await service.obtenerPorId(req.params.id);

    if (!propietario) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    res.json(propietario);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const nuevoPropietario = await service.crear(req.body);
    res.status(201).json(nuevoPropietario);
  } catch (error) {
    if (error.message.includes('obligatorio')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const propietarioActualizado = await service.actualizar(req.params.id, req.body);

    if (!propietarioActualizado) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    res.json(propietarioActualizado);
  } catch (error) {
    if (error.message.includes('obligatorio')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const eliminado = await service.eliminar(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
