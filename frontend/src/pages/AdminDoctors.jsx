import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Col,
  Row,
  Upload,
  message,
  Popconfirm,
  Avatar,
} from "antd";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [photo, setPhoto] = useState(null); // Foto del paciente
  const [licencia, setLicencia] = useState(null);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const { Dragger } = Upload;

  useEffect(() => {
    form.setFieldsValue({
      nombre: selectedDoctor?.nombre,
      apellido_pat: selectedDoctor?.apellido_pat,
      apellido_mat: selectedDoctor?.apellido_mat,
      email: selectedDoctor?.email,
      telefono: selectedDoctor?.telefono,
      especialidad: selectedDoctor?.especialidad,
      numero_licencia: selectedDoctor?.numero_licencia,
    });
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/getDoctors",
          {
            withCredentials: true,
          }
        );
        setDoctors(response.data.doctors);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctors();
  }, [form, selectedDoctor]);

  //manejar el archivo de foto
  const handlePhotoUpload = (file) => {
    setPhoto(file);
    return false;
  };

  //manejar el archivo de licencia
  const handleLicenseUpload = (file) => {
    setLicencia(file);
    return false;
  };

  //Setear el doctor seleccionado
  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalVisible(true);
  };

  // Cerrar el modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Editar doctor
  const handleForm = async (values) => {
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
        `http://localhost:4000/api/admin/editdoctor/${selectedDoctor._id}`,
        formData,
        {
          withCredentials: true, // Para asegurarse de que las cookies se manejen correctamente
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        setLoading(false);
        message.success("Datos actualizados exitosamente");
        navigate("/adminpanel/profile");
      } else {
        message.error("Error");
      }

      console.log(values);
      console.log("FormData values:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    } catch (error) {
      console.log(error);
      message.error("Error al actualizar doctor");
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
    console.log(selectedDoctor._id);
  };

  //Eliminar doctor
  const handleDelete = async (doctorId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/admin/deletedoctor/${doctorId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        message.success("Doctor eliminado correctamente");
        navigate("/adminpanel/profile");
        setDoctors((prev) => prev.filter((doctor) => doctor._id !== doctorId));
      }
    } catch (error) {
      message.error("Error al eliminar el doctor");
      console.log(error);
    }
  };

  // Configuración de las columnas para la tabla
  const columns = [
    {
      title: "Foto",
      dataIndex: "photo",
      key: "photo",
      render: (_, selectedDoctor) => (
        <Avatar
          src={selectedDoctor?.photo?.url || "placeholder-image-url"}
          alt="Doctor"
          className="admindoctorsimg"
        />
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      render: (text) => text || "N/A",
    },
    {
      title: "Apellido",
      dataIndex: "apellido_pat",
      key: "apellido_pat",
      render: (text) => text || "N/A",
    },

    {
      title: "Especialidad",
      dataIndex: "especialidad",
      key: "especialidad",
      render: (text) => text || "N/A",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      render: (text) => text || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "N/A",
    },
    {
      title: "Número de Licencia",
      dataIndex: "numero_licencia",
      key: "numero_licencia",
      render: (text) => text || "N/A",
    },

    {
      title: "Acciones",
      key: "acciones",
      render: (_, doctor) => (
        <div className="adminperfil_btns">
          <Button type="link" onClick={() => handleEdit(doctor)} size="small">
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de que quieres eliminar este doctor?"
            onConfirm={() => handleDelete(doctor._id)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger size="small">
              Eliminar
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h4 className="nooverflow">Administrar doctores </h4>
      <Link to="/adminpanel/formdoctor">
        <Button type="primary">Agregar doctor</Button>
      </Link>

      {/* Tabla de doctores */}
      <Table
        columns={columns}
        dataSource={doctors.map((doctor) => ({ ...doctor, key: doctor._id }))}
        pagination={{ pageSize: 5 }} // Número de filas por página
      />

      {/* MODAL DOCTOR EDITAR */}
      <Modal
        title="Editar Doctor"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[]}
      >
        {selectedDoctor && (
          <Form layout="vertical" form={form} onFinish={handleForm}>
            <Form.Item
              label="Nombre"
              name="nombre"
              className="form-item"
              rules={[{ min: 3, message: "Nombre mayor a 3 digitos" }]}
            >
              <Input placeholder={selectedDoctor.nombre} />
            </Form.Item>

            {/* Apellido Paterno */}
            <Row>
              <Col xs={24} md={12}>
                <Form.Item
                  name="apellido_pat"
                  label="Apellido 1"
                  className="form-item"
                  rules={[{ min: 3, message: "Apellido mayor a 3 digitos" }]}
                >
                  <Input
                    placeholder="Apellido Paterno"
                    value={selectedDoctor.apellido_pat}
                  />
                </Form.Item>
              </Col>

              {/* Apellido Materno */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="apellido_mat"
                  label="Apellido 2"
                  className="form-item"
                  rules={[{ min: 3, message: "Apellido mayor a 3 digitos" }]}
                >
                  <Input placeholder="Apellido Materno" />
                </Form.Item>
              </Col>
            </Row>
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

            {/* ESPECIALIDAD */}
            <Form.Item
              name="especialidad"
              label="Especialidad"
              rules={[{ min: 5, message: "Mayor a 5 digitos" }]}
              className="form-item"
            >
              <Input placeholder="Especialidad" />
            </Form.Item>

            {/* LICENCIA */}
            <Form.Item
              name="numero_licencia"
              label="Licencia"
              className="form-item"
              rules={[{ max: 6, message: "Maximo a 6 digitos" }]}
            >
              <Input placeholder="Nmuero de licencia" />
            </Form.Item>

            {/* ARCHIVOS */}
            <Form.Item label="Archivos">
              <Row justify="space-between">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Item
                    name="licencia"
                    label="Licencia"
                    className="form-item"
                  >
                    <Dragger name="licencia" beforeUpload={handleLicenseUpload}>
                      <Button
                        className="form-upload-btn"
                        icon={<UploadOutlined />}
                      >
                        Licencia
                      </Button>
                    </Dragger>
                    {selectedDoctor?.licencia?.url && (
                      <img
                        src={selectedDoctor.licencia.url}
                        alt="Licencia"
                        style={{ width: "80%", marginTop: "10px" }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Item name="photo" label="Foto" className="form-item">
                    <Dragger name="photo" beforeUpload={handlePhotoUpload}>
                      <Button
                        className="form-upload-btn"
                        icon={<UploadOutlined />}
                      >
                        Seleccionar Foto
                      </Button>
                    </Dragger>
                    {selectedDoctor?.photo?.url && (
                      <img
                        src={selectedDoctor.photo.url}
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
              <div className="btns_login">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Actualizar Perfil
                </Button>
                <Button key="cancel" block onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminDoctors;
