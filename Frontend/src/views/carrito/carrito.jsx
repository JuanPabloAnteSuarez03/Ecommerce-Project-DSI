import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

// Importa las imágenes
import imagen1 from '/src/assets/images/carrito/producto1.png';
import imagen2 from '/src/assets/images/carrito/producto2.png';
import imagen3 from '/src/assets/images/carrito/producto3.png';

function Carrito() {
  const products = [
    { id: 1, name: 'Producto 1', price: 100, image: imagen1 },
    { id: 2, name: 'Producto 2', price: 150, image: imagen2 },
    { id: 3, name: 'Producto 3', price: 200, image: imagen3 },
  ];

  const [cart, setCart] = useState([]);
  const shippingCost = 10; // Costo fijo de envío en dólares

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Función para reducir la cantidad de productos en el carrito
  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return subtotal + shippingCost;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Tienda</h1>

      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-md-4 mb-4">
            <div className="card">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Precio: ${product.price}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => addToCart(product)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-5">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img src={item.image} alt={item.name} width="50" height="50" className="me-3" />
                    <div>
                      <h5>{item.name}</h5>
                      <p className="mb-1">Precio: ${item.price}</p>
                      <div className="d-flex align-items-center">
                        <Button variant="secondary" size="sm" onClick={() => decreaseQuantity(item.id)}>-</Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button variant="secondary" size="sm" onClick={() => addToCart(item)}>+</Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>Eliminar</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          
          <Col md={4}>
            <Card className="mt-4">
              <Card.Header><h5>Resumen de la Orden</h5></Card.Header>
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
                <Button variant="success" className="w-100 mt-3" onClick={() => alert('Compra realizada con éxito')}>Finalizar Compra</Button>
                <Button variant="danger" className="w-100 mt-2" onClick={clearCart}>Vaciar Carrito</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Carrito;
