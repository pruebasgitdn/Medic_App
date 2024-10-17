import React, { useContext, useState } from "react";
import { Form, Input, Card, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Context } from "../main";

const DoctorLogin = () => {
  const { setUser, setIsAuthenticated, setRole } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); //navigate como Navigate mehtod

  const handleLogin = async (e) => {
    try {
      //Se hace la peticion post a dicha ulr mas el contenido
      const response = await axios.post(
        "http://localhost:4000/api/doctor/login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      //Si la respuesta es correcta
      if (response.status === 200) {
        message.success("Inicio de sesion exitoso!");

        //Data de user
        const userData = response.data.user;

        //Actualizar contexto
        setUser(userData);
        setIsAuthenticated(true);
        setRole("doctor");

        // Almacena en localStorage o sessionStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", "doctor");

        console.log(email, password);
        navigate("/doctorpanel/profile");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Error en el inicio de sesión");
      }
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-form">
          <Card title={"Inicio de Sesion Doctor."}>
            {/*
          onFinish => Onsubmit
          */}
            <Form onFinish={handleLogin} name="loginform">
              <div className="login-container">
                <div className="login-form">
                  <div className="inpts_login">
                    <h3>Ingresa tus datos</h3>
                    <Form.Item
                      label="Email"
                      name="email"
                      className="form-item"
                      rules={[
                        {
                          required: true,
                          message: "Porfavor ingresa tu email!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="ejm:eric"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Contraseña"
                      name="password"
                      className="form-item"
                      rules={[
                        {
                          required: true,
                          message: "Porfavor ingresa tu contraseña!",
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="ejm: 52453"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </Form.Item>
                  </div>

                  <div className="btns_login">
                    <Button
                      form="loginform"
                      type="primary"
                      size="small"
                      block
                      htmlType="submit"
                    >
                      Ingresar.
                    </Button>
                    <Link to="/patientregister">
                      <Button type="dashed" size="small" block>
                        Crear Cuenta
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="login-image">
                  <img src="/nazi.png" alt="Login" className="contain" />
                </div>
              </div>
            </Form>
          </Card>
        </div>
        <div className="adminlink">
          <Link to="/adminlogin" id="adminlink">
            Admin
          </Link>
        </div>
      </div>
    </>
  );
};

export default DoctorLogin;
