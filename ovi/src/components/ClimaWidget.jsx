import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClimaWidget = () => {
  const [clima, setClima] = useState(null);

  useEffect(() => {
    const obtenerClima = async () => {
      try {
        const response = await axios.get('/api/clima');
        setClima(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del clima', error);
      }
    };

    obtenerClima();
  }, []);

  if (!clima) {
    return <div>Cargando datos del clima...</div>;
  }

  return (
    <div className="clima-widget">
      <h2>Clima ahora</h2>
      <p>{clima.temperatura}℃</p>
      <p>{clima.condicion}</p>
    </div>
  );
};

export default ClimaWidget;
