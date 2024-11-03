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
  Avatar,
} from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";

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
  const { Option } = Select;
  const [statusFilter, setStatusFilter] = useState("activo"); // Estado por defecto
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    // Filtrar los doctores por estado
    const filtered = patients.filter(
      (patient) =>
        (statusFilter === "activo" && patient.estado === "activo") ||
        (statusFilter === "retirado" && patient.estado === "retirado")
    );
    setFilteredPatients(filtered);
  }, [statusFilter, patients]);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

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
    setEmailError("");
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
      render: (_, selectedPatient) => (
        <Avatar src={selectedPatient?.photo?.url} className="admindoctorsimg" />
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
          <Button
            onClick={() => handleEdit(record)}
            size="small"
            type="primary"
          >
            Editar
          </Button>

          {record.estado == "activo" ? (
            <>
              <Popconfirm
                title="¿Estás seguro de que quieres inhabilitar este paciente?"
                onConfirm={() => handleDelete(record._id)}
                okText="Sí"
                cancelText="No"
              >
                <Button danger size="small">
                  Inhabilitar
                </Button>
              </Popconfirm>
            </>
          ) : (
            <>
              <Popconfirm
                title="¿Estás seguro de que quieres habilitar este paciente?"
                onConfirm={() => handleEnable(record._id)}
                okText="Sí"
                cancelText="No"
              >
                <Button type="dashed" size="small">
                  Habilitar
                </Button>
              </Popconfirm>
            </>
          )}
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
        message.success("Paciente inhabilitado correctamente");
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient._id === id ? { ...patient, estado: "retirado" } : patient
          )
        );
      }
    } catch (error) {
      if (
        error.response ||
        error.response.data ||
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      }
      message.error("Error al inhabilitar el paciente");
      console.log(error);
    }
  };

  const handleEnable = async (patientId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/enablepatient/${patientId}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        message.success("Paciente habilitado nuevamente");
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient._id === patientId
              ? { ...patient, estado: "activo" }
              : patient
          )
        );
      }
    } catch (error) {
      message.error("Error al conectar el paceiente de nuevo");
      console.log(error);
    }
  };

  return (
    <div>
      <h4 className="nooverflow">Administrar Pacientes </h4>
      <Row className="admin_crud_head">
        <Select
          onChange={handleStatusChange}
          defaultValue="activo"
          title="Estado"
          style={{ width: 180 }}
        >
          <Option value="activo">Activo</Option>
          <Option value="retirado">Retirado</Option>
        </Select>
      </Row>

      {/* Tabla de pacientes */}
      <Table
        columns={columns}
        dataSource={filteredPatients.map((patient) => ({
          ...patient,
          key: patient._id,
        }))}
        pagination={{ pageSize: 6 }} // Numero de filas por página
      />

      <Modal
        title="Editar Paciente"
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

            <Row>
              {/* Email */}
              <Col xs={24} md={12}>
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

              <Col xs={24} md={12}>
                {/* Teléfono */}
                <Form.Item
                  name="telefono"
                  label="Teléfono"
                  className="form-item"
                  rules={[
                    { min: 10, message: "Numero mayor a 10 digitos" },
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
                  {/* <Input placeholder="Teléfono" /> */}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} md={12}>
                {/* Dirección */}
                <Form.Item
                  name="direccion"
                  className="form-item"
                  label="Dirección"
                  rules={[{ min: 8, message: "Mayor a 8 digitos" }]}
                >
                  <Input placeholder="Dirección" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                {/* Género */}
                <Form.Item name="genero" className="form-item" label="Género">
                  <Select placeholder="Seleccione su género">
                    <Option value="HOMBRE">Hombre</Option>
                    <Option value="MUJER">Mujer</Option>
                    <Option value="OTRO">Otro</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

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
                      <div className="docu_cc">
                        <img
                          src={selectedPatient.document_id.url}
                          alt="Foto"
                          className="edit_document"
                        />
                      </div>
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
                      <div className="docu_cc">
                        <img
                          src={selectedPatient.photo.url}
                          alt="Foto"
                          className="edit_document"
                        />
                      </div>
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
                  block
                  loading={loading}
                >
                  Actualizar Perfil
                </Button>
                <Button type="dashed" block onClick={CloseModal}>
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

export default AdminPatients;
