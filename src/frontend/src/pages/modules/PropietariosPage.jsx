import { useMemo } from 'react';

import { buildApi } from '../../api/index.js';
import { useAuth } from '../../state/AuthContext.jsx';
import { CrudListPage } from '../CrudListPage.jsx';

export function PropietariosPage() {
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
      title="Propietarios"
      description="Gestión de clientes / propietarios de mascotas."
      service={api.propietarios}
      makeEmpty={() => ({ nombre: '', telefono: '', email: '', direccion: '' })}
      columns={[
        { key: 'id', header: 'ID' },
        { key: 'nombre', header: 'Nombre', editable: true },
        { key: 'telefono', header: 'Teléfono', editable: true },
        { key: 'email', header: 'Email', editable: true },
        { key: 'direccion', header: 'Dirección', editable: true }
      ]}
    />
  );
}
