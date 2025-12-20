import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Admin credentials (in real app, this would be handled by backend)
const ADMIN_CREDENTIALS = {
  email: 'admin@wonderfashions.com',
  password: 'admin123'
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [savedAuth, setSavedAuth] = useLocalStorage('wonderfashions_auth', null);
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    if (savedAuth && savedAuth.isLoggedIn) {
      setAdmin(savedAuth.admin);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [savedAuth]);

  // Login function
  const login = (email, password) => {
    setError(null);
    setLoading(true);

    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          email === ADMIN_CREDENTIALS.email &&
          password === ADMIN_CREDENTIALS.password
        ) {
          const adminData = {
            id: 1,
            name: 'Admin User',
            email: email,
            role: 'admin',
            avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=c026d3&color=fff'
          };

          setAdmin(adminData);
          setIsAuthenticated(true);
          setSavedAuth({ isLoggedIn: true, admin: adminData });
          setLoading(false);
          resolve(adminData);
        } else {
          const errorMessage = 'Invalid email or password';
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        }
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    setSavedAuth(null);
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if user has admin access
  const hasAdminAccess = () => {
    return isAuthenticated && admin?.role === 'admin';
  };

  // Update admin profile
  const updateProfile = (profileData) => {
    const updatedAdmin = { ...admin, ...profileData };
    setAdmin(updatedAdmin);
    setSavedAuth({ isLoggedIn: true, admin: updatedAdmin });
  };

  // Change password (simulated)
  const changePassword = (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentPassword === ADMIN_CREDENTIALS.password) {
          // In real app, this would update the password in the backend
          resolve({ success: true, message: 'Password changed successfully' });
        } else {
          reject(new Error('Current password is incorrect'));
        }
      }, 1000);
    });
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
    hasAdminAccess,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;