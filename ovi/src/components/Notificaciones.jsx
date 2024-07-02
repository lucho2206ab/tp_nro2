import React, { useState, useEffect } from 'react';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const fetchNotificaciones = async () => {
    try {
      const response = await fetch('/api/notificaciones');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Respuesta no es JSON');
      }

      const result = await response.json();
      setNotificaciones(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      setError(error.message);
    } finally {
      setIsLoading(false); // Finaliza la carga, independientemente del resultado
    }
  };

  return (
    <div>
      {isLoading && <p>Cargando...</p>}
      {error ? (
        <p>Error: {error}</p>
      ) : notificaciones.length === 0 ? (
        <p>No hay notificaciones disponibles</p>
      ) : (
        notificaciones.map((notificacion, index) => (
          <div key={index}>{notificacion.mensaje}</div>
        ))
      )}
    </div>
  );
};

export default Notificaciones;
