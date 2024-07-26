import React, { useState, useCallback, useEffect } from 'react';  
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
  height: 100vh;  
  width: 100%; /* Ajusta el ancho según tus necesidades */  
  background-color: #161726;  
`;  

const MainContent = styled.main`  
  flex: 1;  
  display: flex;  
  flex-direction: column;  
  align-items: center;  
  padding: 20px; /* Espaciado interno */  
`;  

const TopWidgetsContainer = styled.div`  
  display: flex;  
  width: 100%;  
  justify-content: space-between;  
  margin-bottom: 20px; /* Espaciado entre los contenedores */  
`;  

const BottomWidgetsContainer = styled.div`  
  display: flex;  
  flex-direction: column;  
  width: 100%;  
  align-items: center;  
`;  

const ErrorMessage = styled.p`  
  color: red;  
`;  

const HomePage = ({ onLogout }) => {  
  const [data, setData] = useState(null);  
  const [error, setError] = useState(null);  
  const [user, setUser] = useState({});  
  const navigate = useNavigate();  

  const fetchData = useCallback(async () => {  
    try {  
      const response = await axios.get('/api/data');  
      console.log('response.data:', response.data); // Verificar los datos recibidos  
      console.log('response.data.user:', response.data.user); // Verificar los datos del usuario  
      setData(response.data);  
      setError(null);  
      if (response.data.user) {  
        setUser(response.data.user);  
      } else {  
        console.error("No se encontraron datos de usuario en la respuesta");  
      }  
    } catch (error) {  
      setError("Error al cargar los datos, por favor intente de nuevo más tarde.");  
      console.error(error);  
    }  
  }, []);  

  useEffect(() => {  
    fetchData();  
  }, [fetchData]);  

  const handleLogout = () => {  
    onLogout();  
    navigate('/login'); // Redirigir a la pagina de inicio de sesion  
  };  

  return (  
    <HomePageContainer>  
      <Sidebar />  
      <MainContent>  
        <TopWidgetsContainer>  
          <ClimaWidget />  
          {user && Object.keys(user).length > 0 ? (  
            <UserProfile user={user} />  
          ) : (  
            <p>Cargando perfil de usuario...</p>  
          )}  
        </TopWidgetsContainer>  
        <BottomWidgetsContainer>  
          {error && <ErrorMessage>{error}</ErrorMessage>}  
          {data ? (  
            <Calendario datos={data.riegoDatos} /> // Asegúrate de que 'riegoDatos' es la propiedad correcta  
          ) : (  
            <p>Cargando calendario...</p>  
          )}  
          <Notificaciones />  
        </BottomWidgetsContainer>  
        <button onClick={handleLogout} style={{ background: '#566573', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', marginTop: '20px', cursor: 'pointer' }}>  
          Cerrar sesión  
        </button>  
      </MainContent>  
    </HomePageContainer>  
  );  
};  

export default HomePage;