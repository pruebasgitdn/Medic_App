import React, { useState } from "react";
import { Form, Input, Card, Button, Row, Col, Upload, message } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";

const AdminNewAdmin = () => {
  const { Dragger } = Upload;
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState(null); // Foto paciente
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");

  const handleUploadPhoto = (file) => {
    setPhoto(file);
    return false;
  };

  const onFinish = async (values) => {
    const formData = new FormData();

    formData.append("nombre", values.nombre);
    formData.append("email", values.email);
    formData.append("password", values.contraseña);

    if (photo) {
      console.log("Subiendo foto:", photo);
      formData.append("photo", photo); // Archivo de foto
    }

    try {
      // Peticion
      const response = await axios.post(
        "http://localhost:4000/api/admin/createAdmin",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        message.success("Registro de Admin exitoso!!");
        navigate("/adminpanel/profile");
      }

      console.log(values);
      console.log("FormData values:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    } catch (error) {
      message.error("Error al registrar admin");
      console.log("Error al registrar admin: ", error);
      if (error.response && error.response.data) {
        //Extraer mensaje del da respuesta
        const { message } = error.response.data;
        if (message === "Administrador con este email ya existe") {
          setEmailError(message);
        } else {
          message.error(message);
        }
      }
    }

    console.log(values);
  };
  return (
    <Row className="register-container">
      {/* Columna del formulario */}
      <Col xs={24} md={16} className="form-column">
        <Card className="register-form-card">
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Row gutter={10}>
              <Col span={24}>
                <h4 className="form-section-title">Registrar Administrador</h4>
                <img
                  src="/admin.png"
                  alt="Equipo de Link-CARE"
                  className="about-image"
                />
              </Col>

              {/* INPUT NOMBRE */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nombre"
                  name="nombre"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "¡Por favor ingresa tu nombre!",
                    },
                    {
                      min: 3,
                      message: "¡El nombre deber tener al menos 3 digitos!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
              </Col>

              {/* INPUT EMAIL */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  className="form-item"
                  rules={[
                    {
                      type: "email",
                      message:
                        "¡Por favor ingresa un correo electrónico válido!",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu correo electrónico!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
                {emailError &&
                emailError === "Administrador con este email ya existe" ? (
                  <>
                    <p className="error_form">{emailError}</p>
                  </>
                ) : (
                  <></>
                )}
              </Col>

              {/* INPUT CONTRASEÑA */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  className="form-item"
                  rules={[
                    {
                      min: 8,
                      message:
                        "¡La contraseña debe tener al menos 8 caracteres!",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu contraseña!",
                    },
                  ]}
                >
                  <Input.Password className="form-input" />
                </Form.Item>
              </Col>

              {/* INPUT FOTO */}
              <Col xs={24} md={12}>
                <Form.Item label="Foto" className="form-item" name="photo">
                  <Dragger name="photo" beforeUpload={handleUploadPhoto}>
                    <Button
                      className="form-upload-btn"
                      icon={<UploadOutlined />}
                    ></Button>
                    Arrastra o inserta tu documento
                  </Dragger>
                </Form.Item>
              </Col>
            </Row>
            <hr />
            <div className="btnregister">
              <Button type="primary" block htmlType="submit">
                Registrar Admin
              </Button>

              <Link to="/adminpanel/profile" className="form-secondary-btn">
                <Button block>Cancelar</Button>
              </Link>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminNewAdmin;
