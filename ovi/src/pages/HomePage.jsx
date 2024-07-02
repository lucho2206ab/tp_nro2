import React, { useState, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import ClimaWidget from '../components/ClimaWidget';
import UserProfile from '../components/UserProfile';
import Calendario from '../components/Calendario';
import Notificaciones from '../components/Notificaciones';

// Estilos para la página principal
const HomePageContainer = styled.div`
  display: flex;
  height: 100vh; /* Ajusta el alto de la página al tamaño completo del viewport */
  background-image: url('/image1.jpg'); /* Ruta a tu imagen de fondo */
  background-size: cover; /* Cubre todo el área disponible */
  background-position: center; /* Centra la imagen */
`;

const MainContent = styled.main`
  flex: 1; /* Ocupa todo el espacio restante */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HomePage = ({ onLogout }) => {
  const [data, setData] = useState(null); // Inicializamos data como null
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data); // Guardamos los datos recibidos
      setError(null); // Reiniciamos el estado de error si estaba presente
      setUser(response.data.user); // Actualizamos el estado del usuario
    } catch (error) {
      setError(error); // Capturamos el error y lo guardamos en el estado
    }
  }, []);

  const handleRegisterNavigation = () => {
    navigate('/register');
  };

  return (
    <HomePageContainer>
      <Sidebar />
      <MainContent>
        <ClimaWidget />
        <UserProfile user={user} />
        <h1>Bienvenido a OVI</h1>
        <button onClick={fetchData}>Obtener datos</button>
        {data && (
          <div>
            <h2>Datos del usuario:</h2>
            <p>Nombre: {user.nombre}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
        {error && <div>Error: {error.message}</div>}
        <Calendario />
        <Notificaciones />
        <button onClick={handleRegisterNavigation}>Registrarse</button>
        <button onClick={onLogout}>Cerrar sesión</button>
      </MainContent>
    </HomePageContainer>
  );
};

export default HomePage;
