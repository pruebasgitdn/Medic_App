import React, { useEffect, useState } from "react";
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
  Select,
} from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Dragger } = Upload;

  // Manejar el archivo de foto
  const handlePhotoUpload = (file) => {
    setPhoto(file);
    return false;
  };
  const handleDocumentUpload = (file) => {
    setDocument(file);
    return false;
  };

  //Setear el doctor seleccionado
  const handleEdit = (doctor) => {
    setSelectedPatient(doctor);
    setIsModalVisible(true);
  };

  const CloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    //Rellenar form con el tan seteado
    form.setFieldsValue({
      nombre: selectedPatient?.nombre,
      apellido_pat: selectedPatient?.apellido_pat,
      apellido_mat: selectedPatient?.apellido_mat,
      email: selectedPatient?.email,
      telefono: selectedPatient?.telefono,
      direccion: selectedPatient?.direccion,
      genero: selectedPatient?.genero,
    });

    //Pacientes
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/getPatients",
          {
            withCredentials: true,
          }
        );
        setPatients(response.data.patients);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatients();
  }, [selectedPatient, form]);

  // Configuración de las columnas para la tabla
  const columns = [
    {
      title: "Foto",
      dataIndex: "photo",
      key: "photo",
      render: (_, photo) => (
        <img
          src={photo.url || "placeholder-image-url"}
          alt="Patient Image"
          className="admindoctorsimg"
        />
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Apellido",
      dataIndex: "apellido_pat",
      key: "apellido_pat",
      render: (text) => text || "N/A",
    },
    {
      title: "Tipo ID",
      dataIndex: "identificacion_tipo",
      key: "identificacion_tipo",
      render: (text) => text || "N/A",
    },
    {
      title: "#ID",
      dataIndex: "identificacion_numero",
      key: "identificacion_numero",
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
      title: "Acciones",
      key: "acciones",
      render: (record) => (
        <div className="adminperfil_btns">
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de que quieres eliminar este paciente?"
            onConfirm={() => handleDelete(record._id)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("nombre", values?.nombre);
      formData.append("apellido_pat", values?.apellido_pat);
      formData.append("apellido_mat", values?.apellido_mat);
      formData.append("email", values?.email);
      formData.append("telefono", values?.telefono);
      formData.append("genero", values?.genero);
      formData.append("direccion", values?.direccion);

      if (photo) {
        formData.append("photo", photo);
      }

      if (document) {
        formData.append("document_id", document);
      }

      const response = await axios.put(
        `http://localhost:4000/api/admin/editpatient/${selectedPatient._id}`,
        formData,
        {
          withCredentials: true,
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
      message.error("Error al actualizar paciente");
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
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/admin/deletepatient/${id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        message.success("Paciente eliminado correctamente");
        navigate("/adminpanel/profile");
        setPatients((prev) => prev.filter((doctor) => doctor._id !== id));
      }
    } catch (error) {
      message.error("Error al eliminar el paciente");
      console.log(error);
    }
  };
  return (
    <div>
      <h4 className="nooverflow">Administrar Pacientes </h4>

      {/* Tabla de pacientes */}
      <Table
        columns={columns}
        dataSource={patients.map((patient) => ({
          ...patient,
          key: patient._id,
        }))}
        pagination={{ pageSize: 5 }} // Numero de filas por página
      />

      <Modal
        title="Editar Doctor"
        open={isModalVisible}
        onCancel={CloseModal}
        footer={[]}
      >
        {selectedPatient && (
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ min: 3, message: "Nombre mayor a 3 digitos" }]}
              className="form-item"
            >
              <Input placeholder="Nombre" />
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
                  <Input placeholder="Apellido Patern" />
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
                { min: 10, message: "Numero mayor a 10 digitos" },
                {
                  max: 12,
                  message: "Maximo 11 digitos",
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
                    name="document_id"
                    label="Documento de Identidad"
                    className="form-item"
                  >
                    <Dragger
                      name="document_id"
                      beforeUpload={handleDocumentUpload}
                    >
                      <Button
                        className="form-upload-btn"
                        icon={<UploadOutlined />}
                      >
                        Documento
                      </Button>
                    </Dragger>
                    {selectedPatient.document_id?.url && (
                      <img
                        src={selectedPatient.document_id.url}
                        alt="Foto"
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
                    {selectedPatient?.photo?.url && (
                      <img
                        src={selectedPatient.photo.url}
                        alt="Foto"
                        style={{ width: "80%", marginTop: "10px" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* Botón de enviar */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Actualizar Perfil
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminPatients;
