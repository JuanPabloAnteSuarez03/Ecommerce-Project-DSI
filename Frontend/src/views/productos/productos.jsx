import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../utils/axios';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortPrice, setSortPrice] = useState('lowToHigh');
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const itemsPerPage = 6; // Para mostrar 6 productos por página

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axiosInstance.get('/products/api/productos/');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        alert('Hubo un error al cargar los productos.');
      }
    };

    fetchProductos();
  }, []);

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

  // Paginación
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleSortChange = (e) => setSortPrice(e.target.value);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Productos</h1>

      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={handleCategoryChange} value={category}>
            <option value="">Filtrar por categoría</option>
            <option value="1">Electrodomésticos</option>
            <option value="2">Útiles</option>
            <option value="3">Libros</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={handleSortChange} value={sortPrice}>
            <option value="lowToHigh">Precio: Bajo a Alto</option>
            <option value="highToLow">Precio: Alto a Bajo</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Precio Mínimo"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
        </div>
        <div className="col-md-3">
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
        {paginatedProducts.map(product => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card">
              <img src={product.imagen} className="card-img-top" alt={product.nombre_producto} />
              <div className="card-body">
                <h5 className="card-title">{product.nombre_producto}</h5>
                <p className="card-text">{product.descripcion}</p>
                <p className="card-text">Precio: ${product.precio}</p>
                <p className="card-text">Stock: {product.stock}</p>
                <button className="btn btn-primary">Agregar al carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}

export default Productos;
