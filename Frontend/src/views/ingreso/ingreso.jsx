import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Form, Col, Row } from 'react-bootstrap';
import { FaBox, FaDollarSign, FaCalendarAlt, FaPen } from 'react-icons/fa';
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';

import axiosInstance from '../../utils/axios';
import { CategoryContext } from '../../contexts/CategoryContext';

function IngresoProducto() {
  const { categories, createCategory } = useContext(CategoryContext);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    sellingPrice: '',
    quantity: 1,
    productImage: '',
    category: '', // Category ID
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData((prevData) => ({ ...prevData, productImage: e.target.files[0] }));
  };

  // Handle next step
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  // Handle previous step
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const productData = new FormData();
    productData.append('nombre_producto', formData.productName);
    productData.append('descripcion', formData.productDescription);
    productData.append('categoria', formData.category); // Category ID
    productData.append('precio', formData.sellingPrice);
    productData.append('stock', formData.quantity);
    productData.append('vendedor', '3'); // Fixed seller ID

    if (formData.productImage) {
      console.log("Archivo seleccionado:", formData.productImage.name);
      productData.append('imagen', formData.productImage);
    } else {
      console.log("No se seleccionó archivo.");
    }

    try {
      console.log('Datos enviados al backend:');
      for (let pair of productData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      const response = await axiosInstance.post('/products/api/productos/', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Producto ingresado con éxito:', response.data);
    } catch (error) {
      console.error('Error al ingresar el producto:', error);
      alert('Error al ingresar el producto');
    }

    setFormData({
      productName: '',
      productDescription: '',
      sellingPrice: '',
      quantity: 1,
      productImage: '',
      productDate: '',
      category: '',
    });

    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4><FaBox /> Detalles del Producto</h4>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Ingresa el nombre del producto"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción del Producto</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                placeholder="Ingresa la descripción del producto"
              />
            </Form.Group>
          </>
        );
      case 2:
        return (
          <>
            <h4><FaDollarSign /> Precios y Cantidad</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio de Venta</Form.Label>
                  <Form.Control
                    type="text"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    placeholder="Ingresa el precio de venta"
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Ingresa la cantidad disponible"
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre_categoria}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen del Producto</Form.Label>
              <Form.Control
                type="file"
                name="productImage"
                onChange={handleImageChange}
              />
            </Form.Group>
          </>
        );
      case 3:
        return (
          <>
            <h4><FaPen /> Finalizar Ingreso de Datos</h4>
            <Button variant="success" onClick={handleSubmit}>
              Finalizar Ingreso de Datos
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          {renderStep()}
          {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={step === 1}
            >
              <BsArrowLeft /> Volver
            </Button>
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={step === 3}
            >
              Continuar <BsArrowRight />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default IngresoProducto;
