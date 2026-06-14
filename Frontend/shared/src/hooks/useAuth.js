import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = useCallback((credentials) => {
    dispatch({ type: 'auth/setCredentials', payload: credentials });
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch({ type: 'auth/logout' });
  }, [dispatch]);

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login,
    logout,
  };
};

export default useAuth;
