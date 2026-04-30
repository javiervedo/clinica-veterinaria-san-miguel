const service = require('../services/mascotasService');

async function obtenerTodas(req, res, next) {
  try {
    const mascotas = await service.obtenerTodas();
    res.json(mascotas);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const mascota = await service.obtenerPorId(req.params.id);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    res.json(mascota);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const mascota = await service.crear(req.body);
    res.status(201).json(mascota);
  } catch (error) {
    if (
      error.message.includes('obligatorio') ||
      error.message.includes('no existe')
    ) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const mascota = await service.actualizar(req.params.id, req.body);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    res.json(mascota);
  } catch (error) {
    if (
      error.message.includes('obligatorio') ||
      error.message.includes('no existe')
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
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function obtenerHistorial(req, res, next) {
  try {
    const historial = await service.obtenerHistorial(req.params.id);
    res.json(historial);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  obtenerHistorial
};
