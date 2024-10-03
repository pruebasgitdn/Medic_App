import React, { useEffect, useContext, useState } from "react";
import { Form, Input, Button, Select, Row, Col, Upload, Card } from "antd";
import { Context } from "../main";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const EditPatientProfile = () => {
  const { user, setUser } = useContext(Context);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null); // Foto del paciente

  // Función para manejar el archivo de foto
  const handleFileUpload = (file) => {
    setPhoto(file);
    return false; // Esto evita que Ant Design intente subir el archivo automáticamente
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
      if (photo) {
        formData.append("photo", photo);
      }

      // Enviar los datos al servidor
      const response = await axios.put(
        "http://localhost:4000/api/patient/editprofile",
        formData,
        {
          withCredentials: true, // Para asegurarse de que las cookies se manejen correctamente
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      setUser(response.data.patient);
      toast.success("Cambio de datos exitoso");
      navigate("/userpanel/profile"); // Redirigir a la página de perfil
    } catch (error) {
      setLoading(false);
      console.error("Error al actualizar el perfil:", error);
    }
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
            {/* Nombre */}
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ min: 3, message: "Nombre mayor a 3 digitos" }]}
              className="form-item"
            >
              <Input placeholder="Nombre" />
            </Form.Item>

            {/* Apellido Paterno */}
            <Form.Item
              name="apellido_pat"
              label="Apellido Paterno"
              className="form-item"
              rules={[{ min: 3, message: "Apellido mayor a 3 digitos" }]}
            >
              <Input placeholder="Apellido Paterno" />
            </Form.Item>

            {/* Apellido Materno */}
            <Form.Item
              name="apellido_mat"
              label="Apellido Materno"
              className="form-item"
              rules={[{ min: 3, message: "Apellido mayor a 3 digitos" }]}
            >
              <Input placeholder="Apellido Materno" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              label="Email"
              className="form-item"
              rules={[{ type: "email", message: "Email valido" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            {/* Teléfono */}
            <Form.Item
              name="telefono"
              label="Teléfono"
              className="form-item"
              rules={[
                { min: 10, message: "Numero mayor a 10 digitos" },
                {
                  max: 12,
                  message: "Maximo 12 digitos",
                },
              ]}
            >
              <Input placeholder="Teléfono" />
            </Form.Item>

            {/* Dirección */}
            <Form.Item
              name="direccion"
              className="form-item"
              label="Dirección"
              rules={[{ min: 8, message: "Mayor a 8 digitos" }]}
            >
              <Input placeholder="Dirección" />
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
                    label="Documento de Identidad"
                    className="form-item"
                  >
                    <Upload
                      beforeUpload={handleFileUpload}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>
                        Seleccionar Documento
                      </Button>
                    </Upload>
                    {user?.document_id?.url && (
                      <img
                        src={user.document_id.url}
                        alt="Foto"
                        style={{ width: "80%", marginTop: "10px" }} // Estilo opcional
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Item label="Foto" className="form-item">
                    <Upload
                      beforeUpload={handleFileUpload}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>
                        Seleccionar Foto
                      </Button>
                    </Upload>
                    {user?.photo?.url && (
                      <img
                        src={user.photo.url}
                        alt="Foto"
                        style={{ width: "80%", marginTop: "10px" }} // Estilo opcional
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* Botón de enviar */}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Actualizar Perfil
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default EditPatientProfile;
