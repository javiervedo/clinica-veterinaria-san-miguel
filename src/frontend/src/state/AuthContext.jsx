import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { readAuthStorage, writeAuthStorage } from './authStorage.js';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const initial = readAuthStorage();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);

  const setSession = useCallback((next) => {
    setToken(next?.token ?? null);
    setUser(next?.user ?? null);
    writeAuthStorage(next);
  }, []);

  const logout = useCallback(() => setSession(null), [setSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      setSession,
      logout
    }),
    [token, user, setSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export { AuthProvider, useAuth };
