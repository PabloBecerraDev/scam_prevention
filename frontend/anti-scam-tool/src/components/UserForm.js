import React, { useState } from "react";
import { Box, Typography, Alert, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    tipoDocument: "",
    documentoId: "",
    nombre: "",
    apellido: "",
    edad: "",
    imagen_perfil: null,
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null); 



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imagen_perfil: file });
    setImagenSeleccionada(file ? URL.createObjectURL(file) : null); // Actualiza la vista previa
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isSubmitting) return; // Evitar múltiples envíos
    setIsSubmitting(true);
  
    // Validar que las contraseñas coinciden
    if (formData.password !== formData.password2) {
      setError("Las contraseñas no coinciden");
      setSuccess("");
      setIsSubmitting(false);
      return;
    }
  
    const data = new FormData();
    data.append("username", formData.username);
    data.append("tipoDocument", formData.tipoDocument);
    data.append("documentoId", formData.documentoId);
    data.append("nombre", formData.nombre);
    data.append("apellido", formData.apellido);
    data.append("edad", formData.edad);
    data.append("is_certifiqued", false );
    data.append("password", formData.password);
  
    if (formData.imagen_perfil) {
      data.append("imagen_perfil", formData.imagen_perfil);
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/createUser/",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      if (response.status === 201) {
        console.log("si esta bien")
        setSuccess("Usuario creado exitosamente");
        setError("");
        navigate("/login");
      } else {
        setError(`Hubo un error inesperado: ${response.status}`);
        setSuccess("");
      }
    } catch (err) {
      setError(`Hubo un error al crear el usuario: ${err.message}`);
      setSuccess("");
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Registreate como vendedor
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Tipo de identificación</InputLabel>
              <Select
                label="Tipo de identificación"
                name="tipoDocument"
                value={formData.tipoDocument}
                onChange={handleChange}
              >
                <MenuItem value="cedula">Cédula</MenuItem>
                <MenuItem value="pasaporte">Pasaporte</MenuItem>
                <MenuItem value="tarjetaIdentidad">Tarjeta de identidad</MenuItem>
                <MenuItem value="nuit">NIT</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Identificacion"
              name="documentoId"
              value={formData.documentoId}
              onChange={handleChange}
              required
            />             
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Repite la contraseña"
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Subir Imagen de Perfil
              <input
                type="file"
                name="imagen_perfil"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {imagenSeleccionada && (
              <Box mt={2} textAlign="center">
                <Typography variant="body2">Imagen seleccionada:</Typography>
                <img
                  src={imagenSeleccionada}
                  alt="Vista previa"
                  style={{ maxWidth: "100%", maxHeight: 200 }}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando Usuario..." : "Crear Usuario"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default UserForm;
