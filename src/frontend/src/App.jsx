import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { AppShell } from './layout/AppShell.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ForbiddenPage } from './pages/ForbiddenPage.jsx';

import { PropietariosPage } from './pages/modules/PropietariosPage.jsx';
import { MascotasPage } from './pages/modules/MascotasPage.jsx';
import { CitasPage } from './pages/modules/CitasPage.jsx';
import { EpisodiosPage } from './pages/modules/EpisodiosPage.jsx';
import { TratamientosPage } from './pages/modules/TratamientosPage.jsx';
import { RecordatoriosPage } from './pages/modules/RecordatoriosPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute roles={['admin', 'veterinario', 'auxiliar']} />}>
        <Route path="/app" element={<AppShell />}>
          <Route index element={<DashboardPage />} />

          <Route path="propietarios" element={<PropietariosPage />} />
          <Route path="mascotas" element={<MascotasPage />} />
          <Route path="citas" element={<CitasPage />} />

          <Route element={<ProtectedRoute roles={['admin', 'veterinario']} />}>
            <Route path="episodios" element={<EpisodiosPage />} />
            <Route path="tratamientos" element={<TratamientosPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin', 'auxiliar']} />}>
            <Route path="recordatorios" element={<RecordatoriosPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
