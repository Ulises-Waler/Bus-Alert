import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF, Autocomplete } from '@react-google-maps/api';
import { FiBell } from 'react-icons/fi'; // Usamos react-icons para el ícono de la campanita
import { Button } from 'react-bootstrap';
import "./Dashboard.css";


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
            checkPeakHours(newTime.getHours());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Inicializar rutas por defecto
    useEffect(() => {
        setRoutes([
            { id: 1, name: 'RUTA 25' },
            { id: 2, name: 'RUTA 50' },
            { id: 3, name: 'RUTA 50-B' }
        ]);
    }, []);
    useEffect(() => {
        // Simulamos la llegada de nuevas notificaciones cada 10 segundos (esto es solo un ejemplo)
        const notificationTimer = setInterval(() => {
            setNotifications(prevNotifications => prevNotifications + 1); // Incrementamos el contador de notificaciones
        }, 10000); // Cambia el intervalo a tu necesidad

        return () => clearInterval(notificationTimer);
    }, []);

    const formatTime = (date) => date.toLocaleTimeString();

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
        <div className="container">

            <h1 className='Bienvenida'>Bienvenido al Dashboard</h1>
            <Button className='button-recargar' onClick={() => navigate('/recargar-tarjeta')}>Recargar Tarjeta</Button>
            <Button className='button-registrar' onClick={() => navigate('/registrar-tarjeta')}>Registrar Tarjeta</Button>

            {/* Botón para registrar método de recarga */}
            <Button className='button-metodo' onClick={handleRegisterPaymentMethod}>Registrar Método de Recarga</Button>





            <Button className='button-pagar' onClick={() => navigate('/pagar-pasaje')}>Pagar Pasaje</Button>
            <Button className='button-chat' onClick={() => navigate('/chatbot')} style={{ marginTop: '10px' }}>
                Chatbot de Soporte
            </Button>
            <Button onClick={handleNotificationsRedirect} style={{ position: 'relative' }}>
                <FiBell size={30} />
                {notifications > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '5px 10px',
                            fontSize: '14px',
                        }}
                    >
                        {notifications}
                    </div>
                )}
            </Button>
            <Button className='button-cerrar' variant="danger" onClick={() => navigate('/')}>Cerrar sesión</Button>


            <h2 className='ATD'>A Dónde Te Diriges?</h2>
            <LoadScript googleMapsApiKey="AIzaSyDkCXkdamNXTN3uZyM_7o7sWobnf-Ml6mA" libraries={libraries}>
                <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceSelect}>
                    <input
                        type="text"
                        placeholder="Buscar dirección..."
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                </Autocomplete>

                <div>
                    <h3 className='ubicacion-rutas'>Las siguientes rutas pasan por tu ubicación actual</h3>
                    <h3 className='elegir-ruta'>Cual deseas elegir?</h3>
                    <ul>
                        {routes.map((route) => (
                            <li key={route.id}>
                                <button className='button-ruta' onClick={() => handleRouteSelect(route)}>{route.name}</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <h3 className='hora'>Hora actual: {formatTime(currentTime)}</h3>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: alerta.includes('⚠️') ? 'red' : 'green' }}>{alerta}</p>
                <button
                    className='button-seleccionar'
                    onClick={() => navigate('/map', { state: { destination: searchLocation } })}
                >
                    Seleccionar
                </button>
                <GoogleMap mapContainerStyle={mapContainerStyle} center={currentLocation || center} zoom={14}>
                    {currentLocation && (
                        <MarkerF
                            position={currentLocation}
                            title="Ubicación actual"
                        />
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
            </LoadScript>

            {/* Mostrar las rutas por defecto */}

        </div>
    );
}

export default Dashboard;
