import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import logoDark from '../../../assets/images/logo-dark.png';
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from '../../../utils/axios';

const Login = () => {
  const [loginUsername, setLoginUsername] = useState(''); // Login username
  const [loginPassword, setLoginPassword] = useState(''); // Login password

  const [registerUsername, setRegisterUsername] = useState(''); // Register username
  const [registerPassword1, setRegisterPassword1] = useState(''); // Register password1
  const [registerPassword2, setRegisterPassword2] = useState(''); // Register password2
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsRegister(!isRegister);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Registro
        const response = await axiosInstance.post('/users/signup/', {
          username: registerUsername,
          password1: registerPassword1,
          password2: registerPassword2,
          email,
          first_name: firstName,
          last_name: lastName,
          cedula,
          direccion,
          telefono,
          rol: {
            nombre: 'Comprador'  // Cambia esto de un string a un objeto
          },
          groups: [2],
        });

        if (response.status === 201) {
          setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
          setIsRegister(false);
        }
      } else {
        // Inicio de sesión
        const response = await axiosInstance.post('users/login/', {
          username: loginUsername,
          password: loginPassword,
        });
        console.log('Respuesta completa del backend:', response.data);
        const {access, refresh} = response.data.tokens; 
        console.log('Access Token:', access);
        console.log('Refresh Token:', refresh);

        
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        console.log('Access Token guardado:', localStorage.getItem('accessToken'));
        console.log('Refresh Token guardado:', localStorage.getItem('refreshToken'));

        setMessage(`Bienvenido, ${loginUsername}`);
        navigate('/productos');
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
                <Card.Body>
                  <img src={logoDark} alt="Logo" className="img-fluid mb-4" />
                  <h4 className="mb-3 f-w-400">{isRegister ? 'Sign up' : 'Sign in'}</h4>

                  {/* Campos de inicio de sesión */}
                  {!isRegister && (
                    <>
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Username"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </>
                  )}

                  {/* Campos de registro */}
                  {isRegister && (
                    <>
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Username"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        className="form-control mb-3"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Cédula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Dirección"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        value={registerPassword1}
                        onChange={(e) => setRegisterPassword1(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Confirm Password"
                        value={registerPassword2}
                        onChange={(e) => setRegisterPassword2(e.target.value)}
                        required
                      />
                    </>
                  )}

                  <button className="btn btn-primary btn-block mb-4" onClick={handleSubmit}>
                    {isRegister ? 'Sign up' : 'Sign in'}
                  </button>

                  <p className="mb-2">
                    {isRegister ? 'Already have an account?' : 'Don’t have an account?'}{' '}
                    <span
                      onClick={handleSwitch}
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      {isRegister ? 'Sign in' : 'Sign up'}
                    </span>
                  </p>

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
