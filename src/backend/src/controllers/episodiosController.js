const service = require('../services/episodiosService');

async function obtenerTodos(req, res, next) {
  try {
    const episodios = await service.obtenerTodos();
    res.json(episodios);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const episodio = await service.crear(req.body);
    res.status(201).json(episodio);
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
