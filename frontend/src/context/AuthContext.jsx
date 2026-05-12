import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from '../firebase/firebaseAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user data on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const loginWithFirebase = (userData, idToken) => {
    setUser(userData);
    localStorage.setItem('token', idToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authMethod', 'firebase');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authMethod');
  };

  const getAuthMethod = () => {
    return localStorage.getItem('authMethod') || 'traditional';
  };

  const value = {
    user,
    login,
    loginWithFirebase,
    logout,
    getAuthMethod,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
