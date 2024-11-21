import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  
  //esto es para que la sesion no se cierre sola, refresca el JWT
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: refreshToken,
      });
  
      const newAccessToken = response.data.access;
      localStorage.setItem("token", newAccessToken);
      axios.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
    } catch (error) {
      console.error("Error al renovar el token:", error);
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
  
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 4 * 60 * 1000); // Intenta renovar cada 4 minutos (antes de que expire el token)
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:8000/api/obtener_usuario_logueado", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setUser(response.data); // Actualiza el estado con los datos del usuario
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("token");
        });
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
