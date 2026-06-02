import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('jobtrackr_token'));
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token));

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        localStorage.removeItem('jobtrackr_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    loadUser();
  }, [token]);

  const persistSession = (data) => {
    localStorage.setItem('jobtrackr_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persistSession(data);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistSession(data);
  };

  const demoLogin = async () => {
    const { data } = await api.post('/auth/demo');
    persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem('jobtrackr_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch('/users/profile', payload);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isBootstrapping,
      login,
      register,
      demoLogin,
      logout,
      updateProfile
    }),
    [user, token, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
