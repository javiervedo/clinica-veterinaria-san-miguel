import { useMemo } from 'react';

import { buildApi } from '../../api/index.js';
import { useAuth } from '../../state/AuthContext.jsx';
import { CrudListPage } from '../CrudListPage.jsx';

export function MascotasPage() {
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
      title="Mascotas"
      description="Gestión de pacientes (mascotas) asociadas a propietarios."
      service={api.mascotas}
      makeEmpty={() => ({ nombre: '', especie: '', raza: '', fecha_nacimiento: '', propietario_id: '' })}
      columns={[
        { key: 'id', header: 'ID' },
        { key: 'nombre', header: 'Nombre', editable: true },
        { key: 'especie', header: 'Especie', editable: true },
        { key: 'raza', header: 'Raza', editable: true },
        { key: 'fecha_nacimiento', header: 'Fecha nacimiento', editable: true },
        { key: 'propietario_id', header: 'Propietario ID', editable: true }
      ]}
      mapFormToPayload={(f) => ({
        ...f,
        propietario_id: f?.propietario_id ? Number(f.propietario_id) : null
      })}
    />
  );
}
