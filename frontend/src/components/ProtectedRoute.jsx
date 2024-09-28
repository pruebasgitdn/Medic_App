import React, { useContext } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

//Children para renderizar el componente hijo si la autenticacion esta melita, allowedRoles => roles permitidos para varios roles como dr,admin,pacti

//Debe el rol pasarse como array en el App.jsx
const ProtectedRoute = ({ children }) => {
  //Extraer del contexto
  const { user, isAuthenticated } = useContext(Context);

  // Verificar los valores actuales de autenticación y usuario
  console.log("PROTECTED ROUTE. isAuthenticated:", isAuthenticated);
  console.log("PROTECTED ROUTE. user:", user);
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
