import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  background-color: #161726;
  padding: 20px;
  margin: 0 auto;
  max-width: 400px;
  text-align: center;
`;

const Button = styled.button`
  background-color: #566573;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
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
      {message && <message>{message}</message>}
    </Container>
  );
}
export default ForgotPassword