const repository = require('../repositories/recordatoriosRepository');

function validarRecordatorio(data) {
  if (!data.mascota_id) {
    throw new Error('La mascota es obligatoria');
  }

  if (!data.tipo || data.tipo.trim() === '') {
    throw new Error('El tipo es obligatorio');
  }

  if (!data.fecha_objetivo) {
    throw new Error('La fecha objetivo es obligatoria');
  }
}

async function obtenerTodos() {
  return repository.obtenerTodos();
}

async function crear(data) {
  validarRecordatorio(data);

  const mascotaExiste = await repository.existeMascota(data.mascota_id);
  if (!mascotaExiste) {
    throw new Error('La mascota indicada no existe');
  }

  return repository.crear(data);
}

module.exports = {
  obtenerTodos,
  crear
};
