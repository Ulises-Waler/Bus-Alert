import React, { useState, useEffect } from 'react';
import { Card, Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate,  } from 'react-router-dom';

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    

    // Simulando el fetch de noticias de los autobuses
    useEffect(() => {
        // Aquí puedes hacer una petición a tu API para obtener las noticias
        const fetchedNotifications = [
            {
                id: 1,
                message: '🚌 La parada de camión en 3er Anillo no está funcionando hoy.',
                image: 'https://metropolitanoaguascalientes.com.mx/wp-content/uploads/2024/01/420074122_777016561128564_1634842943153737874_n.jpg',
                link: "https://oem.com.mx/elsoldelcentro/local/cambios-en-ruta-50-por-rehabilitacion-de-tercer-anillo-norte-aguascalientes-13615670"
            },
            {
                id: 2,
                message: '⚠️ Servicio de autobuses retrasado por mantenimiento.',
                image: 'https://th.bing.com/th/id/OIP.41rqAQ5WTcFli8GWIDWC-AHaE8?w=262&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
                link: 'https://newsweekespanol.com/2018/03/27/frenan-100-camiones-urbanos-por-falta-de-mantenimiento-y-reparaciones/'
            },
            {
                id: 3,
                message: '✅ Nueva ruta 52 disponible para tu destino.',
                image: 'https://binoticias.com/_next/image?url=https:%2F%2Fadmin.binoticias.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Frecorte_1200x800%2Fpublic%2Ffield-image%2F2024-03%2FNuevo%2520cami%25C3%25B3n.jpg%3Fitok%3DD6EuKo2X&w=3840&q=75',
                link: 'https://www.aztecaaguascalientes.com/noticias/ruta-52-aguascalientes-cual-sera-su-recorrido-y-en-que-horarios-todo-sobre-la-nueva-ruta-de-transporte-publico'
            },
            {
                id: 4,
                message: '🚧 Cierre temporal de la ruta por trabajos en la carretera.',
                image: 'https://www.heraldo.mx/wp-content/uploads/2016/08/aviso-vial-696x392.jpg',
                link: 'https://www.aztecaaguascalientes.com/noticias/cierres-viales-aguascalientes-cual-es-el-tramo-la-carretera-70-poniente-que-estara-cerrado-temporalmente'
            }
        ];
        setNotifications(fetchedNotifications);
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <Container className="mt-4 mb-5">
      <h1 className="Bienvenida">Notificaciones de Autobuses</h1>

      <Row>
        {notifications.map((notification) => (
          <Col key={notification.id} xs={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={notification.image} />
              <Card.Body className="d-flex flex-column">
                <Card.Text className="text-dark fw-semibold">{notification.message}</Card.Text>
                <a
                  href={notification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary mt-auto"
                >
                  Ver más
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4">
        <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
          Volver al Dashboard
        </Button>
      </div>
    </Container>
    </div>
  );
}

export default NotificationsPage;
