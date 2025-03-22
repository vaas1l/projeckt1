
import { Navigate } from 'react-router-dom';
import { checkAuth } from '../api/auth';
import { useAuthStoreActions } from '../stores/auth';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const GuestGuard = ({ children }) => {
  const { login, logout } = useAuthStoreActions();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authentication = await checkAuth();

        if (authentication?.success && authentication?.user) {
          login(authentication.user);
          setIsAuthenticated(true);
        } else {
          logout();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(error.message);
        logout();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [login, logout]);

  if (loading) {
    return <p>Loader</p>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;