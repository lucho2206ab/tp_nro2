import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  /* estilos del contenedor */
`;

const Button = styled.button`
  /* estilos del botón */
`;

const Input = styled.input`
  /* estilos del campo de entrada */
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/forgot-password", { email });
      // Manejar la respuesta, mostrar un mensaje al usuario, etc.
      setMessage("Se ha enviado un correo electrónico de validación a tu dirección de correo electrónico.");
    } catch (error) {
      // Manejar errores
      setMessage("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <Container>
      <form onSubmit={handleForgotPassword}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit">Recuperar contraseña</Button>
      </form>
      {message && <p>{message}</p>}
    </Container>
  );
};

export default ForgotPassword;
