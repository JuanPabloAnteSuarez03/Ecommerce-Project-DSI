import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

// Importa las imágenes
//import imagen1 from '/src/assets/images/carrito/producto1.png';
//import imagen2 from '/src/assets/images/carrito/producto2.png';
//import imagen3 from '/src/assets/images/carrito/producto3.png';

function Carrito() {
  /*const products = [
    { id: 1, name: 'Producto 1', price: 100, image: imagen1 },
    { id: 2, name: 'Producto 2', price: 150, image: imagen2 },
    { id: 3, name: 'Producto 3', price: 200, image: imagen3 },
  ];*/
  
  const [product, setProcduct] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  //Mas adelante elimiar esto
  const shippingCost = 10; // Costo fijo de envío en dólares

  // Esto es para obtener los productos de la base de datos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products/api/productos/');
        console.log('Datos obtenidos de la API:', response.data);
        setProcduct(response.data)
      } catch(error){
        console.error('Error al obtener los productos', error)
      }
      
    };
    fetchProducts();
  }, []);

  //Obtener el carrito del usuario que esta en la db
  useEffect(() => {
    const fetchCart = async () => {
      try{
        const response = await axiosInstance.get('/shopping_car/cart/');
        console.log('Datos del carrito obtenidos de la API:', response.data);
        setCart(response.data.items);
      }catch (error){
        console.error('Error al obtener el carrito', error)
      }
    };
    fetchCart();
  }, []);

  // Función para agregar productos al carrito
  const addToCart = async(product) => {
    try{
      const response = await axiosInstance.post('/shopping_car/cart/add_item/', {
        product_id: product.id,
        cantidad: 1,
      });
      setCart(response.data.items);
    } catch (error){
      console.error('Error al agregar el articulo al carrito', error);
    }
  };

  // Función para reducir la cantidad de productos en el carrito
  const decreaseQuantity = async (productId) => {
    // Encuentra el producto en el carrito
    const item = cart.find((product) => product.producto.id === productId);
  
    // Si el producto existe y su cantidad actual es mayor a 1, reduce la cantidad
    if (item && item.cantidad > 1) {
      try {
        const newQuantity = item.cantidad - 1; // Calcula la nueva cantidad
        const response = await axiosInstance.post('/shopping_car/cart/update_quantity/', {
          product_id: productId,
          cantidad: newQuantity, // Envía la nueva cantidad calculada
        });
        setCart(response.data.items); // Actualiza el carrito con la respuesta del servidor
      } catch (error) {
        console.error('Error al reducir la cantidad del artículo en el carrito', error);
      }
    } else {
      console.warn('No se puede reducir la cantidad por debajo de 1. Usa la función remove para eliminar el producto.');
    }
  };
  

  // Función para eliminar un producto del carrito
  const removeFromCart = async(productId) => {
    try{
      const reponse = await axiosInstance.post('/shopping_car/cart/remove_item/', {
        product_id: productId,
      });
      setCart(reponse.data.items);
    }catch (error){
      console.error('Error al eliminar el articulo del carrito', error)
    }
  };

  // Función para vaciar el carrito
  const clearCart = async() => {
    try{
      const response = await axiosInstance.post('/shopping_car/cart/clear/');
      setCart(response.data.items)
    }catch(error){
      console.error('Error al vaciar el carrito', error)
    }
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      return shippingCost;
    }
  
    return cart.reduce((total, item) => total + item.producto.precio * item.cantidad, 0) 
  };

  return (
    <div className="container mt-5">
  
      {/* Carrito de Compras */}
      <h1 className="text-center">Carrito de Compras</h1>
      {Array.isArray(cart) && cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup>
              {Array.isArray(cart) &&
                cart.map((item) => (
                  <ListGroup.Item
                    key={item.id}
                    className="d-flex justify-content-between align-items-center"
                  >
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
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.producto.id)}
                    >
                      Eliminar
                    </Button>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Col>
  
          {/* Resumen del carrito */}
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
                  onClick={() => alert('Compra realizada con éxito')}
                >
                  Finalizar Compra
                </Button>
                <Button
                  variant="danger"
                  className="w-100 mt-2"
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
  
      {/* Productos */}
      <h2 className="text-center">Productos</h2>
      <div className="row">
        {Array.isArray(product) && product.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          Array.isArray(product) &&
          product.map((product) => (
            <div key={product.id} className="col-12 col-md-4 mb-4">
              <div className="card">
                <img
                  src={product.imagen} // Campo correcto
                  className="card-img-top"
                  alt={product.nombre_producto}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.nombre_producto}</h5>
                  <p className="card-text">{product.descripcion}</p>
                  <p className="card-text">Precio: ${product.precio}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Carrito;
