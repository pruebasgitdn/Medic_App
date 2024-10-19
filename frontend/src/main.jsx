import { createContext, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "antd/dist/reset.css";
import { useEffect } from "react";
//Crear Contexto
export const Context = createContext();

const AppWraper = () => {
  //Autenticacion global y usuario
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [role, setRole] = useState(""); // "doctor" o "patient"

  //Recuperar credenciales del localstorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");

    console.log("Stored User:", storedUser);
    console.log("Stored isAuthenticated:", storedIsAuthenticated);

    if (storedUser && storedIsAuthenticated === "true") {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [setUser, setIsAuthenticated]);

  return (
    //Proveer la aplicacion con el contexto con los valores
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        role,
        setRole,
      }}
    >
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWraper />
  </StrictMode>
);
