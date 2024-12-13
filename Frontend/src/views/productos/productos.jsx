import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../utils/axios';
import { useCart } from '../../contexts/CartContext';
import { useFavorite } from '../../contexts/FavoriteContext'; // Importa el contexto de favoritos
import './productos.css';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortPrice, setSortPrice] = useState('lowToHigh');
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the cart context
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, favorites } = useFavorite(); // Traemos addFavorite y removeFavorite del contexto de favoritos

  const itemsPerPage = 6;

  
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get('/products/api/productos/');

        if (!response.data || response.data.length === 0) {
          setError('No se encontraron productos');
        }

        setProductos(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Hubo un error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const isProductFavorite = (productId) => {
    return favorites.some(fav => fav.producto === productId);
  };

  const handleFavoriteClick = (product) => {
    if (isProductFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  // Filtrar y ordenar los productos
  const filteredProducts = productos
    .filter(product =>
      product.nombre_producto.toLowerCase().includes(search.toLowerCase()) &&
      (category ? product.categoria.toString() === category : true) &&
      (minPrice ? parseFloat(product.precio) >= parseFloat(minPrice) : true) &&
      (maxPrice ? parseFloat(product.precio) <= parseFloat(maxPrice) : true)
    )
    .sort((a, b) => {
      if (sortPrice === 'lowToHigh') return parseFloat(a.precio) - parseFloat(b.precio);
      return parseFloat(b.precio) - parseFloat(a.precio);
    });

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleSortChange = (e) => setSortPrice(e.target.value);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setIsModalVisible(false);
  };

  // Handling loading and error states
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <br />
          Verificá la conexión con el backend o la configuración de tu API.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Productos</h1>

      {/* Barra de búsqueda */}

      <div className="row justify-content-center mb-3">

        <div className="col-md-8">

          <input

            type="text"

            className="form-control text-center"

            placeholder="Buscar productos..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        </div>



{/* Filtros */}

<div className="row justify-content-center mb-4">

  <div className="col-auto">
          <select className="form-select" onChange={handleCategoryChange} value={category}>
            <option value="">Filtrar por categoría</option>
            <option value="1">Electrodomésticos</option>
            <option value="2">Útiles</option>
            <option value="3">Libros</option>
          </select>
        </div>
        <div className="col-auto">
          <select className="form-select" onChange={handleSortChange} value={sortPrice}>
            <option value="lowToHigh">Precio: Bajo a Alto</option>
            <option value="highToLow">Precio: Alto a Bajo</option>
          </select>
        </div>
        <div className="col-auto">
          <input
            type="number"
            className="form-control"
            placeholder="Precio Mínimo"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
        </div>
        <div className="col-auto">
          <input
            type="number"
            className="form-control"
            placeholder="Precio Máximo"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>
      </div>

      <div className="row">
        {paginatedProducts.length === 0 ? (
          <div className="col-12 text-center">
            <p>No se encontraron productos que coincidan con los filtros.</p>
          </div>
        ) : (
          paginatedProducts.map(product => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card">
                <img 
                  src={product.imagen} 
                  className="card-img-top" 
                  alt={product.nombre_producto}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.nombre_producto}</h5>
                  <p className="card-text">Precio: ${product.precio}</p>
                  <p className="card-text">Stock: {product.stock}</p>
                  <div className="button-group">
                    <button 
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      Agregar al carrito
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleProductClick(product)}
                    >
                      Ver detalles
                    </button>

                    {/* Botón de Favorito */}
                    <button
                      className="favorite-icon"
                      onClick={() => handleFavoriteClick(product)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none', // No necesita borde adicional aquí
                        padding: 0, // Para quitar el padding adicional que puede generar un borde visible
                        cursor: 'pointer',
                      }}
                    >
                      <i 
                        className={`fa fa-heart ${isProductFavorite(product.id) ? 'favorited' : ''}`}
                        style={{
                          fontSize: '24px'
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      <div className="pagination-container">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            {[...Array(Math.ceil(filteredProducts.length / itemsPerPage))].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Modal para los detalles del producto */}
      {isModalVisible && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="close-button" onClick={handleModalClose}>×</button>
            <img 
              src={selectedProduct.imagen} 
              alt={selectedProduct.nombre_producto} 
              className="modal-image" 
            />
            <h5 className="card-title">{selectedProduct.nombre_producto}</h5>
            <br />
            <p><strong>Descripción:</strong> {selectedProduct.descripcion || "Sin descripción adicional"}</p>
            <p className="card-text">Precio: ${selectedProduct.precio}</p>
            <p className="card-text">Stock: {selectedProduct.stock}</p> 
            <button 
              className="btn btn-primary"
              onClick={() => {
                addToCart(selectedProduct);
                handleModalClose();
              }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
