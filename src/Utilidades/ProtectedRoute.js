import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Componente para proteger rutas
const ProtectedRoute = ({ element }) => {
  const isLoggedIn = Cookies.get('UserId') !== undefined;

  if (!isLoggedIn) {
    // Si no está logueado, redirige a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, renderiza el componente
  return element;
};

export default ProtectedRoute;
