import React, { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';  // Importamos axios
import './RegistrarPaymentMethod.css';
import visaLogo from '../images/paypal.png'
import paypalLogo from '../images/visa.png'
import mercadopago from '../images/mercadopago.png'
import { useNavigate} from 'react-router-dom';


function RegisterPaymentMethod() {
    const [method, setMethod] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [mercadoPagoEmail, setMercadoPagoEmail] = useState('');
    const [cvc, setCvc] = useState('');

    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Creamos el objeto de datos que enviaremos al backend
        const paymentData = {
            method,
            cardNumber,
            paypalEmail,
            expiryMonth,
            expiryYear,
            cvc,
        };

        try {
            // Hacemos la solicitud POST al backend para registrar el método de pago
            const response = await axios.post('https://busalert-backend.onrender.com/api/payment/register', paymentData);

            // Puedes manejar la respuesta del backend aquí
            alert('Método de pago registrado con éxito');
            console.log(response.data);
        } catch (error) {
            // Manejo de errores en caso de que falle la solicitud
            console.error('Error al registrar el método de pago:', error);
            alert('Hubo un error al registrar el método de pago');
        }
    };

     return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <Container className="mb-4">
      <h1 className="Bienvenida">Registrar Método de Recarga</h1>

      <Card className="shadow-sm border rounded p-4 mb-4">
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <h5 className="text-primary fw-bold mb-4 text-center">Selecciona un método de pago</h5>
            
            <Row className="mb-4 justify-content-center">
              <Col xs="auto">
                <div
                  className={`payment-option ${method === "Visa" ? "selected" : ""}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setMethod("Visa")}
                >
                  <img src={visaLogo} alt="Visa" width={80} />
                </div>
              </Col>
              <Col xs="auto">
                <div
                  className={`payment-option ${method === "PayPal" ? "selected" : ""}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setMethod("PayPal")}
                >
                  <img src={paypalLogo} alt="PayPal" width={80} />
                </div>
              </Col>
              <Col xs="auto">
                <div
                  className={`payment-option ${method === "MercadoPago" ? "selected" : ""}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setMethod("MercadoPago")}
                >
                  <img src={mercadopago} alt="MercadoPago" width={80} />
                </div>
              </Col>
            </Row>

            {(method === "Visa" || method === "MercadoPago") && (
              <div className="mb-4">
                <h6 className="text-dark fw-semibold">
                  {(method === "Visa") ? "Datos de la tarjeta Visa" : "Datos de la tarjeta MercadoPago"}
                </h6>
                <Row className="mb-3">
                  <Col>
                    <label className="text-dark fw-semibold">Número de tarjeta:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <label className="text-dark fw-semibold">Mes de caducidad:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value)}
                      placeholder="MM"
                      maxLength="2"
                    />
                  </Col>
                  <Col>
                    <label className="text-dark fw-semibold">Año de caducidad:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value)}
                      placeholder="AAAA"
                      maxLength="4"
                    />
                  </Col>
                  <Col>
                    <label className="text-dark fw-semibold">CVC:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="XXX"
                      maxLength="3"
                    />
                  </Col>
                </Row>
              </div>
            )}

            {method === "PayPal" && (
              <div className="mb-4">
                <h6 className="text-dark fw-semibold">Correo electrónico de PayPal</h6>
                <input
                  type="email"
                  className="form-control"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="tuemail@paypal.com"
                />
              </div>
            )}

            <div className="d-grid gap-2">
              <Button type="submit" variant="success" className="fw-bold">
                Registrar Método
              </Button>
              <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
                Volver al Dashboard
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
    }
    
    export default RegisterPaymentMethod;