import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StyledClimaWidget = styled.div`
    border: 1px solid white;
    background-color: #151d26;
    padding: 20px;
    width: 300px; /* Ajusta el ancho según tus necesidades */
    height: auto; /* Esto mantendrá la proporción original */
    border-radius: 0; /* Si deseas bordes rectos */
    /* Agrega más estilos según tus preferencias */
`;

const ClimaWidget = () => {
  const [clima, setClima] = useState(null);

  useEffect(() => {
    const obtenerClima = async () => {
      try {
        const response = await axios.get('/api/clima');
        console.log('Datos del clima recibidos:', response.data); // Conservar este console.log
        setClima(response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error en la respuesta del servidor:', error.response.status, error.response.data);
        } else {
          console.error('Error al obtener los datos del clima:', error);
        }
      }
    };
  
    obtenerClima();
  }, []);
  

  if (!clima) {
    return <div>Cargando datos del clima...</div>;
  }

  return (
    <StyledClimaWidget>
      <div className="clima-widget">
        <h2>Clima ahora</h2>
        <p>{clima.temperatura}℃</p>
        <p>{clima.condicion}</p>
      </div>
    </StyledClimaWidget>
  );
};

export default ClimaWidget;

