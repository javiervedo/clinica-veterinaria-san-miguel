import { useMemo } from 'react';

import { buildApi } from '../../api/index.js';
import { useAuth } from '../../state/AuthContext.jsx';
import { CrudListPage } from '../CrudListPage.jsx';

export function TratamientosPage() {
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
      title="Tratamientos"
      description="Tratamientos prolongados asociados a mascotas."
      service={api.tratamientos}
      makeEmpty={() => ({ mascota_id: '', nombre: '', dosis: '', fecha_inicio: '', fecha_fin: '' })}
      columns={[
        { key: 'id', header: 'ID' },
        { key: 'mascota_id', header: 'Mascota ID', editable: true },
        { key: 'nombre', header: 'Nombre', editable: true },
        { key: 'dosis', header: 'Dosis', editable: true },
        { key: 'fecha_inicio', header: 'Fecha inicio', editable: true },
        { key: 'fecha_fin', header: 'Fecha fin', editable: true }
      ]}
      mapFormToPayload={(f) => ({
        ...f,
        mascota_id: f?.mascota_id ? Number(f.mascota_id) : null
      })}
    />
  );
}
