import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const authApi = axios.create({
    baseURL: 'https://marketmate.vercel.app',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authApi.post('/login', { email, password });
      
      setIsAuthenticated(true);
      setUser({ email });
      navigate('/email');
      
      return { 
        success: true, 
        message: 'Login successful' 
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      setError(errorMessage);
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const signup = async (email, password) => {
    try {
      setError(null);
      const response = await authApi.post('/signup', { email, password });
      
      setIsAuthenticated(true);
      setUser({ email });
      navigate('/email');
      
      return { 
        success: true, 
        message: 'Signup successful' 
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      
      setError(errorMessage);
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const contextValue = { 
    isAuthenticated, 
    user, 
    login, 
    signup, 
    logout,
    error,
    ProtectedRoute
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;