import { useEffect, useContext, useState } from "react";
import { Form, Input, Button, Row, Col, Upload, Card, message } from "antd";
import { Context } from "../main";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Link } from "react-router-dom";

const EditDoctorProfile = () => {
  const { user, setUser } = useContext(Context);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null); // Foto del paciente
  const [licencia, setLicencia] = useState(null);
  const { Dragger } = Upload;

  // Manejar el archivo de foto
  const handlePhotoUpload = (file) => {
    setPhoto(file);
    return false; //  evita  subir el archivo automáticamente
  };

  // Manejar el archivo de foto
  const handleLicenseUpload = (file) => {
    setLicencia(file);
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
      especialidad: user?.especialidad,
      genero: user?.genero,
      numero_licencia: user?.numero_licencia,
    });
  }, [user, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("nombre", values?.nombre);
      formData.append("apellido_pat", values?.apellido_pat);
      formData.append("apellido_mat", values?.apellido_mat);
      formData.append("email", values?.email);
      formData.append("especialidad", values?.especialidad);
      formData.append("telefono", values?.telefono);
      formData.append("numero_licencia", values?.numero_licencia);

      if (photo) {
        formData.append("photo", photo);
      }

      if (licencia) {
        formData.append("licencia", licencia);
      }

      const response = await axios.put(
        "http://localhost:4000/api/doctor/editprofile",
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
      setUser(response.data.doctor);
      navigate("/doctorpanel/profile");
    } catch (error) {
      setLoading(false);
      console.error("Error al actualizar el perfil:", error);

      if (error.response && error.response.data) {
        //Extraer mensaje del da respuesta
        const { message } = error.response.data;
        if (message === "Email ya se encuentra en uso / registrado") {
          setEmailError(message);
        } else {
          message.error(message);
        }
      }
    }
    console.log(values);
  };
  return (
    <Row justify="center" align="middle" style={{ marginTop: "20px" }}>
      <Col xs={24} sm={22} md={18} lg={16}>
        <Card title="Editar Perfil">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Nombre */}
            <Form.Item
              name="nombre"
              label="Nombre"
              className="form-item"
              rules={[{ min: 3, message: "Nombre mayor a 3 digitos" }]}
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

            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                {/* ESPECIALIDAD */}
                <Form.Item
                  name="especialidad"
                  label="Especialidad"
                  rules={[{ min: 5, message: "Mayor a 5 digitos" }]}
                  className="form-item"
                >
                  <Input placeholder="Especialidad" />
                </Form.Item>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                {/* LICENCIA */}
                <Form.Item
                  name="numero_licencia"
                  label="Licencia"
                  className="form-item"
                  rules={[{ max: 6, message: "Maximo a 6 digitos" }]}
                >
                  <Input placeholder="Nmuero de licencia" />
                </Form.Item>
              </Col>
            </Row>

            {/* ARCHIVOS */}
            <Form.Item label="Archivos">
              <Row justify="space-between">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Item
                    name="licencia"
                    label="Licencia"
                    className="form-item"
                  >
                    <Dragger beforeUpload={handleLicenseUpload} name="licencia">
                      <Button icon={<UploadOutlined />}>
                        Seleccionar Licencia
                      </Button>
                    </Dragger>
                    {user?.licencia?.url && (
                      <img
                        src={user.licencia.url}
                        alt="Licencia"
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
                        alt="Licencia"
                        style={{ width: "80%", marginTop: "10px" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* Botón de enviar */}
            <Form.Item>
              <div className="btns_block">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Actualizar Perfil
                </Button>

                <Link to="/doctorpanel/profile">
                  <Button block>Cancelar</Button>
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default EditDoctorProfile;
