import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = 'jobtrackr_token';
const AUTH_TIMEOUT = 20000; // 20 seconds

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem(AUTH_TOKEN_KEY)
  );

  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token));
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      // No token = no authentication check needed
      if (!token) {
        if (isMounted) {
          setUser(null);
          setAuthError(null);
          setIsBootstrapping(false);
        }
        return;
      }

      if (isMounted) {
        setIsBootstrapping(true);
        setAuthError(null);
      }

      try {
        /*
         * Render can take some time to wake up after inactivity.
         * Give the backend up to 20 seconds to respond.
         */
        const { data } = await api.get('/auth/me', {
          timeout: AUTH_TIMEOUT
        });

        if (!isMounted) return;

        setUser(data.user);
        setAuthError(null);
      } catch (error) {
        if (!isMounted) return;

        console.error('Failed to restore authentication session:', error);

        /*
         * IMPORTANT:
         *
         * Only remove the token when the backend explicitly says
         * that the token is invalid/unauthorized.
         *
         * Do NOT delete the token just because Render is sleeping,
         * unavailable, or the request timed out.
         */
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setToken(null);
          setUser(null);
          setAuthError('Your session has expired. Please log in again.');
        } else {
          /*
           * Backend unavailable / Render cold start / network problem.
           * Keep the token so the user can retry without logging in again.
           */
          setAuthError(
            'Unable to connect to the server. The server may be waking up.'
          );
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const persistSession = (data) => {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);

    setToken(data.token);
    setUser(data.user);
    setAuthError(null);
    setIsBootstrapping(false);
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persistSession(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistSession(data);
    return data;
  };

  const demoLogin = async () => {
    const { data } = await api.post('/auth/demo');
    persistSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);

    setToken(null);
    setUser(null);
    setAuthError(null);
    setIsBootstrapping(false);
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

      /*
       * User + token means the authentication request
       * has successfully completed.
       */
      isAuthenticated: Boolean(user && token),

      /*
       * True only while we are initially checking /auth/me.
       */
      isBootstrapping,

      /*
       * Useful for showing a proper error/retry UI instead
       * of an infinite skeleton.
       */
      authError,

      login,
      register,
      demoLogin,
      logout,
      updateProfile
    }),
    [
      user,
      token,
      isBootstrapping,
      authError
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};