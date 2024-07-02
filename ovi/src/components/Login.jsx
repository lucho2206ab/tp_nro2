import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";


const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-image: url("/path/to/your/image.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  align-items: center;
  justify-content: center;
`;

const Welcome = styled.h1`
  color: white;
  font-size: 3em;
  text-align: center;
  margin-bottom: 20px; /* Add margin below the welcome message */
`;

const Button = styled.button`
  /* Estilos del botón */
`;

const StyledModal = styled(Modal)`
  position: fixed; /* Cambiar a fixed para centrar en la ventana */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Mantener centrado */
  width: 400px; /* Ajustar el ancho según desees */
  height: 350px; /* Ajustar la altura según desees */
  background-color: black;
  padding: 20px;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ModalTitle = styled.h2`
  font-size: 20px; /* Ajustar el tamaño según desees */
  margin-bottom: 20px; /* Espacio entre el título y los campos */
`;

const ModalLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px; /* Ajustar el tamaño según desees */
`;

const ModalInput = styled.input`
  width: 100%; /* Ocupa todo el ancho disponible */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px; /* Ajustar el tamaño según desees */
`;

const ModalButton = styled.button`
  background-color: #4CAF50; /* Color de fondo */
  color: white;
  padding: 10px 20px;
  margin-top: 10px; /* Espacio entre el botón y los campos */
  border: none;
  border-radius: 5px;
  font-size: 14px; /* Ajustar el tamaño según desees */
  cursor: pointer;
`;

const ModalLink = styled.a`
  color: #fff; /* Color del enlace */
  font-size: 14px; /* Ajustar el tamaño según desees */
  text-decoration: none;
  margin-top: 10px; /* Espacio entre el enlace y el botón */
`;

Modal.setAppElement("#root");

const Login = () => {
  const [email, setEmail] = useState(""); // Correo electrónico
  const [password, setPassword] = useState("");
  const [abrirModal, setAbrirModal] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const navigate = useNavigate(); // Utilizar el hook useNavigate

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post("http://localhost:5173/login", { correoElectronico, contraseña });
      if (respuesta.data.error === "user_not_found") {
        setMensajeError("Usuario no registrado");
      } else {
        localStorage.setItem("token", respuesta.data.token);
        setAbrirModal(false);
        // Considera limpiar el campo de contraseña aquí (opcional)
        navigate("/homepage"); // Redirigir a la página de inicio usando navigate
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensajeError("Ha ocurrido un error. Intente nuevamente."); // Mensaje más específico
    }
  };

  return (
    <Container>
      <Welcome>Bienvenido a OVI</Welcome>
      <Button onClick={() => setAbrirModal(true)}>Iniciar sesión</Button>
      <StyledModal isOpen={abrirModal} onRequestClose={() => setAbrirModal(false)}>
        <ModalContent>
          <ModalTitle>Bienvenido a OVI</ModalTitle>
          <ModalButton type="submit" onClick={iniciarSesion}>Iniciar sesión</ModalButton>
          <ModalLabel>Email:</ModalLabel>
          <ModalInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} tabIndex={0} />
          <ModalLabel>Contraseña:</ModalLabel>
          <ModalInput type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} tabIndex={1} />
          <ModalButton type="submit">Iniciar sesión</ModalButton>
          <ModalLink href="/register">Registrarse</ModalLink>
          <ModalLink href="/forgot-password">¿Olvidaste tu contraseña?</ModalLink>
          </ModalContent>
      </StyledModal>
    </Container>
  );
};

export default Login;