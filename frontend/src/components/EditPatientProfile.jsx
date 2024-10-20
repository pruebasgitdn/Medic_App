import React, { useEffect, useContext, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Upload,
  Card,
  Alert,
  message,
} from "antd";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Context } from "../main";
import { UploadOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPatientProfile = () => {
  const { user, setUser } = useContext(Context);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null); // Foto del paciente
  const [document, setDocument] = useState(null); // Dcoumento del paciente
  const [emailError, setEmailError] = useState("");
  const { Dragger } = Upload;
  const { Option } = Select;
  const { TextArea } = Input;

  // Manejar el archivo de foto
  const handlePhotoUpload = (file) => {
    setPhoto(file);
    return false;
  };
  const handleDocumentUpload = (file) => {
    setDocument(file);
    return false;
  };

  // Rellenar el formulario con la información del usuario actual
  useEffect(() => {
    //Del manejo del form del useForm de ant, nos permite rellenar los inputs con el nombre del input y valor
    form.setFieldsValue({
      nombre: user?.nombre,
      apellido_pat: user?.apellido_pat,
      apellido_mat: user?.apellido_mat,
      email: user?.email,
      telefono: user?.telefono,
      direccion: user?.direccion,
      genero: user?.genero,
      alergias: user?.alergias,
    });
  }, [user, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      //FormData para manejo de archivos y agrupacion
      const formData = new FormData();

      //Append => agregando clave valor
      formData.append("nombre", values?.nombre);
      formData.append("apellido_pat", values?.apellido_pat);
      formData.append("apellido_mat", values?.apellido_mat);
      formData.append("email", values?.email);
      formData.append("telefono", values?.telefono);
      formData.append("direccion", values?.direccion);
      formData.append("genero", values?.genero);
      formData.append("alergias", values?.alergias);
      if (photo) {
        formData.append("photo", photo);
      }
      if (document) {
        formData.append("document_id", document);
      }

      const response = await axios.put(
        "http://localhost:4000/api/patient/editprofile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Datos actualizados exitosamente");
      setLoading(false);
      setUser(response.data.patient);
      navigate("/userpanel/profile"); // Redirigir al perfil
    } catch (error) {
      setLoading(false);

      console.error("Error al actualizar el perfil:", error);
      if (error.response && error.response.data) {
        const { message } = error.response.data;

        // Verificar si el mensaje es el de email duplicado
        if (message === "Email ya se encuentra en uso / registrado") {
          setEmailError("Email ya se encuentra en uso / registrado");
        } else {
          message.error(message);
        }
      } else {
        message.error("Error en la actualización del perfil");
      }
      console.error("Error al actualizar el perfil:", error);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ marginTop: "20px" }}>
      <Col xs={24} sm={22} md={18} lg={16}>
        <Card title="Editar Perfil">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              genero: "HOMBRE", // Valor por defecto
            }}
            onFinish={onFinish}
          >
            {/* Nombre */}
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ min: 3, message: "Nombre mayor a 3 digitos" }]}
              className="form-item"
            >
              <Input placeholder="Nombre" />
            </Form.Item>

            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                {/* Apellido Paterno */}
                <Form.Item
                  name="apellido_pat"
                  label="Apellido Paterno"
                  className="form-item"
                  rules={[{ min: 3, message: "Apellido mayor a 3 digitos" }]}
                >
                  <Input placeholder="Apellido Paterno" />
                </Form.Item>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                {/* Apellido Materno */}
                <Form.Item
                  name="apellido_mat"
                  label="Apellido Materno"
                  className="form-item"
                  rules={[{ min: 3, message: "Apellido mayor a 3 digitos" }]}
                >
                  <Input placeholder="Apellido Materno" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                {/* Email */}
                <Form.Item
                  name="email"
                  label="Email"
                  className="form-item"
                  rules={[{ type: "email", message: "Email valido" }]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                {emailError &&
                emailError === "Email ya se encuentra en uso / registrado" ? (
                  <>
                    <p className="error_form">{emailError}</p>
                  </>
                ) : (
                  <></>
                )}
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                {/* Teléfono */}
                <Form.Item
                  name="telefono"
                  label="Teléfono"
                  className="form-item"
                  rules={[
                    { min: 10, message: "Minimo 10 digitos" },
                    {
                      max: 14,
                      message: "Maximo 11 digitos",
                    },
                  ]}
                >
                  <PhoneInput
                    defaultCountry={"CO"}
                    placeholder="Ingresa numero de telefono"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Dirección */}
            <Form.Item
              name="direccion"
              className="form-item"
              label="Dirección"
              rules={[{ min: 8, message: "Mayor a 8 digitos" }]}
            >
              <Input placeholder="Dirección" />
            </Form.Item>

            <Form.Item name="alergias" label="Alergias" className="form-item">
              <Input.TextArea rows={3} />
            </Form.Item>

            {/* Género */}
            <Form.Item name="genero" className="form-item" label="Género">
              <Select placeholder="Seleccione su género">
                <Option value="HOMBRE">Hombre</Option>
                <Option value="MUJER">Mujer</Option>
                <Option value="OTRO">Otro</Option>
              </Select>
            </Form.Item>

            {/* ARCHIVOS */}
            <Form.Item label="Archivos">
              <Row justify="space-between">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Item
                    name="document_id"
                    label="Documento de Identidad"
                    className="form-item"
                  >
                    <Dragger
                      beforeUpload={handleDocumentUpload}
                      name="document_id"
                    >
                      <Button
                        className="form-upload-btn"
                        icon={<UploadOutlined />}
                      >
                        Seleccionar Documento
                      </Button>
                    </Dragger>
                    {user?.document_id?.url && (
                      <img
                        src={user.document_id.url}
                        alt="Foto"
                        style={{ width: "80%", marginTop: "10px" }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Item name="photo" label="Foto" className="form-item">
                    <Dragger beforeUpload={handlePhotoUpload} name="photo">
                      <Button
                        className="form-upload-btn"
                        icon={<UploadOutlined />}
                      >
                        Seleccionar Foto
                      </Button>
                    </Dragger>
                    {user?.photo?.url && (
                      <img
                        src={user.photo.url}
                        alt="Foto"
                        style={{ width: "80%", marginTop: "10px" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* Botón de enviar */}
            <div className="btns_block">
              <Button type="primary" htmlType="submit" loading={loading} block>
                Actualizar Perfil
              </Button>
              <Link to="/userpanel/profile">
                <Button type="outlined" block>
                  Cancelar
                </Button>
              </Link>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default EditPatientProfile;
