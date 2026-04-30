const service = require('../services/tratamientosService');

async function obtenerTodos(req, res, next) {
  try {
    const tratamientos = await service.obtenerTodos();
    res.json(tratamientos);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const tratamiento = await service.crear(req.body);
    res.status(201).json(tratamiento);
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
