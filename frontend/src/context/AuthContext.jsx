
import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

const [isAuthenticated, setIsAuthenticated] = useState(
  !!sessionStorage.getItem("agri_auth_token")
);
useEffect(() => {
  const storedUser = sessionStorage.getItem("agri_user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
    setIsAuthenticated(true);
  }
}, []);
   const login = (userData, token) => {
  setUser(userData);
  setIsAuthenticated(true);

  sessionStorage.setItem("agri_auth_token", token);
  sessionStorage.setItem("agri_user", JSON.stringify(userData));
};

  const logout = () => {
  setUser(null);
  setIsAuthenticated(false);

  sessionStorage.removeItem("agri_auth_token");
  sessionStorage.removeItem("agri_user");
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
