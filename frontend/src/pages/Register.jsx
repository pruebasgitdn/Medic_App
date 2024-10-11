import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { Link, useNavigate } from "react-router-dom";

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null); // Foto del paciente
  const [document, setDocument] = useState(null);
  const { TextArea } = Input;
  const { Dragger } = Upload;
  const navigate = useNavigate();

  const handleUploadPhoto = (file) => {
    setPhoto(file);
    return false; // Esto evita que Ant Design intente subir el archivo automáticamente
  };

  const handleUploadDocument = (file) => {
    setDocument(file);
    return false;
  };

  const handleRegister = async (values) => {
    //FormData para manejo de archivos y agrupacion
    const formData = new FormData();
    const fechaformat = values.dot.format("YYYY-MM-DD"); //Fecha Formateada

    const ff = fechaformat.toString();
    const genero = values.genero.toUpperCase();

    formData.append("nombre", values.nombre);
    formData.append("email", values.email);
    formData.append("apellido_pat", values.apellido_pat);
    formData.append("apellido_mat", values.apellido_mat);
    formData.append("password", values.contraseña);
    formData.append("telefono", phone);
    formData.append("dot", ff);
    formData.append("genero", genero);
    formData.append("identificacion_tipo", values.document_type);
    formData.append("identificacion_numero", values.identificacion_numero);
    formData.append(
      "numero_contacto_emergencia",
      values.numero_contacto_emergencia
    );
    formData.append("nombre_contacto_emergencia", values.contacto_emergencia);
    formData.append("proovedor_seguros", values.proveedor_seguros);
    formData.append("direccion", values.direccion);
    formData.append("alergias", values.alergias);

    //Previamente seteados en el upload
    // Agregar los archivos al FormData (si están disponibles)
    if (photo) {
      console.log("Subiendo foto:", photo);

      formData.append("photo", photo); // Archivo de foto
    }
    if (document) {
      console.log("Subiendo documento:", document);

      formData.append("document_id", document); // Documento de identidad
    }
    if (!document) {
      message.error("Por favor sube tu documento de identificación");
      return;
    }
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      // Peticion
      const response = await axios.post(
        "http://localhost:4000/api/patient/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        message.success("Registro exitoso!!");
        navigate("/");
      }

      // Mostrar los valores del FormData en la consola

      console.log(values);
      console.log("FormData values:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    } catch (error) {
      message.error("Error al registrar  perfil");
      console.log("Error al actualizar el perfil: ", error);
    }

    console.log(values);
  };

  return (
    <Row className="register-container">
      {/* Columna del formulario */}
      <Col xs={24} md={16} className="form-column">
        <Card className="register-form-card">
          <Form layout="vertical" form={form} onFinish={handleRegister}>
            <Row gutter={10}>
              <Col span={24}>
                <h4 className="form-section-title">Información Personal</h4>
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
                      message: "¡Por favor sube tu archivo / documento !",
                    },
                  ]}
                >
                  <Dragger beforeUpload={handleUploadPhoto} name="photo">
                    <Button
                      className="form-upload-btn"
                      icon={<UploadOutlined />}
                    ></Button>
                    Arrastra o inserta tu documento
                  </Dragger>
                </Form.Item>
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
                  name="contraseña"
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
                      max: 14,
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
                    placeholder="Ingresa numero de telefono"
                    value={phone}
                    onChange={setPhone}
                  />
                </Form.Item>
              </Col>

              {/* INPUT FECHA DE NACIMIENTO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Fecha de Nacimiento"
                  name="dot"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "¡Por favor ingresa tu fecha de nacimiento!",
                    },
                  ]}
                >
                  <DatePicker
                    className="form-input"
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              {/* INPUT GÉNERO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Género"
                  name="genero"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "¡Por favor selecciona tu genero!",
                    },
                  ]}
                >
                  <Select className="form-input">
                    <Option value="HOMBRE">Hombre</Option>
                    <Option value="MUJER">Mujer</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <h4 className="form-section-title">Información Médica</h4>
              </Col>

              {/* INPUT TIPO DOCUMENTO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Tipo de documento"
                  name="document_type"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "¡Selecciona tipo de documento!",
                    },
                  ]}
                >
                  <Select className="form-input">
                    <Option value="CC">Cedula C</Option>
                    <Option value="NIT">NIT</Option>
                    <Option value="TI">Tarjeta Identidad</Option>
                    <Option value="RUT">RUT</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* NUMERO DE DOCUMENTO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Numero de Documento"
                  name="identificacion_numero"
                  className="form-item"
                  rules={[
                    {
                      min: 10,
                      message: "¡El documento debe minimo 10 digitos!",
                    },

                    {
                      required: true,
                      message: "¡Por favor ingresa tu numero de documento!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
              </Col>

              {/* INPUT DOCUMENTO */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Documento de Identificación"
                  className="form-item"
                  name="document_id"
                  rules={[
                    {
                      required: true,
                      message: "¡Por favor sube tu archivo / documento !",
                    },
                  ]}
                >
                  <Dragger
                    beforeUpload={handleUploadDocument}
                    name="document_id"
                  >
                    <Button
                      className="form-upload-btn"
                      icon={<UploadOutlined />}
                    ></Button>
                    Arrastra o inserta tu documento
                  </Dragger>
                </Form.Item>
              </Col>

              {/* CONTACTO DE EMERGENCIA */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Número de Contacto de Emergencia"
                  name="numero_contacto_emergencia"
                  className="form-item"
                  rules={[
                    {
                      min: 10,
                      message: "¡Minimo 10 caracteres!",
                    },
                    {
                      //11 porque el +57 = 3 + 10
                      max: 12,
                      message:
                        "¡El número de teléfono debe tener máximo 11 dígitos!",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu contacto!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
              </Col>

              {/* NOMBRE CONTACTO EMERGENCIA */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nombre de Contacto de Emergencia"
                  name="contacto_emergencia"
                  className="form-item"
                  rules={[
                    {
                      min: 5,
                      message: "¡Debe tener al menos 4 caracteres!",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu contacto!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
              </Col>

              {/* PROVEEDOR DE SEGUROS */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Proveedor de Seguros"
                  name="proveedor_seguros"
                  className="form-item"
                  rules={[
                    {
                      min: 3,
                      message: "¡Insertar Proovedor!",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu proovedor!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
              </Col>

              {/* DIRECCIÓN */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Dirección"
                  name="direccion"
                  className="form-item"
                  rules={[
                    {
                      min: 6,
                      message: "¡Debe tener al menos 6 caracteres!",
                    },
                    {
                      required: true,
                      message: "¡Por favor ingresa tu direccion!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
              </Col>

              {/* ALERGIAS */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="¿ Alergias ?"
                  name="alergias"
                  className="form-item"
                >
                  <TextArea rows={3} placeholder="...." maxLength={100} />
                </Form.Item>
              </Col>
            </Row>

            <Button
              type="primary"
              htmlType="submit"
              block
              className="form-submit-btn"
            >
              Registrar
            </Button>
            <div className="btnregister">
              <Link to="/" className="form-secondary-btn">
                <Button block>Inicio</Button>
              </Link>

              <Link to="/patientlogin" className="form-secondary-btn">
                <Button block>Login</Button>
              </Link>
            </div>
          </Form>
        </Card>
      </Col>

      {/* Columna de la imagen */}
      <Col xs={0} md={8} className="image-column">
        <img
          src="/asideregister.jpg"
          alt="Banner"
          className="register-banner"
        />
      </Col>
    </Row>
  );
};

export default Register;
