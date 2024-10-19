import React, { useContext } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  //Extraer del contexto
  const { user, isAuthenticated } = useContext(Context);

  // Verificar los valores actuales de autenticación y usuario
  console.log("PROTECTED ROUTE. isAuthenticated:", isAuthenticated);
  console.log("PROTECTED ROUTE. user:", user);
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
