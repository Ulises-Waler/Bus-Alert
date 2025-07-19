import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../components/RegistrarTarjeta.css'; // Importar el archivo CSS para la tarjeta
import './RegistrarTarjeta.css'


function RegistrarTarjeta() {
    const [error, setError] = useState('');
    const [tarjeta, setTarjeta] = useState({
        folio: '1234567890',
        tipo: 'General',
        dueño: 'Juan Pérez',
    }); // Valores predeterminados para mostrar la tarjeta sin importar si está registrada
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'No estás autenticado',
                text: 'Por favor inicia sesión para continuar.',
            });
            return;
        }

        try {
            // Mostrar alerta de carga
            Swal.fire({
                title: 'Registrando tarjeta...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await axios.post(
                'https://busalert-backend.onrender.com/api/tarjetas/registrar',
                { usuarioId: localStorage.getItem('usuarioId') },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.close(); // Cerrar la alerta de carga

            if (response.status === 201) {
                setTarjeta(response.data);
                await Swal.fire({
                    icon: 'success',
                    title: '¡Registrado exitosamente!',
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate('/dashboard');
            }
        } catch (error) {
            Swal.close();

            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.error === "El usuario ya tiene una tarjeta registrada"
            ) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Tarjeta ya registrada',
                    text: 'Ya tienes una tarjeta registrada.',
                });
                setError("Ya tienes una tarjeta registrada.");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al registrar la tarjeta. Intenta más tarde.',
                });
                setError('Error al registrar la tarjeta');
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Container className="mb-4">
            <h1 className="Bienvenida">Registrar Tarjeta</h1>

            <Card className="shadow-sm border rounded mb-4 p-3">
                <Card.Body className="text-center">
                    <h5 className="mb-3 text-primary fw-bold">Tarjeta Digital</h5>
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
                    {error && <p className="text-danger mt-2">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <Button type="submit" variant="success" className="fw-bold m-3">
                            Registrar
                        </Button>
                    </form>
                    <Button
                        variant="outline-primary"
                        onClick={() => navigate('/dashboard')}
                        className="fw-semibold"
                    >
                        Volver al Dashboard
                    </Button>
                </Card.Body>
            </Card>
        </Container>
        </div>
    );
}

export default RegistrarTarjeta;
