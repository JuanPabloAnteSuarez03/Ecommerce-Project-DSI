import React from 'react';
import { createRoot } from 'react-dom/client';

// styles
import './index.scss';

// project imports
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from './contexts/ConfigContext';
import { CartProvider } from './contexts/CartContext';
import { FavoriteProvider } from './contexts/FavoriteContext'; // Import FavoriteProvider

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ConfigProvider>
    <CartProvider>
      <FavoriteProvider> {/* Wrap the App with FavoriteProvider */}
        <App />
      </FavoriteProvider>
    </CartProvider>
  </ConfigProvider>
);

reportWebVitals();
