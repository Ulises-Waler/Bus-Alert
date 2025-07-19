import React, {useState,useEffect} from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate,  } from 'react-router-dom';
import '../components/RegistrarTarjeta.css';

function PagarPasaje() {
    const navigate = useNavigate();
    const tarjeta = {
        folio: '1234567890',
        tipo: 'General',
        dueño: 'Juan Pérez',
    };
    const [mensaje, setMensaje] = useState('🔄 Esperando para pagar pasaje...');
    const [saldo, setSaldo] = useState(50); // Saldo inicial, puedes cambiarlo
    const costoPasaje = 10.5;

    useEffect(() => {
        // Después de 10 segundos, mostrar que se cobró el pasaje
        const timer1 = setTimeout(() => {
            setMensaje(`Se cobró $${costoPasaje}`);
            setSaldo((prevSaldo) => prevSaldo - costoPasaje); // Restar el costo del pasaje
        }, 4000);

        // Después de 2 segundos más, mostrar el saldo restante
        const timer2 = setTimeout(() => {
            setMensaje(`Saldo restante: $${(saldo - costoPasaje).toFixed(2)}`);
        }, 7000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <Container className="mb-4">
      <h1 className="Bienvenida">Pagar Pasaje</h1>

      {mensaje && (
        <h5 className="text-primary fw-semibold text-center mb-4" style={{ fontSize: '18px' }}>
          {mensaje}
        </h5>
      )}

      <Card className="shadow-sm border rounded p-4 mb-4">
        <Card.Body>
          <div className="tarjeta-container d-flex justify-content-center">
            <div className="tarjeta">
              {/* Parte delantera de la tarjeta */}
              <div className="border-deco top"></div>
              <div className="header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://seeklogo.com/images/E/escudo-del-estado-de-aguascalientes-logo-71B8D64F73-seeklogo.com.png"
                    alt="Logo Aguascalientes"
                    width={60}
                    className="me-2"
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
              <div className="soluciones">
                SO<span className="l">L</span>UC<span className="i">I</span>ONES
              </div>
              <div className="yovoy">YOVOY</div>
              <div className="border-deco bottom"></div>

              {/* Parte trasera de la tarjeta */}
              <div className="tarjeta-trasera mt-3">
                <p className="text-muted">Información confidencial</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="text-center">
        <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
          Volver al Dashboard
        </Button>
      </div>
    </Container>
    </div>
  );
}

export default PagarPasaje;
