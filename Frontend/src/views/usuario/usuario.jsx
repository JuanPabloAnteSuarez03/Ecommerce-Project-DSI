import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './usuario.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate

const UserProfile = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: ''
  });
  const [cards, setCards] = useState([]);
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate(); // Inicializar el hook useNavigate

  // Obtener datos del perfil al cargar el componente
  useEffect(() => {
    axiosInstance
      .get('/users/comprador/') // Asegúrate de que la URL es correcta
      .then((response) => {
        console.log('Respuesta de la API:', response.data); // Verifica en consola
        const { user } = response.data; // Accede a la clave "user"
        setPersonalInfo({
          name: user.username, // Asignar "username" al campo "name"
          email: user.email
        });
      })
      .catch((error) => {
        console.error('Error al obtener los datos del perfil:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const addCard = () => {
    setCards([...cards, { id: cards.length + 1, number: '' }]);
  };

  const handleCardChange = (index, value) => {
    const newCards = [...cards];
    newCards[index].number = value;
    setCards(newCards);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const redirectToResetPassword = () => {
    navigate('/auth/reset-password-1'); // Redirigir a la ruta "/auth/reset-password-1"
  };

  return (
    <div className="user-profile">
      <h1>Perfil de Usuario</h1>

      <div className="section">
        <h2 onClick={() => toggleSection('profile')}>
          <span className="icon-text">
            <FontAwesomeIcon icon={faUser} className="icon" />
            Perfil
          </span>
          <span className={`arrow ${openSection === 'profile' ? 'up' : 'down'}`}>&#9662;</span>
        </h2>
        {openSection === 'profile' && (
          <>
            <form>
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={personalInfo.name}
                  onChange={handleInputChange}
                  readOnly // Campo solo lectura
                />
              </label>
              <label>
                Correo Electrónico:
                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handleInputChange}
                  readOnly // Campo solo lectura
                />
              </label>
            </form>
            <p>Aquí se mostrarán los datos de tu cuenta.</p>
          </>
        )}
      </div>

      <div className="section">
        <h2 onClick={() => toggleSection('security')}>
          <span className="icon-text">
            <FontAwesomeIcon icon={faLock} className="icon" />
            Seguridad
          </span>
          <span className={`arrow ${openSection === 'security' ? 'up' : 'down'}`}>&#9662;</span>
        </h2>
        {openSection === 'security' && (
          <>
            <p>Tienes configuraciones pendientes.</p>
            <button className="btn btn-primary" onClick={redirectToResetPassword}>
              Restablecer Contraseña
            </button>
          </>
        )}
      </div>

      <div className="section">
        <h2 onClick={() => toggleSection('cards')}>
          <span className="icon-text">
            <FontAwesomeIcon icon={faCreditCard} className="icon" />
            Tarjetas
          </span>
          <span className={`arrow ${openSection === 'cards' ? 'up' : 'down'}`}>&#9662;</span>
        </h2>
        {openSection === 'cards' && (
          <>
            {cards.map((card, index) => (
              <div key={card.id}>
                <label>
                  Número de tarjeta:
                  <input
                    type="text"
                    value={card.number}
                    onChange={(e) => handleCardChange(index, e.target.value)}
                  />
                </label>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={addCard}>
              Agregar tarjeta
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
