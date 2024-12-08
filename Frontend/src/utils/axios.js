import axios from 'axios';



const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,  // Use import.meta.env
    timeout: 10000,  // Adjust timeout as needed
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }); 

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken'); // Get token from storage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axiosInstance.interceptors.response.use(
    (response) => response, // This handles successful responses
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        try {
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/token/refresh/`, { refresh: refreshToken });
          const newAccessToken = res.data.access;
          localStorage.setItem('accessToken', newAccessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error('Error refreshing token:', err);
          localStorage.clear();
          // Optionally redirect to login or handle session expiration
        }
      }
      return Promise.reject(error);
    }
  );
 
  

export default axiosInstance;
