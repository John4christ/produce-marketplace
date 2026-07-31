import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'user-101',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'buyer', // 'buyer', 'farmer', 'admin'
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (token) sessionStorage.setItem('agri_auth_token', token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('agri_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
