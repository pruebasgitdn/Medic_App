import React, { useEffect, useState } from "react";
import {
  Card,
  message,
  List,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Avatar,
} from "antd";

import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [alergia, setAlergias] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // Estado para los 2 modales
  const [selectedPatient, setSelectedPatient] = useState(null); // paciente seleccionado
  const { Dragger } = Upload;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [formail] = Form.useForm();
  const navigate = useNavigate();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // Modal para correo
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleUploadFile = (file) => {
    setFile(file);
    return false;
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/doctor/getpatients",
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setPatients(response.data.pacientes);
        } else {
          message.error("No se encontraron citas para el doctor.");
        }
      } catch (error) {
        console.log(error);
        message.error("Error al cargar las citas.");
      }
    };
    fetchAppointment();
  }, []);

  const showModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const showReportModal = (patient) => {
    setSelectedPatient(patient);
    setIsReportModalOpen(true); // Modal de historial
  };

  const handleOk = () => {
    setIsReportModalOpen(false);
  };
  const handleAlergieOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsReportModalOpen(false); // Cierra ambos modales
  };

  //  modal de correo
  const showEmailModal = (patient) => {
    setSelectedPatient(patient);
    setIsEmailModalOpen(true);
  };

  const handleEmailCancel = () => {
    setIsEmailModalOpen(false);
  };

  const handleForm = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/doctor/newallergie/${selectedPatient._id}`,
        { alergia },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Dato enviado correctamente!");
        navigate("/doctorpanel/profile");
        console.log(selectedPatient._id);
        console.log(alergia);
      }
    } catch (error) {
      message.error("Error al enviar los datos");
      console.log(error);
    }
  };

  const deleteAllergie = async (item, index) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/doctor/delleteallergie/${item._id}/${index}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        message.success("Alergia eliminada correctamente");

        navigate("/doctorpanel/profile");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      if (
        error.response ||
        error.response.data ||
        error.response.data.message
      ) {
        message.error(error.response.data.message || error.response.data);
      }
      message.error("Error al eliminar la alergia");
      console.log(error);
    }
  };

  const handleMail = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("asunto", values?.asunto);
      formData.append("contenido", values?.contenido);

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        `http://localhost:4000/api/doctor/sendmail/${selectedPatient._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        message.success("Email enviado correctamente!");
        navigate("/doctorpanel/profile");
      } else {
        message.error(response.data.message);
      }
      setLoading(false);
      // console.log(values?.asunto);
      // console.log(values?.contenido);
    } catch (error) {
      if (
        error.response ||
        error.response.data ||
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="nooverflow">Pacientes e Historial</h2>
      {patients.length > 0 ? (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={patients}
          renderItem={(patient) => (
            <List.Item key={patient._id}>
              <Card
                title={`Paciente: ${patient.nombre || "N/A"} ${
                  patient.apellido_pat || "N/A"
                }`}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <div className="doctorpatient_img">
                      <Avatar
                        className="avatardocpatient"
                        src={patient?.photo?.url || "default-image-url"}
                        alt="patient"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={16}>
                    <div className="aside">
                      <p>
                        <strong>Email: </strong>
                        {patient?.email || "N/A"}
                        <br />
                        <strong>Direccion: </strong>
                        {patient?.direccion || "N/A"}
                        <br />
                        <strong>Telefono: </strong>
                        {patient?.telefono || "N/A"}
                        <br />
                        <strong>Proveedor de seguros: </strong>
                        {patient?.proovedor_seguros || "N/A"}
                        <br />
                      </p>
                      <hr />
                      <p>
                        <strong>Contacto de emergencia: </strong>
                        {patient?.nombre_contacto_emergencia || "N/A"}
                        <br />
                        <strong>Numero: </strong>
                        {patient?.numero_contacto_emergencia || "N/A"}
                        <br />
                        <br />
                        <div className="btns_flex">
                          <Button
                            block
                            id="success_btn"
                            onClick={() => showReportModal(patient)}
                            // Seteamos el estado del paciente para el moda
                          >
                            Reporte Historial
                          </Button>
                          <Button
                            block
                            id="info_btn"
                            onClick={() => showModal(patient)} // Seteamos el estado del paciente para el modal
                          >
                            Alergias
                          </Button>
                        </div>
                        <div className="btns_flex">
                          <Button
                            block
                            type="primary"
                            onClick={() => showEmailModal(patient)}
                          >
                            Enviar correo
                          </Button>
                        </div>
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Card title="No has atendido ningun paciente de momento!" />
      )}

      {/* Modal alergias */}
      <Modal
        title="Alergias del paciente"
        open={isModalOpen}
        onOk={handleAlergieOk}
        cancelText="Salir"
        okText="OK"
        onCancel={handleCancel}
        footer={[]}
      >
        {selectedPatient &&
        selectedPatient.alergias &&
        selectedPatient.alergias.length > 0 ? (
          <ul>
            {selectedPatient.alergias.map((alergiaObj, index) => (
              <li key={alergiaObj._id} id="li_alergias">
                {" "}
                <b>{index + 1}.</b> {alergiaObj}
                <Button
                  danger
                  onClick={() => deleteAllergie(selectedPatient, index)}
                >
                  <DeleteFilled />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <b>No hay alergias registradas.</b>
          </p>
        )}
        <hr />
        <br />
        <h4>Reportar novedad</h4>
        <p id="p_novedad">
          En caso de alguna novedad o anomalía en las alergias del paciente,
          notifiquelo acá:{" "}
        </p>
        <Form onFinish={handleForm} form={form}>
          <Form.Item
            label="¿ Alguna novedad ?:"
            name="alergias"
            className="form-item"
            rules={[
              {
                min: 5,
                message: "Minimo 5 caracteres",
              },
              {
                message: "Alergias del paciente.",
              },
              {
                required: true,
                message: "No se vale vacio",
              },
            ]}
          >
            <TextArea
              onChange={(text) => setAlergias(text.target.value)}
              rows={3}
              placeholder="...."
              maxLength={80}
            />
          </Form.Item>
          <Button block type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form>
      </Modal>

      {/* Modal  historial */}
      <Modal
        title={`Historial del paciente ${selectedPatient?.nombre}`}
        open={isReportModalOpen}
        onOk={handleOk}
        cancelText="Salir"
        onCancel={handleCancel}
      >
        {selectedPatient &&
        selectedPatient.reporte_historial &&
        selectedPatient.reporte_historial.length > 0 ? (
          <ul>
            {selectedPatient.reporte_historial.map((reporte, index) => (
              <Card key={index}>
                <strong>Motivo: </strong> {reporte.motivo}
                <br />
                <strong>Fecha: </strong>
                {new Date(reporte.fecha).toDateString()}
                <br />
                <strong>Diagnostico del doctor: </strong>
                {reporte.detallesDiagnostico}
                <hr />
              </Card>
            ))}
          </ul>
        ) : (
          <p>
            <b>No hay reportes en el historial.</b>
          </p>
        )}
      </Modal>

      {/* MODAL CORREO */}
      <Modal
        title={`Enviar correo a ${selectedPatient?.nombre || "Paciente"}`}
        open={isEmailModalOpen}
        onCancel={handleEmailCancel}
        footer={[]}
      >
        <Form
          layout="vertical"
          name="formail"
          form={formail}
          onFinish={handleMail}
        >
          <Form.Item
            className="fom-item"
            label="Asunto"
            name="asunto"
            rules={[
              {
                required: true,
                message: "Es alsunto es obligatorio",
              },
            ]}
          >
            <Input placeholder="Asunto..." />
          </Form.Item>
          <Form.Item
            label="Contenido del correo:"
            className="form-item"
            name="contenido"
            rules={[
              {
                required: true,
                message: "Es contenido es obligatorio",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Escribe el contenido del correo aquí..."
            />
          </Form.Item>
          <Form.Item name="file" className="form-item" label="Adjuntar archivo">
            <Dragger name="file" beforeUpload={handleUploadFile}>
              <Button icon={<UploadOutlined />}>Adjuntar archivo</Button>
            </Dragger>
          </Form.Item>
          <div className="sendmain_btns" key="oo">
            <Button
              key="submit"
              htmlType="submit"
              form="formail"
              block
              type="primary"
              loading={loading}
            >
              Enviar
            </Button>
            <Button key="cance" block onClick={handleEmailCancel}>
              Cancelar
            </Button>
            ,
          </div>
          ,
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorPatients;
