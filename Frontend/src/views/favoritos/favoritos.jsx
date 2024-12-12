import React, { useEffect, useState } from 'react';
import { useFavorite } from '../../contexts/FavoriteContext';
import axiosInstance from '../../utils/axios'; // Importa la instancia de Axios para realizar solicitudes
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, Button } from 'react-bootstrap';

function Favoritos() {
  const { favorites, removeFavorite } = useFavorite();
  const [productsDetails, setProductsDetails] = useState([]);

  // Fetch product details for all favorite products
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productIds = favorites.map((fav) => fav.producto); // Obtener IDs de productos favoritos
        const promises = productIds.map((id) =>
          axiosInstance.get(`/products/api/productos/${id}/`)
        );
        const responses = await Promise.all(promises);
        setProductsDetails(responses.map((res) => res.data));
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (favorites.length > 0) {
      fetchProductDetails();
    }
  }, [favorites]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Productos Favoritos</h1>
      {favorites.length === 0 ? (
        <p>No tienes productos favoritos.</p>
      ) : (
        <Row>
          {productsDetails.map((product) => (
            <Col md={4} key={product.id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={product.imagen || 'https://via.placeholder.com/150'} // Usar placeholder si no hay imagen
                  alt={product.nombre_producto || 'Producto sin nombre'}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{product.nombre_producto || 'Producto sin nombre'}</Card.Title>
                  <Card.Text>Precio: ${product.precio || '0.00'}</Card.Text>
                  <Button
                    variant="danger"
                    onClick={() =>
                      removeFavorite(favorites.find((fav) => fav.producto === product.id).id)
                    }
                  >
                    Eliminar de Favoritos
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Favoritos;
