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
import { Context } from "../main";
import { UploadOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EditAdminProfile = () => {
  const { user, setUser } = useContext(Context);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null); // Foto del paciente
  const [emailError, setEmailError] = useState("");
  const { Dragger } = Upload;

  useEffect(() => {
    form.setFieldsValue({
      email: user?.email,
      password: user?.password,
    });
  }, [user, form]);

  const handlePhotoUpload = (file) => {
    setPhoto(file);
    return false;
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", values?.email);

      if (photo) {
        formData.append("photo", photo);
      }

      // Solo añadir la nueva contraseña si se proporciona
      if (values.password) {
        formData.append("password", values.password);
      }

      const response = await axios.put(
        "http://localhost:4000/api/admin/editprofile",
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
      setUser(response.data.admin);
      navigate("/adminpanel/profile");
    } catch (error) {
      setLoading(false);
      console.error("Error al actualizar el perfil:", error);
      if (error.response && error.response.data) {
        const { message } = error.response.data;

        if (message === "Email ya se encuentra en uso / registrado") {
          setEmailError("Email ya se encuentra en uso / registrado");
        } else {
          message.error(message);
        }
      } else {
        message.error("Error en la actualización del perfil");
      }
    }
    console.log(values);
  };

  return (
    <Row justify="center" align="middle" style={{ marginTop: "20px" }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card title="Editar Perfil">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Email */}
            <Form.Item
              name="email"
              label="Email"
              className="form-item"
              rules={[{ type: "email", message: "Email válido" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            {emailError && <p className="error_form">{emailError}</p>}

            <Form.Item
              name="password"
              label="Contraseña Actual"
              rules={[
                {
                  required: true,
                  message: "Por favor, ingresa tu contraseña actual",
                },
              ]}
            >
              <Input.Password placeholder="Contraseña Actual" />
            </Form.Item>

            {/* Foto */}
            <div className="login-container">
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="photo" label="Foto" className="form-item">
                  <Dragger name="photo" beforeUpload={handlePhotoUpload}>
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
            </div>

            {/* Botón de enviar */}
            <div className="admeditbnt">
              <Button type="primary" htmlType="submit" loading={loading} block>
                Actualizar Perfil
              </Button>

              <Link to="/adminpanel/profile">
                <Button block htmlType="button" loading={loading}>
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

export default EditAdminProfile;
