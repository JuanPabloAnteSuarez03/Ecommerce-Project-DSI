import React from 'react';
import { createRoot } from 'react-dom/client';

// styles
import './index.scss';

// project imports
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from './contexts/ConfigContext';
import { CartProvider } from './contexts/CartContext'; // Add this import

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ConfigProvider>
    <CartProvider> {/* Wrap the App with CartProvider */}
      <App />
    </CartProvider>
  </ConfigProvider>
);

reportWebVitals();