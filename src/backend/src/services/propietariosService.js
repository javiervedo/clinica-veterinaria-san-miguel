const repository = require('../repositories/propietariosRepository');

function validarPropietario(data) {
  if (!data.nombre || data.nombre.trim() === '') {
    throw new Error('El nombre es obligatorio');
  }

  if (!data.telefono || data.telefono.trim() === '') {
    throw new Error('El teléfono es obligatorio');
  }
}

async function obtenerTodos() {
  return repository.obtenerTodos();
}

async function obtenerPorId(id) {
  return repository.obtenerPorId(id);
}

async function crear(data) {
  validarPropietario(data);
  return repository.crear(data);
}

async function actualizar(id, data) {
  validarPropietario(data);
  return repository.actualizar(id, data);
}

async function eliminar(id) {
  return repository.eliminar(id);
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
