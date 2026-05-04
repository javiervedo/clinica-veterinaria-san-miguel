import { useMemo } from 'react';

import { buildApi } from '../../api/index.js';
import { useAuth } from '../../state/AuthContext.jsx';
import { CrudListPage } from '../CrudListPage.jsx';

export function EpisodiosPage() {
  const { token, logout } = useAuth();

  const api = useMemo(
    () =>
      buildApi({
        getToken: () => token,
        onUnauthorized: logout
      }),
    [token, logout]
  );

  return (
    <CrudListPage
      title="Episodios clínicos"
      description="Consultas y episodios asociados a mascotas (historial)."
      service={api.episodios}
      makeEmpty={() => ({ mascota_id: '', fecha: '', descripcion: '', veterinario: '' })}
      columns={[
        { key: 'id', header: 'ID' },
        { key: 'mascota_id', header: 'Mascota ID', editable: true },
        { key: 'fecha', header: 'Fecha', editable: true },
        { key: 'descripcion', header: 'Descripción', editable: true },
        { key: 'veterinario', header: 'Veterinario', editable: true }
      ]}
      mapFormToPayload={(f) => ({
        ...f,
        mascota_id: f?.mascota_id ? Number(f.mascota_id) : null
      })}
    />
  );
}
