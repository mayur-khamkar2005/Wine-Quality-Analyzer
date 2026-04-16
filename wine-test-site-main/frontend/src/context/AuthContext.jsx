import { createContext, useEffect, useState } from 'react';

import { AUTH_UNAUTHORIZED_EVENT } from '../api/client.js';
import { getCurrentUser, loginUser, registerUser } from '../api/auth.api.js';

const STORAGE_KEY = 'wine-quality-token';
const USER_KEY = 'wine-quality-user';

const initialState = {
  user: null,
  token: '',
  isAuthenticated: false,
  isLoading: true,
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialState);

  const setSignedOutState = () => {
    setAuthState({
      ...initialState,
      isLoading: false,
    });
  };

  const persistSession = ({ user, token }) => {
    try {
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (storageError) {
      console.error('Failed to persist session to localStorage:', storageError);
    }

    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const clearSession = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (storageError) {
      console.error('Failed to clear session from localStorage:', storageError);
    }
    setSignedOutState();
  };

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const token = localStorage.getItem(STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!token) {
        if (isMounted) {
          setSignedOutState();
        }
        return;
      }

      if (storedUser && isMounted) {
        try {
          const parsedUser = JSON.parse(storedUser);

          setAuthState({
            user: parsedUser,
            token,
            isAuthenticated: true,
            isLoading: true,
          });
        } catch (error) {
          localStorage.removeItem(USER_KEY);
        }
      }

      try {
        const response = await getCurrentUser();
        if (isMounted) {
          persistSession({
            user: response.data.user,
            token,
          });
        }
      } catch (error) {
        if (isMounted) {
          clearSession();
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }
      persistSession(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const response = await registerUser(payload);
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }
      persistSession(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
