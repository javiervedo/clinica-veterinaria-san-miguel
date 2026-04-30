const repository = require('../repositories/tratamientosRepository');

function validarTratamiento(data) {
  if (!data.episodio_id) {
    throw new Error('El episodio es obligatorio');
  }

  if (!data.nombre || data.nombre.trim() === '') {
    throw new Error('El nombre del tratamiento es obligatorio');
  }

  if (!data.pauta || data.pauta.trim() === '') {
    throw new Error('La pauta es obligatoria');
  }

  if (!data.fecha_inicio) {
    throw new Error('La fecha de inicio es obligatoria');
  }
}

async function obtenerTodos() {
  return repository.obtenerTodos();
}

async function crear(data) {
  validarTratamiento(data);

  const episodioExiste = await repository.existeEpisodio(data.episodio_id);
  if (!episodioExiste) {
    throw new Error('El episodio indicado no existe');
  }

  return repository.crear(data);
}

module.exports = {
  obtenerTodos,
  crear
};
