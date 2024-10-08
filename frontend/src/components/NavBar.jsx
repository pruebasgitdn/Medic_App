import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Menu, message } from "antd";
import { Context } from "../main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const NavBar = () => {
  const { isAuthenticated, user, setUser, setIsAuthenticated, role } =
    useContext(Context);
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú

  // Cerrar sesión
  // const handleLogout = async () => {
  //   try {
  //     const response = await axios.get(
  //       role === "doctor"
  //         ? "http://localhost:4000/api/doctor/logout"
  //         : "http://localhost:4000/api/patient/logout",
  //       { withCredentials: true }
  //     );

  //     if (response.status === 200) {
  //       message.info("Cierre de sesión exitoso!");
  //       setUser(null);
  //       setIsAuthenticated(false);
  //       localStorage.removeItem("user");
  //       localStorage.removeItem("isAuthenticated");
  //       localStorage.removeItem("role");
  //       navigate("/");
  //     } else {
  //       message.error("Error al cerrar sesión");
  //     }
  //   } catch (error) {
  //     console.error("Error en el logout:", error);
  //     message.error("Error al cerrar sesión");
  //   }
  // };
  const handleLogout = async () => {
    try {
      let logoutUrl;

      // Determina la URL de cierre de sesión dependiendo del rol
      if (role === "doctor") {
        logoutUrl = "http://localhost:4000/api/doctor/logout";
      } else if (role === "admin") {
        logoutUrl = "http://localhost:4000/api/admin/logout";
      } else {
        logoutUrl = "http://localhost:4000/api/patient/logout";
      }

      const response = await axios.get(logoutUrl, { withCredentials: true });

      if (response.status === 200) {
        message.info("Cierre de sesión exitoso!");
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("role");
        navigate("/");
      } else {
        message.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en el logout:", error);
      message.error("Error al cerrar sesión");
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Alterna la visibilidad del menú
  };

  return (
    <div className="container_nav">
      <Menu mode="horizontal" className="navbar">
        <div className="nav_uno">
          <img src="/logos/logomain.png" alt="Logo" className="logonav" />
          <ToastContainer />
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
              <Menu.Item key="4">
                <Link
                  to={
                    role === "doctor"
                      ? "/doctorpanel/profile"
                      : role === "admin"
                      ? "/adminpanel/profile"
                      : "/userpanel/profile"
                  }
                >
                  {user?.nombre}
                </Link>
              </Menu.Item>
              <Menu.Item key="5">
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
              <Menu.Item key="6">
                <Link to="/patientregister">Registrar</Link>
              </Menu.Item>
            </>
          )}
        </div>
      </Menu>
      {/* Botón y opciones que solo aparecen en pantallas pequeñas */}
      <div className="mobile-menu">
        <img src="/logos/logomain.png" alt="Logo" className="logonav" />
        <Button type="primary" onClick={toggleMenu} className="menu-button">
          Menú
        </Button>
        {/* Logo que aparece en pantallas pequeñas */}

        {menuVisible && (
          <div className="mobile-options">
            <Link to="/">Inicio</Link>
            <Link to="/about">Nosotros</Link>
            <Link to="/contact">Contacto</Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    role === "doctor"
                      ? "/doctorpanel/profile"
                      : "/userpanel/profile"
                  }
                >
                  {user?.nombre}
                </Link>
                <Button type="primary" onClick={handleLogout} danger>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/patientlogin">Iniciar Sesión - Paciente</Link>
                <Link to="/doctorlogin">Iniciar Sesión - Doctor</Link>
                <Link to="/patientregister">Registrar</Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
