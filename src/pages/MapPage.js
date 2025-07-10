import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, MarkerF, DirectionsRenderer, InfoWindow, Autocomplete } from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import './MapPages.css';


const mapContainerStyle = {
  width: '100%',
  height: '500px'
};


const centerDefault = { lat: 21.8818, lng: -102.2917 };

function MapPage() {
  const { state } = useLocation();
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [stops, setStops] = useState([]);
  const [busLocations, setBusLocations] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const autocompleteRef = useRef(null);
  const navigate = useNavigate();


  // Obtener ubicación del usuario y destino de la navegación
  useEffect(() => {
    // Obtener ubicación actual
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        });
      },
      () => {
        console.warn('No se pudo obtener la ubicación');
        setUserLocation(centerDefault);
      }
    );

    // Obtener destino del estado de navegación
    if (state?.destination) {
      setDestination(state.destination.position);
    }
  }, [state]);

  // Calcular ruta cuando ambos puntos estén disponibles
  useEffect(() => {
    if (userLocation && destination) {
      calculateRoute(userLocation, destination);
    }
  }, [userLocation, destination]);

  const calculateRoute = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Error al calcular la ruta:', status);
        }
      }
    );
  };

  // Cargar paradas de autobús (opcional)
  const loadBusStops = useCallback(() => {
    axios.get('https://busalert-backend.onrender.com/api/stops')
      .then(response => {
        setStops(response.data);
      })
      .catch(err => {
        console.error('Error al obtener las paradas:', err);
      });

    axios.get('https://busalert-backend.onrender.com/api/location/buses')
      .then(response => {
        setBusLocations(response.data);
      })
      .catch(err => {
        console.error('Error al obtener ubicaciones de los autobuses:', err);
      });
  }, []);

  return (
    <Container>
      <h1>Mapa de Transporte</h1>
      <LoadScript googleMapsApiKey="AIzaSyDkCXkdamNXTN3uZyM_7o7sWobnf-Ml6mA" libraries={['places']}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || centerDefault}
          zoom={14}
          onLoad={loadBusStops}
        >
          {/* Marcador de ubicación del usuario */}
          {userLocation && (
            <MarkerF 
              position={userLocation} 
              title="Tu ubicación"
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
          )}

          {/* Marcador de destino */}
          {destination && (
            <MarkerF 
              position={destination} 
              title="Tu destino"
              icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            />
          )}

          {/* Mostrar ruta calculada */}
          {directions && <DirectionsRenderer directions={directions} />}

          {/* Mostrar paradas de autobús */}
          {stops.map((stop, index) => (
            <MarkerF
              key={index}
              position={stop.location}
              icon={stop.busAvailable ? 
                'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 
                'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}
            />
          ))}

          {/* Mostrar autobuses (opcional) */}
          {busLocations.map((bus, index) => (
            <MarkerF
              key={`bus-${index}`}
              position={{ lat: bus.lat, lng: bus.lng }}
              onClick={() => setSelectedBus(bus)}
              icon="http://maps.google.com/mapfiles/ms/icons/bus.png"
            >
              {selectedBus && selectedBus.busId === bus.busId && (
                <InfoWindow onCloseClick={() => setSelectedBus(null)}>
                  <div>
                    <h3>Autobús: {bus.busId}</h3>
                    <p>Nombre del Conductor: {bus.driverName}</p>
                    <p>Calificación: {bus.rating} estrellas</p>
                    <p>Tiempo estimado: 3 minutos</p>
                  </div>
                </InfoWindow>
              )}
            </MarkerF>
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Información de la ruta */}
      {directions && (
        <div className="route-info">
          <h3>Información de tu ruta</h3>
          <p><strong>Distancia:</strong> {directions.routes[0].legs[0].distance.text}</p>
          <p><strong>Tiempo estimado:</strong> {directions.routes[0].legs[0].duration.text}</p>
          <button onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>

        </div>
        
      )}

    </Container>
  );
}

export default MapPage;