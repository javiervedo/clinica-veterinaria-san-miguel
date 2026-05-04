import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

function hasRole(user, roles) {
  if (!roles || roles.length === 0) return true;
  return roles.includes(user?.rol);
}

export function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole(user, roles)) return <Navigate to="/forbidden" replace />;

  return <Outlet />;
}
