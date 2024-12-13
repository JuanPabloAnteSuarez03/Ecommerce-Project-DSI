import React, { useState, useContext } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { CategoryContext } from '../../contexts/CategoryContext';

// react-bootstrap
import { Table, ListGroup } from 'react-bootstrap';

// third party
import Chart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import OrderCard from '../../components/Widgets/Statistic/OrderCard';
import SocialCard from '../../components/Widgets/Statistic/SocialCard';

import uniqueVisitorChart from './chart/analytics-unique-visitor-chart';
import customerChart from './chart/analytics-cuatomer-chart';
import customerChart1 from './chart/analytics-cuatomer-chart-1';

// assets
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import imgGrid1 from '../../assets/images/gallery-grid/img-grd-gal-1.jpg';
import imgGrid2 from '../../assets/images/gallery-grid/img-grd-gal-2.jpg';
import imgGrid3 from '../../assets/images/gallery-grid/img-grd-gal-3.jpg';

const DashAnalytics = () => {
  const [categoryInput, setCategoryInput] = useState('');
  const { createCategory, categories } = useContext(CategoryContext);

  // Maneja el cambio del campo de texto
  const handleCategoryChange = (e) => {
    setCategoryInput(e.target.value);
  };

  // Enviar la nueva categoría
  const handleCategorySubmit = () => {
    if (categoryInput.trim()) {
      createCategory(categoryInput);
      setCategoryInput('');
    }
  };

  return (
    <React.Fragment>
      <Row>
        {/* Order Cards */}
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Orders Received',
              class: 'bg-c-blue',
              icon: 'feather icon-shopping-cart',
              primaryText: '486',
              secondaryText: 'Completed Orders',
              extraText: '351'
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Total Sales',
              class: 'bg-c-green',
              icon: 'feather icon-tag',
              primaryText: '1641',
              secondaryText: 'This Month',
              extraText: '213'
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Revenue',
              class: 'bg-c-yellow',
              icon: 'feather icon-repeat',
              primaryText: '$42,562',
              secondaryText: 'This Month',
              extraText: '$5,032'
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Total Profit',
              class: 'bg-c-red',
              icon: 'feather icon-award',
              primaryText: '$9,562',
              secondaryText: 'This Month',
              extraText: '$542'
            }}
          />
        </Col>

        {/* Charts */}
        <Col md={12} xl={6}>
          <Card>
            <Card.Header>
              <h5>Unique Visitor</h5>
            </Card.Header>
            <Card.Body className="ps-4 pt-4 pb-0">
              <Chart {...uniqueVisitorChart} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} xl={6}>
          <Row>
            <Col sm={6}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col sm="auto">
                      <span>Customers</span>
                    </Col>
                    <Col className="text-end">
                      <h2 className="mb-0">826</h2>
                      <span className="text-c-green">
                        8.2%
                        <i className="feather icon-trending-up ms-1" />
                      </span>
                    </Col>
                  </Row>
                  <Chart {...customerChart} />
                  <Row className="mt-3 text-center">
                    <Col>
                      <h3 className="m-0">
                        <i className="fas fa-circle f-10 mx-2 text-success" />
                        674
                      </h3>
                      <span className="ms-3">New</span>
                    </Col>
                    <Col>
                      <h3 className="m-0">
                        <i className="fas fa-circle text-primary f-10 mx-2" />
                        182
                      </h3>
                      <span className="ms-3">Return</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="bg-primary text-white">
                <Card.Body>
                  <Row>
                    <Col sm="auto">
                      <span>Customers</span>
                    </Col>
                    <Col className="text-end">
                      <h2 className="mb-0 text-white">826</h2>
                      <span className="text-white">
                        8.2%
                        <i className="feather icon-trending-up ms-1" />
                      </span>
                    </Col>
                  </Row>
                  <Chart {...customerChart1} />
                  <Row className="mt-3 text-center">
                    <Col>
                      <h3 className="m-0 text-white">
                        <i className="fas fa-circle f-10 mx-2 text-success" />
                        674
                      </h3>
                      <span className="ms-3">New</span>
                    </Col>
                    <Col>
                      <h3 className="m-0 text-white">
                        <i className="fas fa-circle f-10 mx-2 text-white" />
                        182
                      </h3>
                      <span className="ms-3">Return</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Agregar Nueva Categoría */}
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>Agregar Nueva Categoría</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la categoría</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el nombre de la categoría"
                  value={categoryInput}
                  onChange={handleCategoryChange}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleCategorySubmit}>
                Agregar Categoría
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Lista de Categorías */}
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>Lista de Categorías</h5>
            </Card.Header>
            <Card.Body>
              {categories.length > 0 ? (
                <ul>
                  {categories.map((category) => (
                    <li key={category.id}>{category.nombre_categoria}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay categorías disponibles.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
