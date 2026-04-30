const service = require('../services/recordatoriosService');

async function obtenerTodos(req, res, next) {
  try {
    const recordatorios = await service.obtenerTodos();
    res.json(recordatorios);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const recordatorio = await service.crear(req.body);
    res.status(201).json(recordatorio);
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

module.exports = {
  obtenerTodos,
  crear
};
