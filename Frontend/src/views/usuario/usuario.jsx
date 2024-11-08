import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Form, Col, Row } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaCity, FaLock, FaCreditCard } from 'react-icons/fa';
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';

function Usuario() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    firstSurname: '',
    secondSurname: '',
    sex: '',
    email: '',
    phoneNumber: '',
    mobilePrefix: '+',
    mobileNumber: '',
    address: '',
    city: '',
    username: '',
    password: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle sex selection (collapsed)
  const handleSexChange = (value) => {
    setFormData((prevData) => ({ ...prevData, sex: value }));
  };

  // Handle next step
  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  // Handle previous step
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Submit the form
  const handleSubmit = () => {
    // Add validation logic if necessary (e.g. for card number, expiry date)
    alert('Usuario creado con éxito');
    console.log(formData);
    setFormData({
      firstName: '',
      secondName: '',
      firstSurname: '',
      secondSurname: '',
      sex: '',
      email: '',
      phoneNumber: '',
      mobilePrefix: '+',
      mobileNumber: '',
      address: '',
      city: '',
      username: '',
      password: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    });
    setStep(1);
  };

  // Render step based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4><FaUser /> Información Personal</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Primer Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ingresa tu primer nombre"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Segundo Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="secondName"
                    value={formData.secondName}
                    onChange={handleChange}
                    placeholder="Ingresa tu segundo nombre"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Primer Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstSurname"
                    value={formData.firstSurname}
                    onChange={handleChange}
                    placeholder="Ingresa tu primer apellido"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Segundo Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="secondSurname"
                    value={formData.secondSurname}
                    onChange={handleChange}
                    placeholder="Ingresa tu segundo apellido"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Sexo</Form.Label>
                <Form.Control as="select"name="sex"value={formData.sex}onChange={handleChange}>
                    <option value="">Selecciona tu sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                </Form.Control>
            </Form.Group>

            
          </>
        );
      case 2:
        return (
          <>
            <h4><FaEnvelope /> Datos de Contacto</h4>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu email"
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Prefijo</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobilePrefix"
                    value={formData.mobilePrefix}
                    onChange={handleChange}
                    placeholder="+"
                    maxLength="3"
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Celular</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Ingresa tu número celular"
                    maxLength="10"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Número de Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Ingresa tu número de teléfono"
              />
            </Form.Group>
          </>
        );
        case 3:
          return (
            <>
              <h4><FaCity /> Dirección Completa</h4>
              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ingresa tu dirección completa"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ingresa tu ciudad"
                />
              </Form.Group>
        
              <Form.Group className="mb-3">
                <Form.Label>Estado/Provincia</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Ingresa tu estado o provincia"
                />
              </Form.Group>
        
              <Form.Group className="mb-3">
                <Form.Label>Código Postal</Form.Label>
                <Form.Control
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Ingresa tu código postal"
                />
              </Form.Group>
        
              <Form.Group className="mb-3">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Ingresa tu país"
                />
              </Form.Group>
        
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Dirección</Form.Label>
                <Form.Control
                  as="select"
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleChange}
                >
                  <option value="home">Casa</option>
                  <option value="office">Oficina</option>
                </Form.Control>
              </Form.Group>
            </>
          );
        
      case 4:
        return (
          <>
            <h4><FaLock /> Creación de Cuenta</h4>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingresa un nombre de usuario"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa una contraseña"
              />
            </Form.Group>
          </>
        );
      case 5:
        return (
          <>
            <h4><FaCreditCard /> Datos de Pago</h4>
            <Form.Group className="mb-3">
              <Form.Label>Número de Tarjeta</Form.Label>
              <Form.Control
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="Ingresa el número de tarjeta"
                maxLength="16"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Expiración (MM/YY)</Form.Label>
              <Form.Control
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="Ingresa el CVV"
                maxLength="4"
              />
            </Form.Group>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <Card className="p-4 custom-card">
        <h2 className="text-center mb-4">Registro de Usuario</h2>
        <Form>{renderStep()}</Form>
        <div className="d-flex justify-content-between mt-4">
          {step > 1 && (
            <Button variant="secondary" onClick={prevStep}>
              <BsArrowLeft /> Anterior
            </Button>
          )}
          {step < 5 && (
            <Button variant="primary" onClick={nextStep}>
              Siguiente <BsArrowRight />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Usuario;
