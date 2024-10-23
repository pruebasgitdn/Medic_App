import React, { useContext, useState } from "react";
import { Form, Input, Card, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { KeyOutlined, LockFilled } from "@ant-design/icons";
import { Context } from "../main";

const AdminLogin = () => {
  const { setUser, setIsAuthenticated, setRole } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
      //Peticion post a dicha ulr mas el contenido
      const response = await axios.post(
        "http://localhost:4000/api/admin/login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Inicio de sesion Administrador exitoso!");

        //Data de user
        const userData = response.data.user;

        //Actualizar contexto
        setUser(userData);
        setIsAuthenticated(true);
        setRole("admin");

        // Almacena en localStorage o sessionStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", "admin");

        console.log(email, password);
        navigate("/adminpanel/profile");
      }
    } catch (error) {
      if (
        error.response ||
        error.response.data ||
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Error en el inicio de sesión");
      }
      console.error("Error:", error);
    }

    console.log(email, password);
  };

  return (
    <div className="login-container">
      <img src="" alt="" />
      <div className="login-form">
        <Card>
          <Form name="adminloginform" onFinish={handleLogin}>
            <div className="loginadmin_container">
              <div className="adminform">
                <img src="/logos/logomain.png" alt="Login" id="adminlogin" />

                <h3>Admin Panel</h3>
                <Form.Item
                  label="Email"
                  className="form-item"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message:
                        "¡Por favor ingresa un correo electrónico válido!",
                    },
                    {
                      required: true,
                      message: "Porfavor ingresa tu email!",
                    },
                  ]}
                >
                  <Input
                    prefix={<KeyOutlined />}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </Form.Item>

                <Form.Item
                  label="Contraseña"
                  className="form-item"
                  name="password"
                  rules={[
                    {
                      min: 8,
                      message:
                        "¡La contraseña debe tener al menos 8 caracteres!",
                    },
                    {
                      required: true,
                      message: "Porfavor ingresa tu contraseña!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="****"
                    prefix={<LockFilled />}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </Form.Item>
              </div>

              <div className="bt_loginadmin">
                <Button
                  form="adminloginform"
                  type="primary"
                  size="small"
                  block
                  htmlType="submit"
                  id="btns_adminlogin"
                >
                  Ingresar
                </Button>
                <Link to="/">
                  <Button type="dashed" id="btns_adminlogin" size="small" block>
                    Inicio
                  </Button>
                </Link>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
