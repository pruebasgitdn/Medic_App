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
  Popconfirm,
  Modal,
  List,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Dragger } = Upload;

const PatientSupport = () => {
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
          "http://localhost:4000/api/patient/mysupports",
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
  }, []);

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
        "http://localhost:4000/api/patient/support",
        formData,

        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        message.success("Ticket del Paciente enviado con éxito");
        setLoading(false);
        navigate("/userpanel/profile");
        setFile(null); // Reiniciar el archivo
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al enviar el formulario:", error);
      message.error("Error en la solicitud, intente nuevamente");
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:4000/api/patient/deletesupport/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Soporte eliminado correctamente.");
        navigate("/userpanel/profile");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al eliminar el soporte:", error);
      message.error("No se pudo eliminar el soporte.");
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
          layout="vertical"
          onFinish={handleSubmit}
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
            <Button type="primary" htmlType="submit" block>
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
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  pageSize: 10,
                }}
                dataSource={pendientes}
                renderItem={(pendiente) => (
                  <Card key={pendiente.id} className="colgap">
                    <p>
                      <b>Asunto: </b>
                      {pendiente.asunto}
                    </p>
                    <p>
                      <b>Descripcion: </b>
                      {pendiente.description}
                    </p>
                    <p id="smcenter">
                      <b>Creado el: </b>
                      {new Date(pendiente.createdAt).toLocaleDateString()}
                    </p>

                    <div id="div_img_supp">
                      {pendiente?.file?.url ? (
                        <>
                          <img
                            src={pendiente?.file?.url}
                            id="img_supp"
                            alt=""
                          />
                        </>
                      ) : (
                        <>
                          <p className="nooverflow" id="no_img_supp">
                            No se proporcionó la imagen.
                          </p>
                        </>
                      )}
                    </div>
                    <br />
                    <div className="nooverflow">
                      <Popconfirm
                        title="¿Estás seguro de que quieres eliminar esta solicitud?"
                        onConfirm={() => handleDeleteTicket(pendiente._id)}
                        okText="Sí"
                        cancelText="No"
                      >
                        <Button
                          danger
                          block
                          size="small"
                          type="primary"
                          loading={loading}
                        >
                          Cancelar Solicitud
                        </Button>
                      </Popconfirm>
                    </div>
                  </Card>
                )}
              />
            ) : (
              <p className="nooverflow">No hay solicitudes pendientes</p>
            )}
          </Col>
          <Col span={12}>
            <h3>Solicitudes Resueltas</h3>
            {resueltos.length > 0 ? (
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  pageSize: 10,
                }}
                dataSource={resueltos}
                renderItem={(resuelto) => (
                  <Card key={resuelto.id} className="colgap">
                    <p>
                      <b>Asunto: </b>
                      {resuelto.asunto}
                    </p>
                    <p>
                      <b>Descripcion: </b>
                      {resuelto.description}
                    </p>
                    <hr />
                    <p>
                      <b>Respuesta: </b>
                      <br />
                      {resuelto.respuestaAdmin}
                    </p>
                    <p id="smcenter">
                      <b>Creado el: </b>
                      {new Date(resuelto.createdAt).toLocaleDateString()}
                    </p>
                    <div id="div_img_supp">
                      {resuelto?.file?.url ? (
                        <>
                          <img src={resuelto?.file?.url} id="img_supp" alt="" />
                        </>
                      ) : (
                        <>
                          <p className="nooverflow" id="no_img_supp">
                            No se proporcionó la imagen.
                          </p>
                        </>
                      )}
                    </div>
                  </Card>
                )}
              />
            ) : (
              <p className="nooverflow">No hay solicitudes resueltas</p>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PatientSupport;
