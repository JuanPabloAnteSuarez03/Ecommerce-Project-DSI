import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import axiosInstance from '../../../utils/axios';
import "./styles.css";

// assets
import logoDark from '../../../assets/images/logo-dark.png';

const ResetPassword1 = () => {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validar campos vacíos
    if (!username || !currentPassword || !newPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      // Llamado a la API con Axios
      const response = await axiosInstance.post('/users/change-password/', {
        username,
        current_password: currentPassword,
        new_password: newPassword,
      });

      setMessage('Contraseña actualizada con éxito. Ahora puedes iniciar sesión.');
    } catch (err) {
      setError('Error al restablecer la contraseña. Verifica los datos e inténtalo de nuevo.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content text-center">
        <Card className="borderless">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body">
                <img src={logoDark} alt="" className="img-responsive" />
                <br />
                <h4 className="mb-3 f-w-400">Reset your password</h4>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre de usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Contraseña actual"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-4">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Nueva contraseña"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-block btn-primary mb-4">
                    Reset password
                  </button>
                </form>
                <p className="mb-0 text-muted">
                  Don’t have an account?{' '}
                  <NavLink to="/auth/signup-1" className="f-w-400">
                    Signup
                  </NavLink>
                </p>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword1;

