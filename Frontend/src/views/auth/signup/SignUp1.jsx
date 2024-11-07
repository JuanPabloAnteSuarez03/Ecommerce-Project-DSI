import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import logoDark from '../../../assets/images/logo-dark.png';
import "bootstrap/dist/css/bootstrap.min.css";

// Función para cargar usuarios desde localStorage
const loadUsers = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

// Función para guardar usuarios en localStorage
const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const SignUp1 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");  // Estado para email
  const [role, setRole] = useState("user"); // Por defecto, el rol es 'user'
  const [isRegister, setIsRegister] = useState(true);
  const [message, setMessage] = useState("");

  const handleSwitch = () => {
    setIsRegister(!isRegister);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = loadUsers();

    if (isRegister) {
      const existingUser = users.find((user) => user.username === username);
      if (existingUser) {
        setMessage("El usuario ya existe. Prueba con otro.");
      } else {
        const newUser = { username, password, email, role };
        users.push(newUser);
        saveUsers(users);
        console.log('Usuarios guardados:', users); // Agregado para verificar el almacenamiento
        setMessage("Registro exitoso. Ahora puedes iniciar sesión.");
        setIsRegister(false);
      }
    } else {
      const user = users.find((user) => user.username === username && user.password === password);
      if (user) {
        setMessage(`Bienvenido, ${user.role === "admin" ? "Administrador" : "Usuario"}`);
      } else {
        setMessage("Credenciales incorrectas. Inténtalo de nuevo.");
      }
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
                  <img src={logoDark} alt="" className="img-fluid mb-4" />
                  <h4 className="mb-3 f-w-400">{isRegister ? "Sign up" : "Sign in"}</h4>
                  <div className="input-group mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                    />
                  </div>
                  {isRegister && (
                    <div className="input-group mb-3">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Email address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                  )}
                  <div className="input-group mb-4">
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </div>
                  {isRegister && (
                    <div className="input-group mb-3">
                      <select 
                        className="form-control" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  )}
                  <button className="btn btn-primary btn-block mb-4" onClick={handleSubmit}>
                    {isRegister ? "Sign up" : "Sign in"}
                  </button>
                  {!isRegister && (
                    <p className="mb-3" style={{ cursor: "pointer", color: "blue" }}>
                      ¿Olvidaste tu contraseña?
                    </p>
                  )}
                  <p className="mb-2">
                    {isRegister ? "Already have an account?" : "Don’t have an account?"}{' '}
                    <span onClick={handleSwitch} className="f-w-400" style={{ cursor: "pointer", color: "blue" }}>
                      {isRegister ? "Sign in" : "Sign up"}
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

export default SignUp1;
