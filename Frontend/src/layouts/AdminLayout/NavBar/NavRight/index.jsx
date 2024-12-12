import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate

import { ListGroup, Dropdown, Card, Modal, Button, Form } from 'react-bootstrap';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUser } from '@fortawesome/free-solid-svg-icons';

import axiosInstance from '../../../../utils/axios';

// ==============================|| NAV RIGHT ||============================== //

const NavRight = () => {

  const [userData, setUserData] = useState({ name: '' });


  // Estado para manejar el modal de configuraciones

  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState({

    notifications: true,
    darkMode: false,
    publicProfile: false,
  });

  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {

    // Hacer la solicitud a la API para obtener los datos del usuario

    axiosInstance.get('/users/comprador/')

      .then(response => {

        // Guardar el nombre del usuario en el estado

        setUserData({ name: response.data.user.username });

      })

      .catch(error => {

        console.error('Error fetching user data:', error);

      });

  }, []);

  const toggleSettingsModal = () => {
    setShowSettings(!showSettings);
  };


  const handleSettingsChange = (event) => {
    const { name, checked } = event.target;

    setSettings({
      ...settings,
      [name]: checked,
    });

  };



  const notiData = [

    { name: 'Joseph William', details: 'Purchase New Theme and make payment', activity: '30 min', },

    { name: 'Sara Soudein', details: 'currently login', activity: '30 min',},

    { name: 'Suzen', details: 'Purchase New Theme and make payment', activity: 'yesterday', },

  ];


  // Función para redirigir a "/usuario"
  const redirectToProfile = () => {
    navigate('/usuario'); // Navega a la ruta "/usuario"
  };


  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="feather icon-bell icon" />
              <span className="badge rounded-pill bg-danger">
                <span />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification notification-scroll">
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-end">
                  <Link to="#" style={{ textDecoration: 'none' }} className="m-r-10">
                    mark as read
                  </Link>
                  <Link style={{ textDecoration: 'none' }} to="#">
                    clear all
                  </Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">NEW</p>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="notification">
                    <Card
                      className="d-flex align-items-center shadow-none mb-0 p-0"
                      style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                    >
                     <FontAwesomeIcon icon={faUser} className="img-radius" />
                      <Card.Body className="p-0">
                        <p>
                          <strong>John Doe</strong>
                          <span className="n-time text-muted">
                            <i className="icon feather icon-clock me-2" />
                            30 min
                          </span>
                        </p>
                        <p>New ticket Added</p>
                      </Card.Body>
                    </Card>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">EARLIER</p>
                  </ListGroup.Item>
                  {notiData.map((data, index) => {
                    return (
                      <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                        <Card
                          className="d-flex align-items-center shadow-none mb-0 p-0"
                          style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                        >
                          <FontAwesomeIcon icon={faUser} className="img-radius" />
                          <Card.Body className="p-0">
                            <p>
                              <strong>{data.name}</strong>
                              <span className="n-time text-muted">
                                <i className="icon feather icon-clock me-2" />
                                {data.activity}
                              </span>
                            </p>
                            <p>{data.details}</p>
                          </Card.Body>
                        </Card>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link to="#">show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <FontAwesomeIcon icon={faUser} className="img-radius wid-40" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
              <FontAwesomeIcon icon={faUser} className="img-radius" />
              <span>{userData.name || 'Loading...'}</span> {/* Aquí mostramos el nombre del usuario */}
                <Link to="#" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Dropdown.Item onClick={toggleSettingsModal}>
                    <i className="feather icon-settings" /> Settings
                  </Dropdown.Item>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                   <Dropdown.Item onClick={redirectToProfile}>
                    <i className="feather icon-user" /> Profile
                  </Dropdown.Item>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>

            {/* Modal de Configuraciones */}
      <Modal show={showSettings} onHide={toggleSettingsModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type="checkbox"
              label="Translate To English"
              name="translate"
              checked={settings.translate}
              onChange={handleSettingsChange}
            />
            <Form.Check
              type="checkbox"
              label="Dark Mode"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleSettingsChange}
            />
            <Form.Check
              type="checkbox"
              label="Public Profile"
              name="publicProfile"
              checked={settings.publicProfile}
              onChange={handleSettingsChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleSettingsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default NavRight;
