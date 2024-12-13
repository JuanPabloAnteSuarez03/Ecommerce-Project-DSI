import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext'; // Import the useCart hook
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import axiosInstance from '../../utils/axios';
import { loadStripe } from '@stripe/stripe-js';

function Carrito() {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    decreaseQuantity, 
    clearCart 
  } = useCart();

  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const shippingCost = 10; // Costo fijo de envío en dólares

  // Calcular el total de la orden
  const calculateTotal = () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      return shippingCost;
    }
    return cart.reduce((total, item) => total + item.producto.precio * item.cantidad, 0) + shippingCost;
  };

  // Inicializar Stripe
  const stripePromise = loadStripe('pk_test_51QPXZxBAvRNYwiPiltGSMR1njoWREemAfmxe9A7JpmtCfFKwrfkozjWv1Ib7oKYbjNwc2cNdbfnm2mcQMuP3hH6g00GrGlx71A');

  // Manejar el proceso de checkout
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      const response = await axiosInstance.post('/api/stripe/create-checkout-session/');
      const { id } = response.data;

      // Redirigir a stripe mediante el id que me da el backend
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error('Error al crear la sesión de pago:', error);
      alert('Hubo un problema al finalizar la compra.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando, por favor espera...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Carrito de Compras</h1>
      {Array.isArray(cart) && cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup>
              {Array.isArray(cart) && cart.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img
                      src={item.producto.imagen}
                      alt={item.producto.nombre_producto}
                      width="50"
                      height="50"
                      className="me-3"
                    />
                    <div>
                      <h5>{item.producto.nombre_producto}</h5>
                      <p className="mb-1">Precio: ${item.producto.precio}</p>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => decreaseQuantity(item.producto.id)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.cantidad}</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => addToCart(item.producto)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(item.producto.id)}>
                    Eliminar
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card className="mt-4">
              <Card.Header>
                <h5>Resumen de la Orden</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Envío</Col>
                      <Col className="text-end">${shippingCost.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col className="text-end">${calculateTotal().toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
                <Button
                  variant="success"
                  className="w-100 mt-3"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </Button>
                <Button variant="danger" className="w-100 mt-2" onClick={clearCart}>
                  Vaciar Carrito
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Carrito;
