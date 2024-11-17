import React,{ createContext, useState, useEffect, useContext }from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import UserForm from './components/UserForm';
import { AuthProvider, useAuth } from './AuthContext';


import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import LoginForm from './components/LoginForm';

// Componente de tarjeta animada
const AnimatedCard = styled(Card)({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
  },
});

// Página principal (Home)
function Home() {
  return (
    <Container>
      {/* Sección introductoria */}
      <Box sx={{ my: 5 }}>
        <Typography variant="h4" gutterBottom>
          Evita ser estafado en tiendas virtuales
        </Typography>
        <Typography variant="body1" gutterBottom>
          Las estafas en marketplaces son cada vez más comunes. Estas pueden incluir precios
          engañosos, productos inexistentes y cuentas falsas. En esta herramienta, aprenderás
          a identificar señales de alerta, proteger tu información y certificar vendedores de
          confianza.
        </Typography>
      </Box>

      {/* Cartas de información */}
      <Typography variant="h5" gutterBottom>
        Tipos comunes de estafas y cómo evitarlas:
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6">Productos falsos</Typography>
              <Typography variant="body2">
                Verifica siempre la autenticidad del producto y busca reseñas del vendedor.
              </Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6">Pagos fuera de la plataforma</Typography>
              <Typography variant="body2">
                No envíes dinero fuera de la plataforma, ya que no estarás protegido.
              </Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6">Perfiles falsos</Typography>
              <Typography variant="body2">
                Desconfía de vendedores con perfiles nuevos o sin actividad previa.
              </Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>
    </Container>
  );
}

// Barra de navegación dinámica basada en el estado del usuario
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Anti-Scam Tool
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Inicio
        </Button>
        {!isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/create-account">
              Crea tu cuenta
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {`Hola, ${user?.username || "Usuario"}`}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Componente principal (App)
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Rutas protegidas: solo accesibles si NO está logueado */}
          <Route 
            path="/create-account" 
            element={
              <ProtectedRoute redirectTo="/" >
                <UserForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <ProtectedRoute redirectTo="/" >
                <LoginForm />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


// Ruta protegida para redirigir si el usuario ya está autenticado
function ProtectedRoute({ children, redirectTo }) {
  const { isAuthenticated } = useAuth();
  // Si el usuario está autenticado, redirige a la página principal
  return isAuthenticated ? <Navigate to={redirectTo} /> : children;
}


ReactDOM.render(<App />, document.getElementById('root'));
