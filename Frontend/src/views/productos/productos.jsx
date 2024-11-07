import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importar las imágenes de los productos
import CanonEOSImage from "assets/images/productos/Canon EOS 1500D 241 Digital SLR.png";
import MacBookProwithIphone from "assets/images/productos/Apple MacBook Pro with Iphone.png";
import LuxuryCentrixGold from "assets/images/productos/Luxury Watches Centrix Gold.png";
import FitbitMX30 from "assets/images/productos/Fitbit MX30 Smart Watch.png";
import BoatWireless from "assets/images/productos/Boat On-Ear Wireless.png";
import AppleiPhone13Mini from "assets/images/productos/Apple iPhone 13 Mini.png";
import NikonDSLR from "assets/images/productos/Nikon DSLR Camera.png";
import SamsungGalaxyWatch from "assets/images/productos/Samsung Galaxy Watch.png";
import SonyNoiseHeadphones from "assets/images/productos/Sony Noise Cancelling Headphones.png";
import AppleiPadAir from "assets/images/productos/Apple iPad Air.png";


// Agrega otras imágenes según sea necesario

const productosData = [
  { id: 1, name: 'Canon EOS 1500D 24.1 Digital SLR', description: 'Cámara digital Canon', price: 12.99, image: CanonEOSImage, category: 'Electronics', status: 'Available' },
  { id: 2, name: 'Apple MacBook Pro with Iphone', description: 'Laptop y Iphone combo', price: 14.59, image: MacBookProwithIphone, category: 'Electronics', status: 'Available' },
  { id: 3, name: 'Luxury Watches Centrix Gold', description: 'Reloj de lujo Centrix', price: 29.99, image: LuxuryCentrixGold, category: 'Fashion', status: 'Available' },
  { id: 4, name: 'Fitbit MX30 Smart Watch', description: 'Reloj inteligente Fitbit', price: 49.99, image: FitbitMX30, category: 'Electronics', status: 'Available' },
  { id: 5, name: 'Boat On-Ear Wireless', description: 'Audífonos inalámbricos Boat', price: 81.99, image: BoatWireless, category: 'Electronics', status: 'Sold Out' },
  { id: 6, name: 'Apple iPhone 13 Mini', description: 'Smartphone Apple iPhone', price: 86.99, image: AppleiPhone13Mini, category: 'Electronics', status: 'Available' },
  { id: 7, name: 'Nikon DSLR Camera', description: 'Cámara digital Nikon', price: 99.99, image: NikonDSLR, category: 'Electronics', status: 'Available' },
  { id: 8, name: 'Samsung Galaxy Watch', description: 'Reloj inteligente Samsung', price: 199.99, image: SamsungGalaxyWatch, category: 'Electronics', status: 'Available' },
  { id: 9, name: 'Sony Noise Cancelling Headphones', description: 'Audífonos Sony con cancelación de ruido', price: 120.99, image: SonyNoiseHeadphones, category: 'Electronics', status: 'Available' },
  { id: 10, name: 'Apple iPad Air', description: 'Tableta Apple iPad', price: 379.99, image: AppleiPadAir, category: 'Electronics', status: 'Available' },
];

function Productos() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortPrice, setSortPrice] = useState('lowToHigh');
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const itemsPerPage = 6; // Para mostrar 6 productos por página

  // Filtrar y ordenar los productos
  const filteredProducts = productosData
    .filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? product.category === category : true) &&
      (minPrice ? product.price >= minPrice : true) &&
      (maxPrice ? product.price <= maxPrice : true)
    )
    .sort((a, b) => {
      if (sortPrice === 'lowToHigh') return a.price - b.price;
      return b.price - a.price;
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
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
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
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">Precio: ${product.price}</p>
                <p className={`card-text ${product.status === 'Sold Out' ? 'text-danger' : 'text-success'}`}>
                  {product.status}
                </p>
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
