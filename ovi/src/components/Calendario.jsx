import React, { useState, useEffect } from 'react';  
import axios from 'axios';  

const Calendario = () => {  
  const [datos, setDatos] = useState([]);  
  const [error, setError] = useState(null);  
  const [currentDate, setCurrentDate] = useState(new Date());  

  useEffect(() => {  
    fetchDatos();  
  }, []);  

  const fetchDatos = async () => {  
    try {  
      const response = await axios.get('/api/datos');  
      
      // No es necesario verificar el estado, axios lo maneja automáticamente  
      // Aquí asumimos que la respuesta se convierte en JSON automáticamente  
      setDatos(response.data);  
      
    } catch (error) {  
      console.error('Error al obtener datos:', error);  
      setError(  
        error.message || 'Se produjo un error al intentar obtener los datos del calendario.'  
      );  
    }  
  };  

  const handlePrevMonth = () => {  
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));  
  };  

  const handleNextMonth = () => {  
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));  
  };  

  const renderCalendar = () => {  
    const month = currentDate.getMonth();  
    const year = currentDate.getFullYear();  
    const firstDay = new Date(year, month, 1);  
    const lastDay = new Date(year, month + 1, 0);  
    const daysInMonth = lastDay.getDate();  

    const days = [];  
    // Añadir días del mes anterior  
    const prevDays = firstDay.getDay();  
    for (let i = 0; i < prevDays; i++) {  
      days.push(<div key={`prev-${i}`} className="day empty"></div>);  
    }  

    // Añadir días del mes actual  
    for (let i = 1; i <= daysInMonth; i++) {  
      const isRiegoDay = datos.some(dato => {  
        const riegoDate = new Date(dato.fecha); // Asumir que cada dato tiene una fecha  
        return riegoDate.getDate() === i && riegoDate.getMonth() === month && riegoDate.getFullYear() === year;  
      });  

      days.push(  
        <div key={i} className={`day ${isRiegoDay ? 'riego' : ''}`}>  
          {i}  
        </div>  
      );  
    }  

    return (  
      <div className="calendar-grid">  
        {days}  
      </div>  
    );  
  };  

  return (  
    <div>  
      <h1>Calendario</h1>  
      {error && <p>Error: {error}</p>}  
      <div>  
        <button onClick={handlePrevMonth}>Anterior</button>  
        <button onClick={handleNextMonth}>Siguiente</button>  
      </div>  
      {renderCalendar()}  
    </div>  
  );  
};  

export default Calendario;