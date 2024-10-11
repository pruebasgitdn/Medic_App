import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  Card,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Dragger } = Upload;

const DoctorSupports = () => {
  const [supports, setSupports] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [file, setFile] = useState([]);
  const [resueltos, setResueltos] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFileUpload = (file) => {
    setFile(file);
    return false;
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/doctor/mysupports",
          {
            withCredentials: true,
          }
        );

        const tickets = response.data.tickets;
        setSupports(tickets);

        // Filtrar pendientes y resueltos
        const pendientesFiltrados = tickets.filter(
          (s) => s.estado === "PENDIENTE"
        );
        const resueltosFiltrados = tickets.filter(
          (s) => s.estado === "RESUELTO"
        );

        setPendientes(pendientesFiltrados);
        setResueltos(resueltosFiltrados);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []); // Asegúrate de no incluir `supports` en las dependencias para evitar bucles infinitos

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("asunto", values.asunto);
      formData.append("description", values.description);

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        "http://localhost:4000/api/doctor/support",
        formData,

        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        message.success("Ticket del Doctor enviado con éxito");
        setLoading(false);
        navigate("/doctorpanel/profile");
        setFile(null); // Reiniciar el archivo
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al enviar el formulario:", error);
      message.error("Error en la solicitud, intente nuevamente");
    }
  };

  console.log(pendientes);
  console.log(supports);

  return (
    <div>
      <Button type="primary" onClick={showModal} id="addsupport">
        Crear nueva solicitud de soporte
      </Button>

      <Modal
        title="Formulario de Soporte"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          name="supportForm"
        >
          <Form.Item
            name="asunto"
            label="Asunto"
            className="form-item"
            rules={[
              { required: true, message: "Por favor ingrese el asunto" },
              { min: 8, message: "El asunto debe tener al menos 8 caracteres" },
            ]}
          >
            <Input placeholder="Ingrese el asunto de su solicitud" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
            className="form-item"
            rules={[
              { required: true, message: "Por favor ingrese una descripción" },
              { min: 8, message: "Minimo 8 caracteres" },
              { max: 150, message: "Máximo 150 caracteres" },
            ]}
          >
            <TextArea rows={4} placeholder="Describa su problema o solicitud" />
          </Form.Item>

          <Form.Item name="file" className="form-item" label="Adjuntar archivo">
            <Dragger name="file" beforeUpload={handleFileUpload}>
              <Button icon={<UploadOutlined />}>Adjuntar archivo</Button>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              form="supportForm"
              block
            >
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <h3>Solicitudes Pendientes</h3>
            {pendientes.length > 0 ? (
              pendientes.map((p) => (
                <>
                  <Card key={p.id} className="colgap">
                    <p>
                      <b>Asunto: </b>
                      {p.asunto}
                    </p>
                    <p>
                      <b>Descripcion: </b>
                      {p.description}
                    </p>
                  </Card>
                </>
              ))
            ) : (
              <p>No hay solicitudes pendientes</p>
            )}
          </Col>
          <Col span={12}>
            <h3>Solicitudes Resueltas</h3>
            {resueltos.length > 0 ? (
              resueltos.map((r) => (
                <Card key={r.id} className="colgap">
                  <p>
                    <b>Asunto: </b>
                    {r.asunto}
                  </p>
                  <p>
                    <b>Descripcion: </b>
                    {r.description}
                  </p>
                  <hr />
                  <p>
                    <b>Respuesta: </b>
                    <br />
                    {r.respuestaAdmin}
                  </p>
                </Card>
              ))
            ) : (
              <p>No hay solicitudes resueltas</p>
            )}
          </Col>
        </Row>
      </div>
      {/* Mostrar solicitudes pendientes */}

      {/* Mostrar solicitudes resueltas */}
    </div>
  );
};

export default DoctorSupports;
