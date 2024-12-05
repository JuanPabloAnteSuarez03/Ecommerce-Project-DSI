import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import logoDark from '../../../assets/images/logo-dark.png';
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from '../../../utils/axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); 
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState(''); 
  const [first_name, setFirstName] = useState(''); // Added
  const [last_name, setLastName] = useState('');   // Added
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsRegister(!isRegister);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Registration request
        const response = await axiosInstance.post('/users/signup/',{
          username,
          password, 
          password2,
          email, 
          first_name,  
          last_name,
          cedula, 
          direccion,
          telefono,
          rol: 1,
          
        });

        if (response.status === 201) {
          setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
          setIsRegister(false); // Switch to login after registration 
          localStorage.setItem("accessToken", response.data.access);
          localStorage.setItem("refreshToken", response.data.refresh);
        }
      } else {
        // Login request
        const response = await axiosInstance.post('/users/login/', {
          username,
          password,
        });

        const { access, refresh, isSuperuser } = response.data;

        localStorage.setItem('userRole', isSuperuser ? 'superuser' : 'user');
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        setMessage(`Bienvenido, ${username}`);
        console.log('Login successful');

        if (isSuperuser) {
          navigate('/app/dashboard/analytics');
        } else {
          navigate('/productos');
        }
      }
    } catch (error) {
      console.error('Error:', error.response || error);
      const errorMessage = error.response?.data?.message || 'Error en la operación.';
      setMessage(errorMessage);
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content text-center">
          <Card className="borderless">
            <Row className="align-items-center text-center">
              <Col>
                <Card.Body className="card-body">
                  <img src={logoDark} alt="Logo" className="img-fluid mb-4" />
                  <h4 className="mb-3 f-w-400">{isRegister ? "Sign up" : "Sign in"}</h4>

                  {/* Username field */}
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />

                  {/* Email field */}
                  {isRegister && (
                    <input
                      type="email"
                      className="form-control mb-3"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  )}

                  {/* Cedula */}
                  {isRegister && (
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Cédula"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      required
                    />
                  )}

                  {/* Direccion */}
                  {isRegister && (
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Dirección"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      required
                    />
                  )}

                  {/* Telefono */}
                  {isRegister && (
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Teléfono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                    />
                  )}

                  {isRegister && (
                    <>
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="First Name"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Last Name"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </>
                  )}

                  {/* Password field */}
                  <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {isRegister && (
                    <input
                      type="password"
                      className="form-control mb-3"
                      placeholder="Confirm Password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      required
                    />
                  )}

                  {/* Submit button */}
                  <button
                    className="btn btn-primary btn-block mb-4"
                    onClick={handleSubmit}
                  >
                    {isRegister ? "Sign up" : "Sign in"}
                  </button>

                  {/* Switch between login and signup */}
                  <p className="mb-2">
                    {isRegister ? "Already have an account?" : "Don’t have an account?"}{' '}
                    <span
                      onClick={handleSwitch}
                      className="f-w-400"
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      {isRegister ? "Sign in" : "Sign up"}
                    </span>
                  </p>

                  {/* Response message */}
                  {message && <p className="text-success">{message}</p>}
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
