import React, { useState } from 'react';
import { Container, Button, Form, Card } from 'react-bootstrap';
import './ChatbotPage.css'
import { useNavigate  } from 'react-router-dom';


function ChatbotPage() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hola, ¿en qué puedo ayudarte hoy? Elige una opción:' },
    ]);
    const [userInput, setUserInput] = useState('');
    const navigate = useNavigate();
    

    const handleOptionClick = (option) => {
        // Añadir la opción seleccionada al chat
        const newMessages = [...messages, { sender: 'user', text: option }];
        setMessages(newMessages);

        // Simular la respuesta del bot basada en la opción seleccionada
        let botResponse = 'Lo siento, no entendí eso.';

        if (option.toLowerCase() === 'saldo') {
            botResponse = 'Tu saldo actual es $100.';
        } else if (option.toLowerCase() === 'movimientos') {
            botResponse = 'Tus últimos movimientos fueron: Recarga de $50 hace 2hrs, Recarga de $20 hace 3 días.';
        } else if (option.toLowerCase() === 'reporte') {
            botResponse = '¿Qué tipo de reporte necesitas?';
        } else if (option.toLowerCase() === 'tramites') {
            botResponse = '¿Qué tipo de tarjeta deseas tramitar?';
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: botResponse },
        ]);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        // Añadir el mensaje del usuario al chat
        const newMessages = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);

        // Simular la respuesta del bot después de escribir
        setUserInput('');

        setTimeout(() => {
            let botResponse = 'Lo siento, no entendí eso.';

            if (userInput.toLowerCase().includes('saldo')) {
                botResponse = 'Tu saldo actual es $100.';
            } else if (userInput.toLowerCase().includes('movimientos')) {
                botResponse = 'Tus últimos movimientos fueron: Recarga de $50 hace 2hrs, Recarga de $20 hace 3 días.';
            } else if (userInput.toLowerCase().includes('reporte')) {
                botResponse = '¿Qué tipo de reporte necesitas?';
            } else if (userInput.toLowerCase().includes('tramites')) {
                botResponse = '¿Qué tipo de tarjeta deseas tramitar?';
            }

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: botResponse },
            ]);
        }, 1000); // Simula el tiempo de respuesta del bot
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <Container className="mb-5" style={{ maxWidth: '700px', marginTop: '40px' }}>
      <h1 className="Bienvenida">Chatbot de Soporte</h1>

      <Card className="shadow-sm border rounded mb-4">
        <Card.Body style={{ height: '400px', overflowY: 'scroll', backgroundColor: '#f9f9f9' }}>
          {messages.map((message, index) => (
            <div key={index} className="mb-3">
              <strong className="text-primary">{message.sender === 'bot' ? '🤖 Bot:' : '🧑‍💻 Tú:'}</strong>
              <p className="text-dark fw-semibold">{message.text}</p>
            </div>
          ))}
        </Card.Body>
      </Card>

      {(messages.length === 1 || messages[messages.length - 1].sender === 'bot') && (
        <div className="mb-4 text-center d-flex flex-wrap gap-2 justify-content-center">
          <Button variant="outline-primary" onClick={() => handleOptionClick('saldo')}>
            Consultar Saldo
          </Button>
          <Button variant="outline-secondary" onClick={() => handleOptionClick('movimientos')}>
            Ver Movimientos
          </Button>
          <Button variant="outline-danger" onClick={() => handleOptionClick('reporte')}>
            Reporte
          </Button>
          <Button variant="outline-success" onClick={() => handleOptionClick('tramites')}>
            Trámites
          </Button>
        </div>
      )}

      <Form onSubmit={handleSendMessage}>
        <Form.Group controlId="userMessage">
          <Form.Control
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
        </Form.Group>

        <div className="mt-3 d-flex justify-content-between">
          <Button variant="primary" type="submit">
            Enviar
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
        </div>
      </Form>
    </Container>
    </div>
  );
}

export default ChatbotPage;
