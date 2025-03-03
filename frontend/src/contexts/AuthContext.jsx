import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_BASE_URL;

  // Set up axios interceptors
  useEffect(() => {
    // Configure axios defaults
    axios.defaults.baseURL = API_URL;
    
    // Add token to all requests
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401 responses
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Logout if we get 401 Unauthorized from API
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, API_URL]);

  // Load user on initial render or when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/auth/me`);
        setUser(response.data.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setError('Sessão expirada. Por favor, faça login novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token, API_URL]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data.data;
      
      // Save to local storage
      localStorage.setItem('token', newToken);
      
      // Update state
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      
      let errorMessage = 'Falha no login. Por favor, tente novamente.';
      
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      const { token: newToken, user: newUser } = response.data.data;
      
      // Save to local storage
      localStorage.setItem('token', newToken);
      
      // Update state
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      
      return newUser;
    } catch (err) {
      console.error('Registration failed:', err);
      
      let errorMessage = 'Falha no registro. Por favor, tente novamente.';
      
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    
    // Update state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_URL}/users/profile`, profileData);
      
      const updatedUser = response.data.data;
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      console.error('Update profile failed:', err);
      
      let errorMessage = 'Falha ao atualizar perfil. Por favor, tente novamente.';
      
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(`${API_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      });
      
      return true;
    } catch (err) {
      console.error('Change password failed:', err);
      
      let errorMessage = 'Falha ao alterar senha. Por favor, tente novamente.';
      
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return true;
    } catch (err) {
      console.error('Request password reset failed:', err);
      
      let errorMessage = 'Falha ao solicitar redefinição de senha. Por favor, tente novamente.';
      
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset password using token
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword
      });
      
      return true;
    } catch (err) {
      console.error('Reset password failed:', err);
      
      let errorMessage = 'Falha ao redefinir senha. Por favor, tente novamente.';
      
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  // Check if user belongs to a company
  const belongsToCompany = (companyId) => {
    if (!user || !user.companies) return false;
    return user.companies.some(company => company.id === companyId);
  };

  // Get user's role in a specific company
  const getRoleInCompany = (companyId) => {
    if (!user || !user.companies) return null;
    const company = user.companies.find(c => c.id === companyId);
    return company ? company.UserCompany.role : null;
  };

  // Value object to be provided to consumers
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    hasPermission,
    hasRole,
    belongsToCompany,
    getRoleInCompany
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
