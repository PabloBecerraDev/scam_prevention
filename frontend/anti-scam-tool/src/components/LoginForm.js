import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";  // Asegúrate de importar correctamente

const LoginForm = () => {
  const { login } = useAuth();  // Usamos el contexto para acceder al login
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        const token = response.data.access;
        const userData = response.data.user; // Suponiendo que también recibes la info del usuario

        localStorage.setItem("token", token);  // Guarda el token en localStorage
        axios.defaults.headers["Authorization"] = `Bearer ${token}`;  // Configura el token por defecto

        login(token, userData);  // Llama a la función login del contexto

        setSuccess("Login exitoso");
        setError("");
        console.log("Usuario logueado:", response.data);
        navigate("/");  // Redirige a la página principal
      }
    } catch (err) {
      setError("Credenciales incorrectas");
      setSuccess("");
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Iniciar sesión
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Iniciar sesión
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default LoginForm;
