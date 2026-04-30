const repository = require('../repositories/mascotasRepository');

function validarMascota(data) {
  if (!data.propietario_id) {
    throw new Error('El propietario es obligatorio');
  }

  if (!data.nombre || data.nombre.trim() === '') {
    throw new Error('El nombre es obligatorio');
  }

  if (!data.especie || data.especie.trim() === '') {
    throw new Error('La especie es obligatoria');
  }
}

async function obtenerTodas() {
  return repository.obtenerTodas();
}

async function obtenerPorId(id) {
  return repository.obtenerPorId(id);
}

async function crear(data) {
  validarMascota(data);

  const propietarioExiste = await repository.existePropietario(data.propietario_id);
  if (!propietarioExiste) {
    throw new Error('El propietario indicado no existe');
  }

  return repository.crear(data);
}

async function actualizar(id, data) {
  validarMascota(data);

  const propietarioExiste = await repository.existePropietario(data.propietario_id);
  if (!propietarioExiste) {
    throw new Error('El propietario indicado no existe');
  }

  return repository.actualizar(id, data);
}

async function eliminar(id) {
  return repository.eliminar(id);
}

async function obtenerHistorial(id) {
  return repository.obtenerHistorial(id);
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  obtenerHistorial
};
