import React, { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, Layout, Menu } from "antd";
import { Context } from "../main";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const NavBar = () => {
  //Extraemos la autenticacion y usuario del contexto para mostrar o no componentes como ingresar o cerrar sesion
  const { isAuthenticated, user, setUser, setIsAuthenticated, role, setRole } =
    useContext(Context);

  const navigate = useNavigate();

  //Cerrar Sesion
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        role === "doctor"
          ? "http://localhost:4000/api/doctor/logout"
          : "http://localhost:4000/api/patient/logout",
        { withCredentials: true }
      );

      if (response.status === 200) {
        //Eliminar datos del contexto
        setUser(null);
        setIsAuthenticated(false);
        setRole("");

        //Eliminar datos del localstorage
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("role");

        //Redirigir al login
        toast.success("Sesion cerrada correctamente");

        navigate("/");
      } else {
        toast.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en el logout:", error);
      toast.error("Error al cerrar sesión");
    }
  };
  return (
    <div className="container_nav">
      <Menu mode="horizontal" className="navbar">
        <div className="nav_uno">
          <img src="/logos/logomain.png" alt="Logo" width="140px" />
          <Menu.Item key="1">
            <Link to="/">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/about">Nosotros</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/contact">Contacto</Link>
          </Menu.Item>
        </div>
        <div className="nav_dos">
          {isAuthenticated ? (
            <>
              <Menu.Item key="24"> {user?.nombre}</Menu.Item>
              <Menu.Item key="2">
                {/* Dependiendo del role del contexto previamente seteado en el useEffect que checkea el item role el cual el valor es proveido en los login de dr o paciente */}
                <Link to={role === "doctor" ? "/doctorpanel" : "/userpanel"}>
                  Perfil
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Button type="primary" onClick={handleLogout} danger>
                  Cerrar Sesión
                </Button>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.SubMenu key="33" title="Iniciar Sesión">
                <Menu.Item key="sub1">
                  <Link to="/patientlogin">Paciente</Link>
                </Menu.Item>
                <Menu.Item key="sub2">
                  <Link to="/doctorlogin">Doctor</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.Item key="5">
                <Link to="/patientregister">Registrar</Link>
              </Menu.Item>
            </>
          )}
        </div>
      </Menu>
    </div>
  );
};

export default NavBar;
