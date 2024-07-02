import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import HomePage from './pages/HomePage';
import Calendario from './components/Calendario';
import ClimaWidget from './components/ClimaWidget';
import Notificaciones from './components/Notificaciones';
import Sidebar from './components/Sidebar';
import UserProfile from './components/UserProfile';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';

const AuthenticatedApp = ({ isAuthenticated, handleLogin, handleLogout }) => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login onLogin={handleLogin} /> } />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/register" />} />

      {/* Rutas autenticadas */}
      <Route path="/" element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/calendario" element={isAuthenticated ? <Calendario /> : <Navigate to="/login" />} />
      <Route path="/clima" element={isAuthenticated ? <ClimaWidget /> : <Navigate to="/login" />} />
      <Route path="/notificaciones" element={isAuthenticated ? <Notificaciones /> : <Navigate to="/login" />} />
      <Route path="/sidebar" element={isAuthenticated ? <Sidebar /> : <Navigate to="/login" />} />
      <Route path="/perfil" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si hay un token en el almacenamiento local cuando se carga la aplicación
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    // Guarda el token en el almacenamiento local y actualiza el estado
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Elimina el token del almacenamiento local y actualiza el estado
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <AuthenticatedApp isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout} />
    </Router>
  );
};

export default App;
