import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF, Autocomplete } from '@react-google-maps/api';
import { FiBell } from 'react-icons/fi'; // Usamos react-icons para el ícono de la campanita
import { Navbar, Nav, Container, Button, NavDropdown, Card, Row, Col } from 'react-bootstrap';
import "./Dashboard.css"


function Dashboard() {
    const navigate = useNavigate();
    const [alerta, setAlerta] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchLocation, setSearchLocation] = useState({
        position: null,
        address: null,
        placeId: null
    }); const [isPredicting, setIsPredicting] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const autocompleteRef = useRef(null);
    const [notifications, setNotifications] = useState(4); // Estado para las notificaciones


    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };


    const center = { lat: 21.8818, lng: -102.2917 };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error(error);
                    setAlerta('No se pudo obtener la ubicación.');
                }
            );
        } else {
            setAlerta('Geolocalización no es compatible con este navegador.');
        }
    }, []);

    const libraries = useMemo(() => ['places'], []);

    useEffect(() => {
    const timer = setInterval(() => {
        const newTime = new Date();
        setCurrentTime(newTime);
    }, 1000); // Esto solo actualiza la hora en pantalla

    return () => clearInterval(timer);
}, []);

useEffect(() => {
    checkPeakHours(currentTime.getHours()); // Ejecuta la predicción solo cuando cambia la hora
}, [currentTime.getHours()]);

    // Inicializar rutas por defecto
    useEffect(() => {
        setRoutes([
            { id: 1, name: 'RUTA 16' },
            { id: 2, name: 'RUTA 18' },
            { id: 3, name: 'RUTA 23' },
            { id: 4, name: 'RUTA 25' },
            { id: 5, name: 'RUTA 27' },
            { id: 6, name: 'RUTA 28' },
            { id: 7, name: 'RUTA 36' },
            { id: 8, name: 'RUTA 43' }
        ]);
    }, []);
    useEffect(() => {
        // Simulamos la llegada de nuevas notificaciones cada 10 segundos (esto es solo un ejemplo)
        const notificationTimer = setInterval(() => {
            setNotifications(prevNotifications => prevNotifications + 1); // Incrementamos el contador de notificaciones
        }, 10000); // Cambia el intervalo a tu necesidad

        return () => clearInterval(notificationTimer);
    }, []);

    const formatTime = (date) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleString('es-MX', options);
};

    const checkPeakHours = (hour) => {
        setIsPredicting(true);
        setAlerta('🔄 Prediciendo horarios...');

        setTimeout(() => {
            let mensaje = '🕒 Fuera del horario de servicio.';

            if ((hour >= 6 && hour <= 9) || (hour >= 17 && hour <= 19)) {
                mensaje = '⚠️ Hora Pico: Alta saturación en los autobuses.';
            } else if ((hour >= 10 && hour <= 16) || hour >= 20) {
                mensaje = '✅ Horario Tranquilo: Poca afluencia de pasajeros.';
            }

            setAlerta(mensaje);
            setIsPredicting(false);
        }, 8000);
    };

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry) {
            setSearchLocation({
                position: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                },
                address: place.formatted_address,
                placeId: place.place_id
            });
        }
    };

    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
        alert(`Ruta seleccionada: ${route.name}`);
    };

    // Función para manejar el redireccionamiento al formulario de recarga
    const handleRegisterPaymentMethod = () => {
        navigate('/registrar-metodo');
    };

    // Función para manejar el redireccionamiento a la página de notificaciones
    const handleNotificationsRedirect = () => {
        navigate('/notificaciones');
    };

    return (
        <Container className='mb-4'>

            <h1 className='Bienvenida'>Bienvenido a BusAlert</h1>
            <Navbar expand="md" variant="light" className="mb-3 px-3 shadow-sm rounded">
                <Container fluid className='container mb-3'>
                    <Navbar.Brand className="d-flex align-items-center">
                        <img
                            alt="Logo"
                            src="https://play-lh.googleusercontent.com/ovizBGXEudzac08Kgstry0-9z9fwvJ1tqb9y-ZttRz-3IieePYPvbQt9AZIIOgFNLA"
                            width="40"
                            height="40"
                            className="d-inline-block align-top me-2 rounded-circle border"
                            style={{ backgroundColor: "#ffffff", padding: "4px" }}
                        />
                        <span className="fw-bold fs-5 text-primary brand-text">BusAlert Aguascalientes</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-block d-md-none mx-auto mb-2" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto text-center w-100 d-flex flex-column flex-md-row justify-content-center">
                            <Nav.Link onClick={() => navigate('/recargar-tarjeta')} className="text-dark fw-semibold">
                                Recargar Tarjeta
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate('/registrar-tarjeta')} className="text-dark fw-semibold">
                                Registrar Tarjeta
                            </Nav.Link>
                            <Nav.Link onClick={handleRegisterPaymentMethod} className="text-dark fw-semibold">
                                Registrar Método
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate('/pagar-pasaje')} className="text-dark fw-semibold">
                                Pagar Pasaje
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate('/chatbot')} className="text-dark fw-semibold">
                                Chatbot
                            </Nav.Link>
                            <Nav.Link onClick={handleNotificationsRedirect} style={{ position: 'relative' }}>
                                <FiBell size={20} className="text-primary" />
                                {notifications > 0 && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '0px',
                                            right: '-8px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            borderRadius: '50%',
                                            padding: '2px 6px',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {notifications}
                                    </span>
                                )}
                            </Nav.Link>
                        </Nav>
                        <Nav className="justify-content-center mt-2 mt-md-0">
                            <Nav.Link onClick={() => navigate('/')} className="text-danger fw-bold">
                                Cerrar Sesión
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>



            <LoadScript
                googleMapsApiKey="AIzaSyDkCXkdamNXTN3uZyM_7o7sWobnf-Ml6mA"
                libraries={libraries}
            >
                <Card className="mb-4 shadow-sm border rounded     background-color:rgba(211, 222, 226, 0.8)">
                    <Card.Body className='background-color:rgba(211, 222, 226, 0.8)'>

                        {/* Barra de búsqueda de dirección */}
                            <div className="mt-3">
                                <h6 className="hora">{formatTime(currentTime)}</h6>
                                <p
                                    style={{ fontSize: '18px', fontWeight: 'bold', color: alerta.includes('⚠️') ? 'red' : 'green' }}
                                >
                                    {alerta}
                                </p>
                            </div>
                        <h4 className="text-primary mb-3 fw-bold">¿A dónde te diriges?</h4>
                        <Autocomplete
                            onLoad={(ref) => (autocompleteRef.current = ref)}
                            onPlaceChanged={handlePlaceSelect}
                            options={{
                                componentRestrictions: { country: 'mx' }, // Solo México
                                bounds: {
                                    north: 22.4,
                                    south: 21.6,
                                    east: -101.8,
                                    west: -102.6,
                                }, // Aproximadamente los límites del estado de Aguascalientes
                                strictBounds: true, // Restringe solo dentro de los bounds
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Buscar dirección..."
                                className="form-control mb-3"
                            />
                        </Autocomplete>

                        {/* Lista de rutas */}
                        <div className="text-primary mb-3 fw-bold">
                            <h5 className="fw-semibold">Rutas cercanas a tu ubicación</h5>
                            <Row xs={2} md={3} lg={4} className="g-2">
                                {routes.map((route) => (
                                    <Col key={route.id}>
                                        <Button
                                            variant="outline-primary"
                                            className="w-100"
                                            onClick={() => handleRouteSelect(route)}
                                        >
                                            {route.name}
                                        </Button>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* Hora y alerta */}

                        {/* Botón Seleccionar */}
                        <Button
                            variant="success"
                            className="mt-3"
                            onClick={() => navigate('/map', { state: { destination: searchLocation } })}
                        >
                            Seleccionar Destino
                        </Button>
                    </Card.Body>
                </Card>

                {/* Mapa de Google */}
                <Card className="shadow-sm border rounded">
                    <Card.Body>
                        <h5 className="mb-3 text-primary fw-semibold">Mapa de Ubicación</h5>
                        <div style={{ width: '100%', height: '400px' }}>
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={currentLocation || center}
                                zoom={14}
                            >
                                {currentLocation && (
                                    <MarkerF position={currentLocation} title="Ubicación actual" />
                                )}
                                {searchLocation && (
                                    <MarkerF
                                        position={searchLocation}
                                        title="Ubicación buscada"
                                        icon="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                                    />
                                )}
                                <MarkerF position={center} title="Ubicación predeterminada" />
                            </GoogleMap>
                        </div>
                    </Card.Body>
                </Card>
            </LoadScript>


            {/* Mostrar las rutas por defecto */}

        </Container>
    );
}

export default Dashboard;
