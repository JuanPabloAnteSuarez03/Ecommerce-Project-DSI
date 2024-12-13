import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

// Crear el contexto
export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  // Obtener las categorías
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/products/api/categorias/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  // Crear una nueva categoría
  const createCategory = async (categoryName) => {
    try {
      const response = await axiosInstance.post('/products/api/categorias/', {
        nombre_categoria: categoryName,
      });
      setCategories((prevCategories) => [...prevCategories, response.data]);
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, createCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
