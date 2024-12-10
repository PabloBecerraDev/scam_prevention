import { useState } from 'react';
import { Box, Button, TextField, Grid, Typography, Alert } from '@mui/material';
import { useAuth } from '../AuthContext'; // Ajusta el path a tu hook de autenticación
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TiendaForm() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    ciudad: '',
    direccion: '',
    descripcion: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
  
    // Enviar los datos al backend con el token de autenticación en las cabeceras
    try {
      const response = await axios.post('http://localhost:8000/api/createTienda/', {
        ...formData,
        dueno: user?.id  // ID del usuario logueado
      }, {
        headers: {
          Authorization: `Bearer ${token}`  // Incluye el token en la cabecera Authorization
        }
      });
  
      setSuccess('Tienda creada con éxito');
      navigate('/'); // Redirigir al inicio después de la creación
    } catch (error) {
      setError('Error al crear la tienda' + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Agregar Tienda
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de la tienda"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando Tienda...' : 'Crear Tienda'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default TiendaForm;
