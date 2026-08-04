import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("agri_auth_token")
  );

  useEffect(() => {
    const storedUser = sessionStorage.getItem("agri_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        sessionStorage.removeItem("agri_user");
      }
    }
  }, []);

  const login = useCallback((userData, token) => {
    const normalizedUser = {
      ...userData,
      roles: Array.isArray(userData.roles) ? userData.roles : userData.role ? [userData.role] : ['buyer'],
    };
    setUser(normalizedUser);
    setIsAuthenticated(true);
    sessionStorage.setItem("agri_auth_token", token);
    sessionStorage.setItem("agri_user", JSON.stringify(normalizedUser));
  }, []);

  const updateUser = useCallback((userData) => {
    const normalizedUser = {
      ...userData,
      roles: Array.isArray(userData.roles) ? userData.roles : userData.role ? [userData.role] : ['buyer'],
    };
    setUser(normalizedUser);
    sessionStorage.setItem("agri_user", JSON.stringify(normalizedUser));
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("agri_auth_token");
      if (token) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
      // ignore logout errors
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem("agri_auth_token");
      sessionStorage.removeItem("agri_user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
