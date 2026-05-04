import { useMemo } from 'react';

import { buildApi } from '../../api/index.js';
import { useAuth } from '../../state/AuthContext.jsx';
import { CrudListPage } from '../CrudListPage.jsx';

export function RecordatoriosPage() {
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
      title="Recordatorios"
      description="Recordatorios de vacunas, revisiones y seguimiento."
      service={api.recordatorios}
      makeEmpty={() => ({ mascota_id: '', tipo: '', fecha_programada: '', mensaje: '' })}
      columns={[
        { key: 'id', header: 'ID' },
        { key: 'mascota_id', header: 'Mascota ID', editable: true },
        { key: 'tipo', header: 'Tipo', editable: true },
        { key: 'fecha_programada', header: 'Fecha programada', editable: true },
        { key: 'mensaje', header: 'Mensaje', editable: true }
      ]}
      mapFormToPayload={(f) => ({
        ...f,
        mascota_id: f?.mascota_id ? Number(f.mascota_id) : null
      })}
    />
  );
}
