import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import axios from "axios";

const UserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    nombre: "",
    apellido: "",
    edad: "",
    imagen_perfil: null,
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagen_perfil: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Evitar múltiples envíos
    setIsSubmitting(true);

    const data = new FormData();
    data.append("username", formData.username);
    data.append("nombre", formData.nombre);
    data.append("apellido", formData.apellido);
    data.append("edad", formData.edad);
    data.append("imagen_perfil", formData.imagen_perfil);
    data.append("password", formData.password);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/createUser/",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        setSuccess("Usuario creado exitosamente");
        setError("");
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
        Crear Usuario
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
