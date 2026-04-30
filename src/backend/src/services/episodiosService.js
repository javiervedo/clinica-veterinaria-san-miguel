const repository = require('../repositories/episodiosRepository');

function validarEpisodio(data) {
  if (!data.mascota_id) {
    throw new Error('La mascota es obligatoria');
  }

  if (!data.veterinario_id) {
    throw new Error('El veterinario es obligatorio');
  }

  if (!data.motivo_consulta || data.motivo_consulta.trim() === '') {
    throw new Error('El motivo de consulta es obligatorio');
  }
}

async function obtenerTodos() {
  return repository.obtenerTodos();
}

async function crear(data) {
  validarEpisodio(data);

  const mascotaExiste = await repository.existeMascota(data.mascota_id);
  if (!mascotaExiste) {
    throw new Error('La mascota indicada no existe');
  }

  const veterinarioExiste = await repository.existeVeterinario(data.veterinario_id);
  if (!veterinarioExiste) {
    throw new Error('El veterinario indicado no existe');
  }

  return repository.crear(data);
}

module.exports = {
  obtenerTodos,
  crear
};
