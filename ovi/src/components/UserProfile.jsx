import React, { useState, useEffect } from 'react';

const Calendario = () => {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const response = await fetch('/api/datos');

      if (!response.ok) {
        throw new Error(`Error en la solicitud. Estado: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La respuesta no es un formato JSON válido');
      }

      const result = await response.json();
      setDatos(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : datos.length === 0 ? (
        <p>No hay datos disponibles</p>
      ) : (
        datos.map((dato, index) => (
          <div key={index}>
            {dato.nombre}: {dato.descripcion}
          </div>
        ))
      )}
    </div>
  );
};

export default Calendario;
