import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Card, Alert, Row, Col, Carousel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import "../pages/Login.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();  // Para verificar la redirección desde el registro


  useEffect(() => {
  if (location.state?.fromRegister) {
    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: 'Ahora puedes iniciar sesión.',
      confirmButtonColor: '#3085d6',
    });
  }
}, [location]);


  const handleSubmit = async (e) => {
  e.preventDefault();

  // Mostrar alerta de cargando
  Swal.fire({
    title: isRegistering ? 'Registrando...' : 'Iniciando sesión...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const url = isRegistering
      ? 'https://busalert-backend.onrender.com/api/auth/register'
      : 'https://busalert-backend.onrender.com/api/auth/login';

    const response = await axios.post(url, { nombre: name, correo: email, password });

    Swal.close(); // Cerrar la alerta de carga

    if (isRegistering) {
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Ahora puedes iniciar sesión.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
      navigate('/', { state: { fromRegister: true } });
      return;
    }

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    navigate('/Dashboard');

  } catch (err) {
    Swal.close(); // Cerrar la alerta de carga si hay error

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error en el proceso, revisa los datos.',
      confirmButtonColor: '#d33',
    });
  }
};



  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
    <Container style={{ backgroundColor: 'rgba(211, 222, 226, 0.8)' }}>
      <Row >
        {/* Carrusel de imágenes */}
        <Col xs={12} md={6} className="p-0 mb-3 mb-md-0">
          <Carousel fade controls={false} indicators={false}>
            <Carousel.Item className="px-3">
              <div className="carousel-image-wrapper">
              <img
                className="d-block w-100 h-100 object-fit-cover carousel-image"
                src="https://www.visionautomotriz.com.mx/wp-content/uploads/2019/12/Mercedes-Benz-Autobuses-renueva-unidades-en-Aguascalientes.jpg"
                alt="Imagen 1"
              />
              </div>
            </Carousel.Item>
            <Carousel.Item className="px-3">
              <div className="carousel-image-wrapper">
              <img
                className="d-block w-100 h-100 object-fit-cover carousel-image"
                src="https://wp.tyt.com.mx/wp-content/uploads/2023/01/Nueva-terminal-en-Aguascalientes-1024x597.jpg"
                alt="Imagen 2"

              />
              </div>
            </Carousel.Item>
            <Carousel.Item className="px-3">
              <div className="carousel-image-wrapper">
              <img
                className="d-block w-100 h-100 object-fit-cover carousel-image"
                src="https://tse4.mm.bing.net/th/id/OIP.JpO3aFkjUKyUFAa4gW0JvwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="Imagen 3"

              />
              </div>
            </Carousel.Item>
            <Carousel.Item className="px-3">
              <div className="carousel-image-wrapper">
              <img
                className="d-block w-100 h-100 object-fit-cover carousel-image"
                src="https://noticiasaguascalientes.com/wp-content/uploads/2023/08/image-91-1024x681.png"
                alt="Imagen 4"
              />
              </div>
            </Carousel.Item>
            <Carousel.Item className="px-3">
              <div className="carousel-image-wrapper">
              <img
                className="d-block w-100 h-100 object-fit-cover carousel-image"
                src="https://tvazteca.brightspotcdn.com/dc/68/c22acdb042eb84d45f8dc69adde9/este-es-el-precio-de-la-tarjeta-de-movilidad-yovoy-en-aguascalientes.jpg"
                alt="Imagen 5"
              />
              </div>
            </Carousel.Item>
          </Carousel>
        </Col>

        {/* Formulario */}
        <Col xs={12} md={6} className="p-3">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">
              {isRegistering ? 'Registro' : 'Iniciar Sesión'}
            </h2>
            <p className="text-muted">Bienvenido a BusAlert Aguascalientes</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {isRegistering && (
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mb-3">
              {isRegistering ? 'Registrarse' : 'Ingresar'}
            </Button>
          </Form>

          <div className="text-center">
            <Button
              variant="link"
              className="text-decoration-none"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate aquí'}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default Login;
