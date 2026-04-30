const repository = require('../repositories/citasRepository');

function validarCita(data) {
  if (!data.mascota_id) {
    throw new Error('La mascota es obligatoria');
  }

  if (!data.veterinario_id) {
    throw new Error('El veterinario es obligatorio');
  }

  if (!data.fecha) {
    throw new Error('La fecha es obligatoria');
  }

  if (!data.tipo || data.tipo.trim() === '') {
    throw new Error('El tipo es obligatorio');
  }
}

async function obtenerTodas() {
  return repository.obtenerTodas();
}

async function obtenerPorId(id) {
  return repository.obtenerPorId(id);
}

async function crear(data) {
  validarCita(data);

  const mascotaExiste = await repository.existeMascota(data.mascota_id);
  if (!mascotaExiste) {
    throw new Error('La mascota indicada no existe');
  }

  const veterinarioExiste = await repository.existeVeterinario(data.veterinario_id);
  if (!veterinarioExiste) {
    throw new Error('El veterinario indicado no existe');
  }

  const existeSolape = await repository.existeSolape(data.veterinario_id, data.fecha);
  if (existeSolape) {
    throw new Error('El veterinario ya tiene una cita asignada en esa franja horaria');
  }

  return repository.crear(data);
}

async function actualizar(id, data) {
  validarCita(data);

  const mascotaExiste = await repository.existeMascota(data.mascota_id);
  if (!mascotaExiste) {
    throw new Error('La mascota indicada no existe');
  }

  const veterinarioExiste = await repository.existeVeterinario(data.veterinario_id);
  if (!veterinarioExiste) {
    throw new Error('El veterinario indicado no existe');
  }

  const existeSolape = await repository.existeSolape(data.veterinario_id, data.fecha, id);
  if (existeSolape) {
    throw new Error('El veterinario ya tiene una cita asignada en esa franja horaria');
  }

  return repository.actualizar(id, data);
}

async function eliminar(id) {
  return repository.eliminar(id);
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
