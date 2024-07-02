import React from 'react';

const UserProfile = ({ user }) => {
  if (!user) {
    return <div>Cargando perfil de usuario...</div>;
  }

  return (
    <div className="user-profile">
      <h2>{user.nombre}</h2>
      <p>{user.rol}</p>
    </div>
  );
};

export default UserProfile;
