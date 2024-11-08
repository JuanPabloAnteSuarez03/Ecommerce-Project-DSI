import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Form, Col, Row } from 'react-bootstrap';
import { FaBox, FaDollarSign, FaCalendarAlt, FaIndustry, FaPen } from 'react-icons/fa';
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';

function IngresoProducto() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    cost: '',
    sellingPrice: '',
    quantity: 1,
    productImage: '',
    productDate: '',
    distributor: '',
    isNewDistributor: false,
    distributorID: '',
    distributorCity: '',
    contactName: '',
    contactNumber: '',
    companyAddress: '',
    companyNIT: '',
    bankAccountNumber: '',
  });
  const [distributorData, setDistributorData] = useState({
    distributorID: '',
    distributorCity: '',
    contactName: '',
    contactNumber: '',
    companyAddress: '',
    companyNIT: '',
    bankAccountNumber: '',
  });
  const [distributors, setDistributors] = useState([
    {
      name: 'distribuidor1',
      distributorID: 'D1',
      distributorCity: 'Bogotá',
      contactName: 'Juan Pérez',
      contactNumber: '123456789',
      companyAddress: 'Calle 123',
      companyNIT: '123456789-0',
      bankAccountNumber: '0012345678',
    },
    {
      name: 'distribuidor2',
      distributorID: 'D2',
      distributorCity: 'Medellín',
      contactName: 'Carlos Gómez',
      contactNumber: '987654321',
      companyAddress: 'Carrera 45',
      companyNIT: '987654321-1',
      bankAccountNumber: '0098765432',
    },
    {
      name: 'distribuidor3',
      distributorID: 'D3',
      distributorCity: 'Cali',
      contactName: 'Ana López',
      contactNumber: '456789012',
      companyAddress: 'Avenida 67',
      companyNIT: '456789012-3',
      bankAccountNumber: '0045678901',
    },
  ]);
  const [distributorFound, setDistributorFound] = useState(false);
  const [isDataModified, setIsDataModified] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // If data has changed, mark the distributor data as modified
    if (distributorFound) {
      setDistributorData((prevData) => {
        const newData = { ...prevData, [name]: value };
        setIsDataModified(JSON.stringify(newData) !== JSON.stringify(distributorData));
        return newData;
      });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData((prevData) => ({ ...prevData, productImage: e.target.files[0] }));
  };

  // Handle next step
  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  // Handle previous step
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handle distributor search
  const handleDistributorSearch = () => {
    const foundDistributor = distributors.find((distributor) =>
      distributor.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(formData.distributor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    );

    if (foundDistributor) {
      setDistributorData(foundDistributor);
      setDistributorFound(true);
      setIsDataModified(false); // Reset data modified state when distributor is found
      setSuccessMessage(''); // Clear any previous success message
    } else {
      setDistributorData({
        distributorID: '',
        distributorCity: '',
        contactName: '',
        contactNumber: '',
        companyAddress: '',
        companyNIT: '',
        bankAccountNumber: '',
      });
      setDistributorFound(false);
      setIsDataModified(false);
    }
  };

  // Handle new distributor toggle
  const handleDistributorToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      isNewDistributor: !prevData.isNewDistributor,
    }));
  };

  // Handle submit of new distributor
  const handleNewDistributorSubmit = () => {
    setDistributors((prevDistributors) => [
      ...prevDistributors,
      { ...distributorData, name: formData.distributor },
    ]);
    setFormData({
      productName: '',
      productDescription: '',
      cost: '',
      sellingPrice: '',
      quantity: 1,
      productImage: '',
      productDate: '',
      distributor: '',
      isNewDistributor: false,
      distributorID: '',
      distributorCity: '',
      contactName: '',
      contactNumber: '',
      companyAddress: '',
      companyNIT: '',
      bankAccountNumber: '',
    });
    setStep(1);
    setSuccessMessage('Datos de distribuidor nuevo ingresados exitosamente');
  };

  // Handle update of distributor data
  const handleUpdateDistributor = () => {
    const updatedDistributors = distributors.map((distributor) =>
      distributor.name === formData.distributor ? { ...distributorData, name: formData.distributor } : distributor
    );
    setDistributors(updatedDistributors);
    setSuccessMessage('Datos ingresados exitosamente');
  };

  // Handle key down event for Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleDistributorSearch();
    }
  };

  // Handle submit the product data
  const handleSubmit = () => {
    alert('Producto ingresado con éxito');
    console.log(formData);
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
                  <Form.Label>Costo</Form.Label>
                  <Form.Control
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="Ingresa el costo del producto"
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio de Venta</Form.Label>
                  <Form.Control
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    placeholder="Ingresa el precio de venta"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha del Producto</Form.Label>
                  <Form.Control
                    type="date"
                    name="productDate"
                    value={formData.productDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
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
            <h4><FaIndustry /> Datos del Distribuidor</h4>
            <Form.Group className="mb-3">
              <Form.Label>Distribuidor</Form.Label>
              <Form.Control
                type="text"
                name="distributor"
                value={formData.distributor}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Escribe el nombre del distribuidor"
              />
              <Button variant="info" onClick={handleDistributorSearch}>
                Buscar Distribuidor
              </Button>
            </Form.Group>

            {distributorFound && (
              <div>
                <h5>Datos del Distribuidor</h5>
                <Form.Group className="mb-3">
                  <Form.Label>ID del Distribuidor</Form.Label>
                  <Form.Control
                    type="text"
                    name="distributorID"
                    value={distributorData.distributorID}
                    onChange={handleChange}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    name="distributorCity"
                    value={distributorData.distributorCity}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Contacto</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactName"
                    value={distributorData.contactName}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono de Contacto</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactNumber"
                    value={distributorData.contactNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección de la Empresa</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyAddress"
                    value={distributorData.companyAddress}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>NIT de la Empresa</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyNIT"
                    value={distributorData.companyNIT}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cuenta Bancaria</Form.Label>
                  <Form.Control
                    type="text"
                    name="bankAccountNumber"
                    value={distributorData.bankAccountNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleUpdateDistributor}
                  disabled={!isDataModified}
                >
                  Actualizar
                </Button>
              </div>
            )}

            <Form.Check
              type="checkbox"
              label="Distribuidor Nuevo"
              checked={formData.isNewDistributor}
              onChange={handleDistributorToggle}
            />
            {formData.isNewDistributor && (
              <>
                <h5>Ingresar Nuevo Distribuidor</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Distribuidor</Form.Label>
                  <Form.Control
                    type="text"
                    name="distributor"
                    value={formData.distributor}
                    onChange={handleChange}
                    placeholder="Nombre del distribuidor"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>ID del Distribuidor</Form.Label>
                  <Form.Control
                    type="text"
                    name="distributorID"
                    value={formData.distributorID}
                    onChange={handleChange}
                    placeholder="ID del distribuidor"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    name="distributorCity"
                    value={formData.distributorCity}
                    onChange={handleChange}
                    placeholder="Ciudad"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Contacto</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Nombre del encargado"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono de Contacto</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Número de contacto"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección de la Empresa</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    placeholder="Dirección"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>NIT de la Empresa</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyNIT"
                    value={formData.companyNIT}
                    onChange={handleChange}
                    placeholder="NIT"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cuenta Bancaria</Form.Label>
                  <Form.Control
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    placeholder="Número de cuenta bancaria"
                  />
                </Form.Group>
                <Button variant="success" onClick={handleNewDistributorSubmit}>
                  Ingresar Nuevo Distribuidor
                </Button>
              </>
            )}
          </>
        );
      case 4:
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
              disabled={step === 4}
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
