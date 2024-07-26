import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  padding: 25px; /* Espaciado interno */
  border: 1px solid white; /*borde blando*/
  background-color: #252e39; /* Color de fondo */
`;

const SearchInput = styled.input`
  width: 90%;
  padding: 10px;
  margin-bottom: 30px;
  /* Agrega más estilos según tus preferencias */
`;

const Sidebar = () => {
  return (
    <SidebarContainer className="sidebar">
      <SearchInput
        type="text"
        placeholder="Buscar..."
        // Agrega los eventos y lógica necesarios para manejar la búsqueda
      />

      <ul>
        <li><Link to="/plantacion1">Plantacion 1</Link></li>
        <li><Link to="/plantacion2">Plantacion 2</Link></li>
        <li><Link to="/plantacion3">Plantacion 3</Link></li>
        {/* Agrega más enlaces según sea necesario */}
      </ul>
    </SidebarContainer>
  );
};

export default Sidebar;
