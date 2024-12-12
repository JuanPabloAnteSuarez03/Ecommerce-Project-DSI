import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axios';

// Create the CartContext
const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fetch cart on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get('/shopping_car/cart/');
        setCart(response.data.items);
        console.log('Carrito actualizado:', response.data.items);
      } catch (error) {
        console.error('Error al obtener el carrito', error);
      }
    };
    fetchCart();
  }, []);

  // Add to cart function
  const addToCart = async (product) => {
    try {
      const response = await axiosInstance.post('/shopping_car/cart/add_item/', {
        product_id: product.id,
        cantidad: 1,
      });
      setCart(response.data.items);
    } catch (error) {
      console.error('Error al agregar el articulo al carrito', error);
    }
  };

  // Remove from cart function
  const removeFromCart = async (productId) => {
    try {
      const response = await axiosInstance.post('/shopping_car/cart/remove_item/', {
        product_id: productId,
      });
      setCart(response.data.items);
    } catch (error) {
      console.error('Error al eliminar el articulo del carrito', error);
    }
  };

  // Decrease quantity function
  const decreaseQuantity = async (productId) => {
    const item = cart.find((product) => product.producto.id === productId);
  
    if (item && item.cantidad > 1) {
      try {
        const newQuantity = item.cantidad - 1;
        const response = await axiosInstance.post('/shopping_car/cart/update_quantity/', {
          product_id: productId,
          cantidad: newQuantity,
        });
        setCart(response.data.items);
      } catch (error) {
        console.error('Error al reducir la cantidad del artículo en el carrito', error);
      }
    }
  };

  // Clear cart function
  const clearCart = async () => {
    try {
      const response = await axiosInstance.post('/shopping_car/cart/clear/');
      setCart(response.data.items);
    } catch (error) {
      console.error('Error al vaciar el carrito', error);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        decreaseQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};