import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

const CertificacionButton = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCertificar = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:8000/api/hasTienda/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const hasTienda = response.data.has_store;
  
      if (hasTienda) {
        console.log('El usuario tiene al menos una tienda.');
      } else {
        alert('Debes tener al menos una tienda para solicitar el certificado.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else {
        console.error('Error verificando tienda:', error);
        alert('Hubo un error al verificar tu tienda. Intenta nuevamente más tarde.');
      }
    }
  };
  
  return (
    <Button variant="contained" color="primary" onClick={handleCertificar}>
      Solicitar certificado
    </Button>
  );
};

export default CertificacionButton;
