import { useMemo } from 'react';

import { buildApi } from '../../api/index.js';
import { useAuth } from '../../state/AuthContext.jsx';
import { CrudListPage } from '../CrudListPage.jsx';

export function CitasPage() {
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
      title="Citas"
      description="Agenda de citas: creación, edición y eliminación."
      service={api.citas}
      makeEmpty={() => ({ fecha_hora: '', motivo: '', propietario_id: '', mascota_id: '', veterinario: '' })}
      columns={[
        { key: 'id', header: 'ID' },
        { key: 'fecha_hora', header: 'Fecha/Hora', editable: true },
        { key: 'motivo', header: 'Motivo', editable: true },
        { key: 'propietario_id', header: 'Propietario ID', editable: true },
        { key: 'mascota_id', header: 'Mascota ID', editable: true },
        { key: 'veterinario', header: 'Veterinario', editable: true }
      ]}
      mapFormToPayload={(f) => ({
        ...f,
        propietario_id: f?.propietario_id ? Number(f.propietario_id) : null,
        mascota_id: f?.mascota_id ? Number(f.mascota_id) : null
      })}
    />
  );
}
