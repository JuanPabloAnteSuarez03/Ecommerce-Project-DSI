// index.jsx (general del proyecto)

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from './contexts/ConfigContext';
import { CartProvider } from './contexts/CartContext';
import { FavoriteProvider } from './contexts/FavoriteContext'; 
import { CategoryProvider } from './contexts/CategoryContext'; // Importar el CategoryProvider

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ConfigProvider>
    <CartProvider>
      <FavoriteProvider>
        <CategoryProvider>
          <App />
        </CategoryProvider>
      </FavoriteProvider>
    </CartProvider>
  </ConfigProvider>
);

reportWebVitals();
