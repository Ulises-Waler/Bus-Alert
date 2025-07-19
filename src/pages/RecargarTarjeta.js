import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import "./RecargarTarjeta.css";
import oxxoImg from '../images/oxxo.png';
import tarjetaImg from '../images/tarjeta.png';
import nfcImg from '../images/nfc.png';



function RecargarTarjeta() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('OXXO');
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    // Simulación de una solicitud para recargar la tarjeta
    try {

      const response = await fetch('https://busalert-backend.onrender.com/api/tarjetas/recargar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Pasar el token para verificar al usuario
        },
        body: JSON.stringify({
          monto: parseFloat(amount),
        }),
      });

      const data = await response.json();
      if (data.message === 'Recarga exitosa') {
        alert('¡Recarga exitosa!');
        navigate('/dashboard');  // Redirigir al dashboard
      } else {
        alert('Hubo un problema con la recarga');
      }
    } catch (error) {
      console.error('Error al procesar la recarga:', error);
      alert('Hubo un error al procesar la recarga');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <Container className="mb-4">
      <h1 className="Bienvenida">Recargar Tarjeta</h1>
      <Card className="shadow-sm border rounded mb-4 p-3">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-primary">Monto de la recarga:</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Monto a recargar"
                required
              />
            </Form.Group>
            <div className="mb-4">
              <p className="fw-bold text-primary text-center">Selecciona el método de pago:</p>
              <div className="metodo-pago-options">
                <div
                  className={`metodo-pago-item ${paymentMethod === "OXXO" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("OXXO")}
                >
                  <img src={oxxoImg} alt="OXXO" />
                  <p className="text-dark fw-semibold">OXXO</p>
                </div>
                <div
                  className={`metodo-pago-item ${paymentMethod === "Tarjeta" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("Tarjeta")}
                >
                  <img src={tarjetaImg} alt="Tarjeta" />
                  <p className="text-dark fw-semibold">Tarjeta</p>
                </div>
                <div
                  className={`metodo-pago-item ${paymentMethod === "NFC" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("NFC")}
                >
                  <img src={nfcImg} alt="NFC" />
                  <p className="text-dark fw-semibold">NFC</p>
                </div>
              </div>
            </div>

            <Button type="submit" variant="success" className="w-100 fw-bold">
              Recargar
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border rounded mb-4 p-3">
        <Card.Body className="text-center">
          <h5 className="mb-3 text-primary fw-bold">Tu Tarjeta</h5>
          <div className="tarjeta-container d-flex justify-content-center">
            <div className="tarjeta">
              <div className="border-deco top"></div>
              <div className="header d-flex justify-content-between px-2">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://seeklogo.com/images/E/escudo-del-estado-de-aguascalientes-logo-71B8D64F73-seeklogo.com.png"
                    alt="Logo Aguascalientes"
                    style={{ width: '40px', marginRight: '10px' }}
                  />
                  <div>
                    <strong>Aguascalientes</strong><br />
                    Gente de trabajo
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <strong>GOBIERNO DEL ESTADO<br />DE AGUASCALIENTES</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  El<br /><strong>gigante</strong><br />de México
                </div>
              </div>
              <div className="soluciones text-center mt-2">
                SO<span className="l">L</span>UC<span className="i">I</span>ONES
              </div>
              <div className="yovoy text-center">YOVOY</div>
              <div className="border-deco bottom"></div>
              <div className="tarjeta-trasera mt-2">
                <p>Información confidencial</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="text-center">
        <Button onClick={() => navigate('/dashboard')} variant="outline-primary" className="fw-semibold">
          Volver al Dashboard
        </Button>
      </div>
    </Container>
    </div>
  );
}

export default RecargarTarjeta;
