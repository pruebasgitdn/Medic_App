import { useEffect, useContext, useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Card,
  message as tt,
  Switch,
} from "antd";
import { Context } from "../main";
import { UploadOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const { Dragger } = Upload;

const EditAdminProfile = () => {
  const { user, setUser } = useContext(Context);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null); // Foto del paciente
  const [emailError, setEmailError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
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
      const formData = new FormData();
      formData.append("email", values?.email);
      formData.append("currentPassword", values?.yourPassword);

      if (photo) {
        formData.append("photo", photo);
      }

      if (changingPassword && values.newPassword) {
        formData.append("newPassword", values.newPassword);
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

      tt.success("Datos actualizados exitosamente");
      setLoading(false);
      setUser(response.data.admin);
      navigate("/adminpanel/profile");

      console.log(values);
      setLoading(false);
    } catch (error) {
      if (
        error.response ||
        error.response.data ||
        error.response.data.message
      ) {
        tt.error(error.response.data.message);
        setLoading(false);
      }

      const { message } = error.response.data;

      if (message === "Email ya se encuentra en uso / registrado") {
        setEmailError("Email ya se encuentra en uso / registrado");
      } else {
        tt.error(message);
      }
      console.log(error);
    }
    console.log(values);
  };

  const handlePasswordChange = () => {
    setChangingPassword(!changingPassword);
    form.resetFields(["newPassword", "yourPassword"]);
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

            {/* Cambiar contraseña */}
            <Form.Item className="centere">
              <div className="content_flex">
                <h4>Cambiar de contraseña:</h4>
                <Switch
                  autoFocus={false}
                  checked={changingPassword}
                  onChange={handlePasswordChange}
                  id="switch"
                >
                  {changingPassword ? (
                    <Button danger size="small">
                      Cancelar cambio de contraseña
                    </Button>
                  ) : (
                    <Button size="small">Cambiar contraseña</Button>
                  )}
                </Switch>
              </div>
            </Form.Item>

            {changingPassword && (
              <>
                <Row gutter={8}>
                  <Col xs={20} md={12}>
                    <Form.Item
                      name="yourPassword"
                      label="Tu contraseña actual"
                      className="form-item"
                    >
                      <Input.Password placeholder="Contraseña actual" />
                    </Form.Item>
                    <p id="xlr">
                      Ingresa tu contraseña actual para confirmar los cambios:
                    </p>
                  </Col>
                  <Col xs={20} md={12}>
                    <Form.Item
                      name="newPassword"
                      label="Confirmar"
                      className="form-item"
                      rules={[
                        {
                          min: 8,
                          message: "Minimo 8 caracteres",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Confirmar Nueva Contraseña" />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

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
                    <div className="docu_cc">
                      <img
                        src={user.photo.url}
                        alt="Foto"
                        className="edit_document"
                      />
                    </div>
                  )}
                </Form.Item>
              </Col>
            </div>

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
