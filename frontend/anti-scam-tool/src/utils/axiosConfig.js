import axios from 'axios';

// Refrescar el token de acceso
const refreshAccessToken = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh: localStorage.getItem('refreshToken'), // Asegúrate de guardar el refresh token en el localStorage
    });
    const newAccessToken = response.data.access;
    localStorage.setItem('token', newAccessToken); // Guarda el nuevo token
    axios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`; // Actualiza los headers
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Opcional: Manejar el deslogueo automático si falla el refresh
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // Redirigir al login si es necesario
  }
};

// Interceptor de respuestas de Axios
axios.interceptors.response.use(
  (response) => response, // Deja pasar las respuestas exitosas
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config.__isRetryRequest
    ) {
      error.config.__isRetryRequest = true; // Previene múltiples intentos de actualización
      await refreshAccessToken();
      return axios(error.config); // Reintenta la solicitud original
    }
    return Promise.reject(error);
  }
);

export default axios; // Exporta la instancia configurada
