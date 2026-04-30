const service = require('../services/citasService');

async function obtenerTodas(req, res, next) {
  try {
    const citas = await service.obtenerTodas();
    res.json(citas);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const cita = await service.obtenerPorId(req.params.id);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.json(cita);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const cita = await service.crear(req.body);
    res.status(201).json(cita);
  } catch (error) {
    if (
      error.message.includes('obligatorio') ||
      error.message.includes('no existe') ||
      error.message.includes('ya tiene una cita')
    ) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const cita = await service.actualizar(req.params.id, req.body);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.json(cita);
  } catch (error) {
    if (
      error.message.includes('obligatorio') ||
      error.message.includes('no existe') ||
      error.message.includes('ya tiene una cita')
    ) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const eliminado = await service.eliminar(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
