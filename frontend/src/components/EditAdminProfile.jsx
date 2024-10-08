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
// import { UploadOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EditAdminProfile = () => {
  const { user, setUser } = useContext(Context);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null); // Foto del paciente
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    //Del manejo del form del useForm de ant, nos permite rellenar los inputs con el nombre del input y valor
    form.setFieldsValue({
      email: user?.email,
    });
  }, [user, form]);

  const handlePhotoUpload = (file) => {
    setPhoto(file);
    return false;
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      //FormData para manejo de archivos y agrupacion
      const formData = new FormData();
      formData.append("email", values?.email);

      if (photo) {
        formData.append("photo", photo);
      }

      // Enviar los datos al servidor
      const response = await axios.put(
        "http://localhost:4000/api/admin/editprofile",
        formData,
        {
          withCredentials: true, // Para asegurarse de que las cookies se manejen correctamente
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Datos actualizados exitosamente");
      setLoading(false);
      setUser(response.data.admin);
      navigate("/adminpanel/profile"); // Redirigir a la página
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
    }
    console.log(values);
  };
  return (
    <Row justify="center" align="middle" style={{ marginTop: "20px" }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card title="Editar Perfil">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              genero: "HOMBRE", // Valor por defecto
            }}
            onFinish={onFinish}
          >
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

            {/* foto */}

            <div className="login-container">
              <Form.Item name="photo" label="Foto" className="form-item">
                <Upload beforeUpload={handlePhotoUpload} showUploadList={false}>
                  <Button icon={<UploadOutlined />}>Seleccionar Foto</Button>
                </Upload>
                {user?.photo?.url && (
                  <img
                    src={user.photo.url}
                    alt="Foto"
                    style={{ width: "80%", marginTop: "10px" }} // Estilo opcional
                  />
                )}
              </Form.Item>
            </div>
            {/* Botón de enviar */}
            <div className="admeditbnt">
              <Button type="primary" htmlType="submit" loading={loading} block>
                Actualizar Perfil
              </Button>

              <Link to="/adminpanel/profile">
                {" "}
                <Button block htmlType="submit" loading={loading}>
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
