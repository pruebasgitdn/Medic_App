import React, { useState } from "react";
import {
  Form,
  Input,
  Card,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Upload,
  InputNumber,
  message,
} from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Link, useNavigate } from "react-router-dom";

const FormNewDoctor = () => {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null); // Foto del paciente
  const [licencia, setLicencia] = useState(null);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const { Dragger } = Upload;

  const handleUploadPhoto = (file) => {
    setPhoto(file);
    return false; // Esto evita que Ant Design intente subir el archivo automáticamente
  };

  const handleUploadLicense = (file) => {
    setLicencia(file);
    return false;
  };
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("nombre", values.nombre);
    formData.append("email", values.email);
    formData.append("apellido_pat", values.apellido_pat);
    formData.append("apellido_mat", values.apellido_mat);
    formData.append("password", values.contraseña);
    formData.append("telefono", phone);
    formData.append("especialidad", values.especialidad);
    formData.append("numero_licencia", values.numero_licencia);

    if (photo) {
      console.log("Subiendo foto:", photo);
      formData.append("photo", photo); // Archivo de foto
    }

    if (licencia) {
      console.log("Subiendo licencia:", licencia);
      formData.append("licencia", licencia); // Archivo de foto
    }

    if (!document || !licencia) {
      message.error(
        "Por favor sube tu documento de identificación y/o licencia"
      );
      return;
    }

    try {
      // Peticion
      const response = await axios.post(
        "http://localhost:4000/api/admin/createDoctor",
        formData,
        {
          withCredentials: true, // Para asegurarse de que las cookies se manejen correctamente
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        message.success("Registro de Doctor exitoso!!");
        navigate("/adminpanel/newdoctor");
      }

      console.log(values);
      console.log("FormData values:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    } catch (error) {
      console.log(error);
      message.error("Error al registrar admin");
      if (error.response && error.response.data) {
        //Extraer mensaje del da respuesta
        const { message } = error.response.data;
        if (message === "Doctor con este email ya existe") {
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
                <h4 className="form-section-title">Añadir Doctor</h4>
                <img
                  src="/dradd.png"
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

              {/* INPUT APELLIDO PATERNO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Apellido Paterno"
                  name="apellido_pat"
                  className="form-item"
                  rules={[
                    {
                      min: 3,
                      message:
                        "¡El apellido debe tener al   menos 3 caracteres!",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu apellido!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
              </Col>

              {/* INPUT APELLIDO MATERNO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Apellido Materno"
                  name="apellido_mat"
                  className="form-item"
                  rules={[
                    {
                      min: 3,
                      message:
                        "¡El apellido debe tener al   menos 3 caracteres!",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu apellido!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
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

              {/* INPUT TELEFONO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Teléfono"
                  name="telefono"
                  className="form-item"
                  rules={[
                    {
                      min: 10,
                      message: "¡El numero de telefono debe minimo 10 digitos!",
                    },

                    {
                      //11 porque el +57 = 3 + 10
                      max: 13,
                      message:
                        "¡El número de teléfono debe tener máximo 11 dígitos!",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu numero telefonico!",
                    },
                  ]}
                >
                  <PhoneInput
                    defaultCountry="CO"
                    placeholder="Enter phone number"
                    onChange={setPhone}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <h4 className="form-section-title">Archivos</h4>
              </Col>

              {/* NUMERO LICECNIA */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Numero de licencia"
                  name="numero_licencia"
                  className="form-item"
                  rules={[
                    {
                      min: 5,
                      message: "Minimo 5 caracteres",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu licencia!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
              </Col>
              {/* ESPECIALIDAD */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Especialista en"
                  name="especialidad"
                  className="form-item"
                  rules={[
                    {
                      min: 3,
                      message: "Minimo 3 caracteres",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu especialidad!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
              </Col>

              {/* INPUT DOCUMENTO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Licencia Medica"
                  className="form-item"
                  name="licencia"
                  rules={[
                    {
                      required: true,
                      message: "¡Por favor ingresa tu licencia!",
                    },
                  ]}
                >
                  <Dragger name="licencia" beforeUpload={handleUploadLicense}>
                    <Button
                      className="form-upload-btn"
                      icon={<UploadOutlined />}
                    ></Button>
                    Arrastra o inserta tu documento
                  </Dragger>
                </Form.Item>
              </Col>

              {/* INPUT FOTO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Foto"
                  className="form-item"
                  name="photo"
                  rules={[
                    {
                      required: true,
                      message: "¡Por favor ingresa tu foto!",
                    },
                  ]}
                >
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

            <Button
              type="primary"
              htmlType="submit"
              block
              className="form-submit-btn"
            >
              Registrar Doctor
            </Button>
            <div className="btnregister">
              <Link to="/" className="form-secondary-btn">
                <Button block>Inicio</Button>
              </Link>

              <Link to="/adminpanel/profile" className="form-secondary-btn">
                <Button block>Cancelar</Button>
              </Link>
            </div>
          </Form>
        </Card>
      </Col>

      {/* Columna de la imagen */}
      {/* <Col xs={0} md={8} className="image-column">
        <img
          src="/asideregister.jpg"
          alt="Banner"
          className="register-banner"
        />
      </Col> */}
    </Row>
  );
};

export default FormNewDoctor;